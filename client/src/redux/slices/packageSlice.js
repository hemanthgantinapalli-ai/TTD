import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import packageService from '../../services/packageService';

// ── Async Thunks ─────────────────────────────────────────────────────────────
export const fetchPackages = createAsyncThunk('package/fetchAll', async (filters = {}, { rejectWithValue }) => {
  try {
    const res = await packageService.getAll(filters);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch packages');
  }
});

export const fetchPackageBySlug = createAsyncThunk('package/fetchBySlug', async (slug, { rejectWithValue }) => {
  try {
    const res = await packageService.getBySlug(slug);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch package');
  }
});

// ── Slice ─────────────────────────────────────────────────────────────────────
const packageSlice = createSlice({
  name: 'package',
  initialState: {
    packages: [],
    selectedPackage: null,
    searchResults: [],
    featured: [],
    searchFilters: { category: '', duration: '', priceMax: 50000, sort: 'recommended' },
    pagination: { page: 1, limit: 12, total: 0 },
    isLoading: false,
    error: null,
  },
  reducers: {
    setPackages: (s, a) => { s.packages = a.payload; },
    setFeatured: (s, a) => { s.featured = a.payload; },
    setSelectedPackage: (s, a) => { s.selectedPackage = a.payload; },
    setSearchResults: (s, a) => { s.searchResults = a.payload; },
    setSearchFilters: (s, a) => { s.searchFilters = { ...s.searchFilters, ...a.payload }; },
    setPagination: (s, a) => { s.pagination = { ...s.pagination, ...a.payload }; },
    setLoading: (s, a) => { s.isLoading = a.payload; },
    setError: (s, a) => { s.error = a.payload; s.isLoading = false; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(fetchPackages.fulfilled, (s, a) => { s.isLoading = false; s.packages = a.payload; })
      .addCase(fetchPackages.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; });

    builder
      .addCase(fetchPackageBySlug.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(fetchPackageBySlug.fulfilled, (s, a) => { s.isLoading = false; s.selectedPackage = a.payload; })
      .addCase(fetchPackageBySlug.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; });
  },
});

export const { setPackages, setFeatured, setSelectedPackage, setSearchResults, setSearchFilters, setPagination, setLoading, setError } = packageSlice.actions;
export default packageSlice.reducer;
