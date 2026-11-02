import bcrypt from 'bcryptjs';

import {env} from '../config/env.js';

export async function hashPassword(plain) {
  return bcrypt.hash(plain, env.BCRYPT_ROUNDS);
}

export async function verifyPassword(plain, hash) {
  if (!plain || !hash) {
    return false;
  }
  return bcrypt.compare(plain, hash);
}
