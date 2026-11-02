import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import { restoreSession } from '../app/store/slices/authSlice';
import {
  setHydrated,
  setOnboardingCompleted,
  setRole,
} from '../app/store/slices/appSlice';
import { getOnboardingCompleted } from '../services/storage';

/**
 * Restores secure session and non-sensitive preferences on app start.
 * Wire this hook from the root navigator (not App.tsx per project constraints).
 */
export function useAppBootstrap(): { bootstrapping: boolean } {
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector(state => state.app.hydrated);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) {
      return;
    }
    started.current = true;

    let cancelled = false;

    async function bootstrap() {
      try {
        const onboardingCompleted = await getOnboardingCompleted();
        if (!cancelled) {
          dispatch(setOnboardingCompleted(onboardingCompleted));
        }

        const result = await dispatch(restoreSession());
        if (!cancelled && restoreSession.fulfilled.match(result) && result.payload) {
          dispatch(setRole(result.payload.role));
        }
      } finally {
        if (!cancelled) {
          dispatch(setHydrated(true));
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return { bootstrapping: !hydrated };
}
