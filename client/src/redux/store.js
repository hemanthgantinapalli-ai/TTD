import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import hotelReducer from './slices/hotelSlice';
import carReducer from './slices/carSlice';
import packageReducer from './slices/packageSlice';
import wishlistReducer from './slices/wishlistSlice';
import paymentReducer from './slices/paymentSlice';
import notificationReducer from './slices/notificationSlice';
import supportReducer from './slices/supportSlice';
import adminReducer from './slices/adminSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    hotel: hotelReducer,
    car: carReducer,
    package: packageReducer,
    wishlist: wishlistReducer,
    payment: paymentReducer,
    notification: notificationReducer,
    support: supportReducer,
    admin: adminReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/setCredentials', 'booking/setHoldExpiry'],
        // Ignore these paths in state
        ignoredPaths: ['booking.holdExpiry'],
      },
    }),
  devTools: import.meta.env.DEV,
});

export default store;
