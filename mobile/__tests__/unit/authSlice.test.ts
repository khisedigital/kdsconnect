import authReducer, {
  clearAuthError,
  setAuthUnknown,
  setUser,
} from '../../src/app/store/slices/authSlice';
import type {AuthUser} from '../../src/types';

const user: AuthUser = {
  id: 'u1',
  email: 'r@example.com',
  role: 'retailer',
  displayName: 'Retailer',
  businessName: 'Shop',
};

describe('authSlice', () => {
  it('sets authenticated user', () => {
    const state = authReducer(undefined, setUser(user));
    expect(state.status).toBe('authenticated');
    expect(state.user?.role).toBe('retailer');
  });

  it('clears user on null', () => {
    const authenticated = authReducer(undefined, setUser(user));
    const state = authReducer(authenticated, setUser(null));
    expect(state.status).toBe('unauthenticated');
    expect(state.user).toBeNull();
  });

  it('supports bootstrap unknown state', () => {
    const state = authReducer(undefined, setAuthUnknown());
    expect(state.status).toBe('idle');
  });

  it('clears error', () => {
    const withError = {
      user: null,
      status: 'error' as const,
      error: 'fail',
    };
    const state = authReducer(withError, clearAuthError());
    expect(state.error).toBeNull();
  });
});
