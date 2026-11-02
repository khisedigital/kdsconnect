import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import { setNetworkOnline } from '../app/store/slices/appSlice';

/**
 * Network connectivity stub.
 *
 * TODO: Replace with `@react-native-community/netinfo` when added to the project.
 * Until then, assumes online=true (no new dependency).
 */
export function useNetworkStatus(): { isOnline: boolean } {
  const dispatch = useAppDispatch();
  const isOnline = useAppSelector(state => state.app.networkOnline);

  useEffect(() => {
    dispatch(setNetworkOnline(true));
  }, [dispatch]);

  return { isOnline };
}
