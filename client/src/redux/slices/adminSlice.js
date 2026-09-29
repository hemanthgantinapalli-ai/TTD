import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    dashboardStats: null,
    users: [],
    bookings: [],
    reports: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setDashboardStats: (state, action) => {
      state.dashboardStats = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    setReports: (state, action) => {
      state.reports = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setDashboardStats, setUsers, setBookings, setReports, setLoading, setError } = adminSlice.actions;
export default adminSlice.reducer;
