import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Current booking being built
  currentBooking: {
    type: null,          // 'hotel' | 'car' | 'package' | 'assistance'
    itemId: null,
    itemSlug: null,
    itemData: null,
  },
  // Traveller details
  travellers: {
    lead: null,
    coTravellers: [],
  },
  // Date & Slot
  selectedDate: null,
  checkIn: null,
  checkOut: null,
  selectedSlot: null,
  guests: { adults: 1, children: 0 },
  // Room/Vehicle/Package selection
  selectedRoom: null,
  selectedVehicle: null,
  // Add-ons and pricing
  addOns: [],
  couponCode: null,
  couponDiscount: 0,
  walletAmountUsed: 0,
  rewardPointsUsed: 0,
  // Booking hold
  holdId: null,
  holdExpiry: null,
  // Booking review
  bookingId: null,
  bookingNumber: null,
  // Payment
  paymentOrderId: null,
  paymentStatus: null,
  // Current step
  currentStep: 0,
  isLoading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    startBooking: (state, action) => {
      state.currentBooking = action.payload;
      state.currentStep = 0;
      state.error = null;
    },
    setTravellers: (state, action) => {
      state.travellers = action.payload;
    },
    setLeadTraveller: (state, action) => {
      state.travellers.lead = action.payload;
    },
    addCoTraveller: (state, action) => {
      state.travellers.coTravellers.push(action.payload);
    },
    removeCoTraveller: (state, action) => {
      state.travellers.coTravellers = state.travellers.coTravellers.filter(
        (_, i) => i !== action.payload
      );
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setDateRange: (state, action) => {
      state.checkIn = action.payload.checkIn;
      state.checkOut = action.payload.checkOut;
    },
    setSelectedSlot: (state, action) => {
      state.selectedSlot = action.payload;
    },
    setGuests: (state, action) => {
      state.guests = action.payload;
    },
    setSelectedRoom: (state, action) => {
      state.selectedRoom = action.payload;
    },
    setSelectedVehicle: (state, action) => {
      state.selectedVehicle = action.payload;
    },
    addAddOn: (state, action) => {
      const existing = state.addOns.find((a) => a.id === action.payload.id);
      if (!existing) state.addOns.push(action.payload);
    },
    removeAddOn: (state, action) => {
      state.addOns = state.addOns.filter((a) => a.id !== action.payload);
    },
    applyCoupon: (state, action) => {
      state.couponCode = action.payload.code;
      state.couponDiscount = action.payload.discount;
    },
    removeCoupon: (state) => {
      state.couponCode = null;
      state.couponDiscount = 0;
    },
    setWalletUsage: (state, action) => {
      state.walletAmountUsed = action.payload;
    },
    setRewardPointsUsage: (state, action) => {
      state.rewardPointsUsed = action.payload;
    },
    setHold: (state, action) => {
      state.holdId = action.payload.holdId;
      state.holdExpiry = action.payload.expiresAt;
    },
    clearHold: (state) => {
      state.holdId = null;
      state.holdExpiry = null;
    },
    setBookingId: (state, action) => {
      state.bookingId = action.payload.bookingId;
      state.bookingNumber = action.payload.bookingNumber;
    },
    setPaymentOrder: (state, action) => {
      state.paymentOrderId = action.payload;
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    setStep: (state, action) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      state.currentStep += 1;
    },
    prevStep: (state) => {
      if (state.currentStep > 0) state.currentStep -= 1;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearBooking: () => initialState,
  },
});

export const {
  startBooking, setTravellers, setLeadTraveller, addCoTraveller, removeCoTraveller,
  setSelectedDate, setDateRange, setSelectedSlot, setGuests,
  setSelectedRoom, setSelectedVehicle, addAddOn, removeAddOn,
  applyCoupon, removeCoupon, setWalletUsage, setRewardPointsUsage,
  setHold, clearHold, setBookingId, setPaymentOrder, setPaymentStatus,
  setStep, nextStep, prevStep, setLoading, setError, clearBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
