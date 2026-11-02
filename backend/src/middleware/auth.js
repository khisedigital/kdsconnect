import {User} from '../models/index.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {forbidden, unauthorized} from '../utils/errors.js';
import {verifyAccessToken} from '../utils/jwt.js';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw unauthorized('Missing Bearer token');
  }

  const token = header.slice(7).trim();
  if (!token) {
    throw unauthorized('Missing Bearer token');
  }

  const payload = verifyAccessToken(token);
  const user = await User.findByPk(payload.sub);
  if (!user || !user.isActive) {
    throw unauthorized('Account is inactive or not found');
  }

  req.user = user;
  req.auth = payload;
  next();
});

export function requireRoles(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(unauthorized());
    }
    if (!roles.includes(req.user.role)) {
      return next(forbidden('Insufficient permissions for this action'));
    }
    return next();
  };
}
