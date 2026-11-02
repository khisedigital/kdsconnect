/**
 * Backward-compatible exports for AuthContext and legacy imports.
 * Canonical implementation: `./slices/authSlice.ts`.
 */
import type { AuthUser } from '../../types';

export { default as authReducer } from './slices/authSlice';
export {
  setAuthUnknown,
  restoreSession,
  login,
  logout,
  clearAuthError,
  setUser,
  type AuthState,
  type AuthStatus,
} from './slices/authSlice';

import { setUser as setUserAction } from './slices/authSlice';

export const setAuthenticated = (user: AuthUser) => setUserAction(user);
export const setUnauthenticated = () => setUserAction(null);
