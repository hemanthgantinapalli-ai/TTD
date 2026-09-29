import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import hotelService from '../../services/hotelService';

// ── Async Thunks ─────────────────────────────────────────────────────────────
export const fetchHotels = createAsyncThunk('hotel/fetchAll', async (filters = {}, { rejectWithValue }) => {
  try {
    const res = await hotelService.getAll(filters);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch hotels');
  }
});

export const fetchHotelBySlug = createAsyncThunk('hotel/fetchBySlug', async (slug, { rejectWithValue }) => {
  try {
    const res = await hotelService.getBySlug(slug);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch hotel');
  }
});

// ── Slice ─────────────────────────────────────────────────────────────────────
const hotelSlice = createSlice({
  name: 'hotel',
  initialState: {
    hotels: [],
    selectedHotel: null,
    searchResults: [],
    searchFilters: { vegOnly: false, star: [], maxPrice: 10000, sort: 'recommended' },
    pagination: { page: 1, limit: 12, total: 0 },
    isLoading: false,
    error: null,
  },
  reducers: {
    setHotels: (s, a) => { s.hotels = a.payload; },
    setSelectedHotel: (s, a) => { s.selectedHotel = a.payload; },
    setSearchResults: (s, a) => { s.searchResults = a.payload; },
    setSearchFilters: (s, a) => { s.searchFilters = { ...s.searchFilters, ...a.payload }; },
    setPagination: (s, a) => { s.pagination = { ...s.pagination, ...a.payload }; },
    setLoading: (s, a) => { s.isLoading = a.payload; },
    setError: (s, a) => { s.error = a.payload; s.isLoading = false; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(fetchHotels.fulfilled, (s, a) => { s.isLoading = false; s.hotels = a.payload; })
      .addCase(fetchHotels.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; });

    builder
      .addCase(fetchHotelBySlug.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(fetchHotelBySlug.fulfilled, (s, a) => { s.isLoading = false; s.selectedHotel = a.payload; })
      .addCase(fetchHotelBySlug.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; });
  },
});

export const { setHotels, setSelectedHotel, setSearchResults, setSearchFilters, setPagination, setLoading, setError } = hotelSlice.actions;
export default hotelSlice.reducer;
