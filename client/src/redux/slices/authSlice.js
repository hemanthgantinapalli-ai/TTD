import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// ── Async Thunks ────────────────────────────────────────
export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    return await authService.register(userData);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    return await authService.login(credentials);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async (otpData, { rejectWithValue }) => {
  try {
    return await authService.verifyOtp(otpData);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'OTP verification failed');
  }
});

export const sendOtp = createAsyncThunk('auth/sendOtp', async (phoneData, { rejectWithValue }) => {
  try {
    return await authService.sendOtp(phoneData);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send OTP');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Logout failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    return await authService.getMe();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
  }
});

// ── Initial State ────────────────────────────────────────
const getStoredUser = () => {
  try {
    const serialized = localStorage.getItem('ttdyatra_user');
    return serialized ? JSON.parse(serialized) : null;
  } catch {
    return null;
  }
};

const initialState = {
  user: getStoredUser(),
  accessToken: localStorage.getItem('ttdyatra_token') || null,
  isLoading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
  isInitialized: false,
};

// ── Slice ────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      localStorage.setItem('ttdyatra_user', JSON.stringify(user));
      localStorage.setItem('ttdyatra_token', accessToken);
    },
    clearError: (state) => {
      state.error = null;
    },
    clearOtpState: (state) => {
      state.otpSent = false;
      state.otpVerified = false;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('ttdyatra_user', JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpSent = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(login.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('ttdyatra_user', JSON.stringify(action.payload.user));
        localStorage.setItem('ttdyatra_token', action.payload.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Send OTP
    builder
      .addCase(sendOtp.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(sendOtp.fulfilled, (state) => { state.isLoading = false; state.otpSent = true; })
      .addCase(sendOtp.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });

    // Verify OTP
    builder
      .addCase(verifyOtp.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpVerified = true;
        if (action.payload.accessToken) {
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          localStorage.setItem('ttdyatra_user', JSON.stringify(action.payload.user));
          localStorage.setItem('ttdyatra_token', action.payload.accessToken);
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        localStorage.removeItem('ttdyatra_user');
        localStorage.removeItem('ttdyatra_token');
      });

    // Get Me
    builder
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isInitialized = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isInitialized = true;
        localStorage.removeItem('ttdyatra_user');
        localStorage.removeItem('ttdyatra_token');
      });
  },
});

export const { setCredentials, clearError, clearOtpState, setInitialized, updateUser } = authSlice.actions;
export default authSlice.reducer;
