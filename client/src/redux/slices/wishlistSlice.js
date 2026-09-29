import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [], isLoading: false },
  reducers: {
    setWishlist: (s, a) => { s.items = a.payload; },
    addToWishlist: (s, a) => { if (!s.items.find((i) => i.itemId === a.payload.itemId)) s.items.push(a.payload); },
    removeFromWishlist: (s, a) => { s.items = s.items.filter((i) => i.itemId !== a.payload); },
    setLoading: (s, a) => { s.isLoading = a.payload; },
  },
});

export const { setWishlist, addToWishlist, removeFromWishlist, setLoading } = wishlistSlice.actions;
export default wishlistSlice.reducer;
