import crypto from 'node:crypto';

import {Op} from 'sequelize';

import {env} from '../config/env.js';
import {
  OtpChallenge,
  RefreshToken,
  User,
  sequelize,
} from '../models/index.js';
import {
  badRequest,
  conflict,
  unauthorized,
} from '../utils/errors.js';
import {
  accessTokenExpiresAt,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';
import {hashPassword, verifyPassword} from '../utils/password.js';

function normalizePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91${digits.slice(2)}`;
  }
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  return phone;
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function issueSession(user) {
  const accessToken = signAccessToken({
    sub: user.id,
    role: user.role,
    email: user.email,
  });
  const refreshToken = signRefreshToken({
    sub: user.id,
    role: user.role,
  });

  const decoded = verifyRefreshToken(refreshToken);
  await RefreshToken.create({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(decoded.exp * 1000),
  });

  return {
    accessToken,
    refreshToken,
    expiresAt: accessTokenExpiresAt(),
    user: user.toAuthUser(),
  };
}

export async function login({email, password}) {
  const user = await User.findOne({
    where: {email: email.toLowerCase()},
  });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw unauthorized('Invalid email or password');
  }
  if (!user.isActive) {
    throw unauthorized('Account is disabled');
  }
  return issueSession(user);
}

export async function registerRetailer(input) {
  return sequelize.transaction(async transaction => {
    const existing = await User.findOne({
      where: {email: input.email.toLowerCase()},
      transaction,
    });
    if (existing) {
      throw conflict('An account with this email already exists');
    }

    const user = await User.create(
      {
        email: input.email.toLowerCase(),
        passwordHash: await hashPassword(input.password),
        role: 'retailer',
        displayName: input.displayName,
        businessName: input.businessName,
        phone: input.phone ? normalizePhone(input.phone) : null,
      },
      {transaction},
    );

    return issueSession(user);
  });
}

export async function registerSupplier(input) {
  return sequelize.transaction(async transaction => {
    const existing = await User.findOne({
      where: {email: input.email.toLowerCase()},
      transaction,
    });
    if (existing) {
      throw conflict('An account with this email already exists');
    }

    const user = await User.create(
      {
        email: input.email.toLowerCase(),
        passwordHash: await hashPassword(input.password),
        role: 'supplier',
        displayName: input.displayName,
        businessName: input.companyName,
        taxId: input.taxId ?? null,
        phone: input.phone ? normalizePhone(input.phone) : null,
      },
      {transaction},
    );

    return issueSession(user);
  });
}

export async function getMe(userId) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw unauthorized();
  }
  return user.toAuthUser();
}

export async function changePassword(userId, {currentPassword, newPassword}) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw unauthorized();
  }
  if (!(await verifyPassword(currentPassword, user.passwordHash))) {
    throw badRequest('Current password is incorrect');
  }
  user.passwordHash = await hashPassword(newPassword);
  await user.save();
  await RefreshToken.update(
    {revokedAt: new Date()},
    {where: {userId, revokedAt: null}},
  );
  return {ok: true};
}

export async function requestPasswordReset({email, phone}) {
  // Always return ok to avoid account enumeration.
  const where = email
    ? {email: email.toLowerCase()}
    : {phone: normalizePhone(phone)};
  const user = await User.findOne({where});
  if (user) {
    // Password-reset OTP channel can be wired to SMS/email later.
    await createOtp(user.id, user.phone ?? 'n/a', 'password_reset');
  }
  return {
    ok: true,
    message: 'If an account exists, reset instructions were sent.',
  };
}

export async function refreshSession(refreshToken) {
  const payload = verifyRefreshToken(refreshToken);
  const stored = await RefreshToken.findOne({
    where: {
      userId: payload.sub,
      tokenHash: hashToken(refreshToken),
      revokedAt: null,
      expiresAt: {[Op.gt]: new Date()},
    },
  });
  if (!stored) {
    throw unauthorized('Refresh token is invalid or revoked');
  }

  stored.revokedAt = new Date();
  await stored.save();

  const user = await User.findByPk(payload.sub);
  if (!user || !user.isActive) {
    throw unauthorized();
  }
  return issueSession(user);
}

export async function logout(userId, refreshToken) {
  if (refreshToken) {
    await RefreshToken.update(
      {revokedAt: new Date()},
      {
        where: {
          userId,
          tokenHash: hashToken(refreshToken),
          revokedAt: null,
        },
      },
    );
  } else {
    await RefreshToken.update(
      {revokedAt: new Date()},
      {where: {userId, revokedAt: null}},
    );
  }
  return {ok: true};
}

async function createOtp(userId, phone, purpose) {
  const code = env.isProd
    ? String(crypto.randomInt(100000, 999999))
    : env.DEV_OTP_CODE;

  await OtpChallenge.update(
    {consumedAt: new Date()},
    {
      where: {
        userId,
        purpose,
        consumedAt: null,
      },
    },
  );

  await OtpChallenge.create({
    userId,
    phone: normalizePhone(phone),
    purpose,
    codeHash: hashToken(code),
    expiresAt: new Date(Date.now() + 10 * 60_000),
  });

  // In production, send via SMS gateway. Dev returns nothing sensitive.
  if (env.isDev) {
    return {devHint: code};
  }
  return {};
}

export async function startMobileVerification(userId, phone) {
  const normalized = normalizePhone(phone);
  const user = await User.findByPk(userId);
  if (!user) {
    throw unauthorized();
  }
  if (user.role === 'admin') {
    throw badRequest('Admin accounts do not use mobile verification');
  }

  const hint = await createOtp(userId, normalized, 'mobile_verify');
  return {
    ok: true,
    phone: normalized,
    ...hint,
  };
}

export async function verifyMobileOtp(userId, {phone, otp}) {
  const normalized = normalizePhone(phone);
  const challenge = await OtpChallenge.findOne({
    where: {
      userId,
      phone: normalized,
      purpose: 'mobile_verify',
      consumedAt: null,
      expiresAt: {[Op.gt]: new Date()},
    },
    order: [['createdAt', 'DESC']],
  });

  if (!challenge) {
    throw badRequest('OTP expired or not found. Request a new code.');
  }
  if (challenge.attempts >= 5) {
    throw badRequest('Too many OTP attempts. Request a new code.');
  }

  challenge.attempts += 1;
  await challenge.save();

  if (challenge.codeHash !== hashToken(otp)) {
    throw badRequest('Invalid OTP');
  }

  challenge.consumedAt = new Date();
  await challenge.save();

  const user = await User.findByPk(userId);
  user.phone = normalized;
  user.phoneVerified = true;
  await user.save();

  return user.toAuthUser();
}
