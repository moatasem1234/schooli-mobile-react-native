// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppDispatch, AppThunk } from './store';
import Api, { axios } from '../api/axios';
import { AuthState, User } from '../types/auth';

interface LoginCredentials {
  email: string;
  password: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await Api.post('/auth/login', credentials);
      return response.data; // Expecting { user: User, token: string }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;


// Add to the bottom of authSlice.ts
export const selectUser = (state: RootState) => state.auth.user;
export const selectRoles = (state: RootState) => state.auth.user?.roles || [];
export const selectPermissions = (state: RootState) => state.auth.user?.permissions || [];
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;
export const hasPermission = (state: RootState, permissionSlug: string): boolean => {
  return state.auth.user?.permissions.some((p) => p.slug === permissionSlug) || false;
};
export const hasRole = (state: RootState, roleSlug: string): boolean => {
  return state.auth.user?.roles.some((r) => r.slug === roleSlug) || false;
};