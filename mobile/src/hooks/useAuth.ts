import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import { clearAuthError, login, logout, setUser } from '../app/store/slices/authSlice';
import type { AuthUser, LoginRequest } from '../types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector(state => state.auth);

  const signIn = useCallback(
    (credentials: LoginRequest) => dispatch(login(credentials)),
    [dispatch],
  );

  const signOut = useCallback(() => dispatch(logout()), [dispatch]);

  const updateUser = useCallback(
    (nextUser: AuthUser | null) => dispatch(setUser(nextUser)),
    [dispatch],
  );

  const dismissError = useCallback(() => dispatch(clearAuthError()), [dispatch]);

  return {
    user,
    status,
    error,
    isAuthenticated: status === 'authenticated' && user !== null,
    isLoading: status === 'loading',
    signIn,
    signOut,
    updateUser,
    dismissError,
  };
}
