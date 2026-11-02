import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserRole } from '../../../types';

export interface ToastMessage {
  id: string;
  message: string;
  variant: 'info' | 'success' | 'error';
}

export interface AppState {
  hydrated: boolean;
  onboardingCompleted: boolean;
  networkOnline: boolean;
  role: UserRole | null;
  toasts: ToastMessage[];
}

const initialState: AppState = {
  hydrated: false,
  onboardingCompleted: false,
  networkOnline: true,
  role: null,
  toasts: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setHydrated(state, action: PayloadAction<boolean>) {
      state.hydrated = action.payload;
    },
    setOnboardingCompleted(state, action: PayloadAction<boolean>) {
      state.onboardingCompleted = action.payload;
    },
    setNetworkOnline(state, action: PayloadAction<boolean>) {
      state.networkOnline = action.payload;
    },
    setRole(state, action: PayloadAction<UserRole | null>) {
      state.role = action.payload;
    },
    enqueueToast(state, action: PayloadAction<Omit<ToastMessage, 'id'>>) {
      state.toasts.push({
        ...action.payload,
        id: `toast-${Date.now()}-${state.toasts.length}`,
      });
    },
    dequeueToast(state) {
      state.toasts.shift();
    },
    clearToasts(state) {
      state.toasts = [];
    },
  },
});

export const {
  setHydrated,
  setOnboardingCompleted,
  setNetworkOnline,
  setRole,
  enqueueToast,
  dequeueToast,
  clearToasts,
} = appSlice.actions;

export default appSlice.reducer;
