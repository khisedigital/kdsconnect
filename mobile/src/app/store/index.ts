import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from './authSlice';
import appReducer from './slices/appSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    cart: cartReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {},
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { useAppDispatch, useAppSelector } from './hooks';
export {
  restoreSession,
  login,
  logout,
  setUser,
  setAuthenticated,
  setUnauthenticated,
  setAuthUnknown,
  clearAuthError,
  type AuthState,
  type AuthStatus,
} from './authSlice';
export {
  setHydrated,
  setOnboardingCompleted,
  setNetworkOnline,
  setRole,
  enqueueToast,
  dequeueToast,
  clearToasts,
} from './slices/appSlice';
export {
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} from './slices/cartSlice';
