import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import carService from '../../services/carService';

// ── Async Thunks ─────────────────────────────────────────────────────────────
export const fetchCars = createAsyncThunk('car/fetchAll', async (filters = {}, { rejectWithValue }) => {
  try {
    const res = await carService.getAll(filters);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch cars');
  }
});

export const fetchCarBySlug = createAsyncThunk('car/fetchBySlug', async (slug, { rejectWithValue }) => {
  try {
    const res = await carService.getBySlug(slug);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch car');
  }
});

// ── Slice ─────────────────────────────────────────────────────────────────────
const carSlice = createSlice({
  name: 'car',
  initialState: {
    cars: [],
    selectedCar: null,
    searchResults: [],
    searchFilters: { ac: false, sort: 'recommended' },
    isLoading: false,
    error: null,
  },
  reducers: {
    setCars: (s, a) => { s.cars = a.payload; },
    setSelectedCar: (s, a) => { s.selectedCar = a.payload; },
    setSearchResults: (s, a) => { s.searchResults = a.payload; },
    setSearchFilters: (s, a) => { s.searchFilters = { ...s.searchFilters, ...a.payload }; },
    setLoading: (s, a) => { s.isLoading = a.payload; },
    setError: (s, a) => { s.error = a.payload; s.isLoading = false; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(fetchCars.fulfilled, (s, a) => { s.isLoading = false; s.cars = a.payload; })
      .addCase(fetchCars.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; });

    builder
      .addCase(fetchCarBySlug.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(fetchCarBySlug.fulfilled, (s, a) => { s.isLoading = false; s.selectedCar = a.payload; })
      .addCase(fetchCarBySlug.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; });
  },
});

export const { setCars, setSelectedCar, setSearchResults, setSearchFilters, setLoading, setError } = carSlice.actions;
export default carSlice.reducer;
