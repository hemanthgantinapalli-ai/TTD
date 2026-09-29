import { createSlice } from '@reduxjs/toolkit';

const supportSlice = createSlice({
  name: 'support',
  initialState: {
    tickets: [],
    currentTicket: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
    setCurrentTicket: (state, action) => {
      state.currentTicket = action.payload;
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

export const { setTickets, setCurrentTicket, setLoading, setError } = supportSlice.actions;
export default supportSlice.reducer;
