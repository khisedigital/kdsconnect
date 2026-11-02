import jwt from 'jsonwebtoken';

import {env} from '../config/env.js';
import {unauthorized} from './errors.js';

export function signAccessToken(payload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
  } catch {
    throw unauthorized('Invalid or expired access token');
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
  } catch {
    throw unauthorized('Invalid or expired refresh token');
  }
}

export function accessTokenExpiresAt() {
  // Approximate for client display; JWT exp is authoritative.
  const match = /^(\d+)([smhd])$/.exec(env.JWT_ACCESS_EXPIRES_IN);
  if (!match) {
    return new Date(Date.now() + 15 * 60_000).toISOString();
  }
  const value = Number(match[1]);
  const unit = match[2];
  const ms =
    unit === 's'
      ? value * 1000
      : unit === 'm'
        ? value * 60_000
        : unit === 'h'
          ? value * 3_600_000
          : value * 86_400_000;
  return new Date(Date.now() + ms).toISOString();
}
