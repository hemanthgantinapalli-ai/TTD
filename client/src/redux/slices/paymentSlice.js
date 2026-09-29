import { createSlice } from '@reduxjs/toolkit';
const paymentSlice = createSlice({ name: 'payment', initialState: { currentPayment: null, history: [], isLoading: false, error: null }, reducers: { setCurrentPayment: (s, a) => { s.currentPayment = a.payload; }, setHistory: (s, a) => { s.history = a.payload; }, setLoading: (s, a) => { s.isLoading = a.payload; }, setError: (s, a) => { s.error = a.payload; s.isLoading = false; }, clearPayment: (s) => { s.currentPayment = null; } } });
export const { setCurrentPayment, setHistory, setLoading, setError, clearPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
