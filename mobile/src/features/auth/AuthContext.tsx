import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';

import {
  setAuthenticated,
  setAuthUnknown,
  setUnauthenticated,
} from '../../app/store/authSlice';
import { getAppApi } from '../../services/api/createApi';
import {
  devAdminUser,
  devRetailerUser,
  devSalesUser,
  devSessionForUser,
  devSupplierUser,
} from '../../services/api/fixtures/devUsers';
import {
  clearTokens,
  getTokens,
  setTokens,
} from '../../services/storage/secureStorage';
import {
  getOnboardingCompleted,
  setOnboardingCompleted,
  setLastRolePreview,
} from '../../services/storage/preferencesStorage';
import type {
  AuthUser,
  RegisterRetailerRequest,
  RegisterSupplierRequest,
  UserRole,
} from '../../types';

export type AuthContextStatus = 'unknown' | 'authenticated' | 'unauthenticated';

export interface AuthContextValue {
  status: AuthContextStatus;
  user: AuthUser | null;
  onboardingCompleted: boolean;
  isBootstrapping: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  registerRetailer: (request: RegisterRetailerRequest) => Promise<void>;
  registerSupplier: (request: RegisterSupplierRequest) => Promise<void>;
  enterDevPreview: (role: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function resolveLoginEmail(identifier: string): string {
  const trimmed = identifier.trim();
  if (trimmed.includes('@')) {
    return trimmed;
  }
  return `${trimmed.replace(/\s+/g, '')}@phone.kdsconnect.local`;
}

async function persistSession(accessToken: string, refreshToken: string, user: AuthUser) {
  await setTokens({ accessToken, refreshToken });
  return user;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState<AuthContextStatus>('unknown');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [onboardingCompleted, setOnboardingCompletedState] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const applyAuthenticated = useCallback(
    (nextUser: AuthUser) => {
      setUser(nextUser);
      setStatus('authenticated');
      dispatch(setAuthenticated(nextUser));
    },
    [dispatch],
  );

  const applyUnauthenticated = useCallback(() => {
    setUser(null);
    setStatus('unauthenticated');
    dispatch(setUnauthenticated());
  }, [dispatch]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      dispatch(setAuthUnknown());
      try {
        const [tokens, onboardingDone] = await Promise.all([
          getTokens(),
          getOnboardingCompleted(),
        ]);
        if (cancelled) {
          return;
        }
        setOnboardingCompletedState(onboardingDone);
        if (tokens?.accessToken) {
          const api = getAppApi();
          const currentUser = await api.auth.getCurrentUser();
          if (!cancelled) {
            applyAuthenticated(currentUser);
          }
        } else if (!cancelled) {
          applyUnauthenticated();
        }
      } catch {
        await clearTokens();
        if (!cancelled) {
          applyUnauthenticated();
        }
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [applyAuthenticated, applyUnauthenticated, dispatch]);

  const signIn = useCallback(
    async (identifier: string, password: string) => {
      const email = resolveLoginEmail(identifier);
      const session = await getAppApi().auth.login({ email, password });
      await persistSession(session.accessToken, session.refreshToken, session.user);
      applyAuthenticated(session.user);
    },
    [applyAuthenticated],
  );

  const registerRetailer = useCallback(
    async (request: RegisterRetailerRequest) => {
      const session = await getAppApi().auth.registerRetailer(request);
      await persistSession(session.accessToken, session.refreshToken, session.user);
      applyAuthenticated(session.user);
    },
    [applyAuthenticated],
  );

  const registerSupplier = useCallback(
    async (request: RegisterSupplierRequest) => {
      const session = await getAppApi().auth.registerSupplier(request);
      await persistSession(session.accessToken, session.refreshToken, session.user);
      applyAuthenticated(session.user);
    },
    [applyAuthenticated],
  );

  const enterDevPreview = useCallback(
    async (role: UserRole) => {
      const previewUser =
        role === 'supplier'
          ? devSupplierUser
          : role === 'sales'
            ? devSalesUser
            : role === 'admin'
              ? devAdminUser
              : devRetailerUser;
      const session = devSessionForUser(previewUser);
      await persistSession(session.accessToken, session.refreshToken, session.user);
      await setLastRolePreview(role);
      applyAuthenticated(session.user);
    },
    [applyAuthenticated],
  );

  const refreshUser = useCallback(async () => {
    const currentUser = await getAppApi().auth.getCurrentUser();
    applyAuthenticated(currentUser);
  }, [applyAuthenticated]);

  const signOut = useCallback(async () => {
    try {
      await getAppApi().auth.logout();
    } catch {
      // Local sign-out still proceeds if network fails.
    }
    await clearTokens();
    applyUnauthenticated();
  }, [applyUnauthenticated]);

  const completeOnboarding = useCallback(async () => {
    await setOnboardingCompleted(true);
    setOnboardingCompletedState(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      onboardingCompleted,
      isBootstrapping,
      signIn,
      registerRetailer,
      registerSupplier,
      enterDevPreview,
      refreshUser,
      signOut,
      completeOnboarding,
    }),
    [
      status,
      user,
      onboardingCompleted,
      isBootstrapping,
      signIn,
      registerRetailer,
      registerSupplier,
      enterDevPreview,
      refreshUser,
      signOut,
      completeOnboarding,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
