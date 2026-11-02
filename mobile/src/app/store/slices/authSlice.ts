import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser, LoginRequest } from '../../../types';
import { getAppApi } from '../../../services/api';
import { ApiClientError } from '../../../services/api/errors';
import { clearTokens, getTokens, setTokens } from '../../../services/storage';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

export const restoreSession = createAsyncThunk<
  AuthUser | null,
  void,
  { rejectValue: string }
>('auth/restoreSession', async (_, { rejectWithValue }) => {
  const tokens = await getTokens();
  if (!tokens) {
    return null;
  }
  try {
    const user = await getAppApi().auth.getCurrentUser();
    return user;
  } catch (error) {
    await clearTokens();
    const message =
      error instanceof ApiClientError ? error.message : 'Failed to restore session';
    return rejectWithValue(message);
  }
});

export const login = createAsyncThunk<AuthUser, LoginRequest, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const session = await getAppApi().auth.login(credentials);
      await setTokens({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });
      return session.user;
    } catch (error) {
      const message = error instanceof ApiClientError ? error.message : 'Login failed';
      return rejectWithValue(message);
    }
  },
);

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await getAppApi().auth.logout();
    } catch {
      // Best-effort server logout; always clear local session.
    }
    try {
      await clearTokens();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to clear session';
      return rejectWithValue(message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.status = action.payload ? 'authenticated' : 'unauthenticated';
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
    /** @deprecated Legacy AuthContext bootstrap — prefer restoreSession thunk */
    setAuthUnknown(state) {
      state.status = 'idle';
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(restoreSession.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.status = 'authenticated';
        } else {
          state.user = null;
          state.status = 'unauthenticated';
        }
      })
      .addCase(restoreSession.rejected, (state, action) => {
        state.user = null;
        state.status = 'unauthenticated';
        state.error = action.payload ?? null;
      })
      .addCase(login.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'authenticated';
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? 'Login failed';
      })
      .addCase(logout.pending, state => {
        state.status = 'loading';
      })
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.status = 'unauthenticated';
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.user = null;
        state.status = 'unauthenticated';
        state.error = action.payload ?? null;
      });
  },
});

export const { setUser, clearAuthError, setAuthUnknown } = authSlice.actions;
export default authSlice.reducer;
