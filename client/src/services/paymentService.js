import api from './api';

export const paymentService = {
  // Fetch payment configuration (UPI VPA, Name, Payment Mode, Razorpay status)
  getConfig: async () => {
    try {
      const res = await api.get('/payments/config');
      return res.data;
    } catch {
      return {
        success: true,
        data: {
          upiId: 'ttdyatra@sbi',
          upiName: 'TTD Yatra Pilgrimage Services',
          paymentMode: 'test',
          razorpayEnabled: false,
          razorpayKeyId: '',
          acceptedMethods: ['upi', 'card', 'netbanking'],
        },
      };
    }
  },

  // Create payment order & initialize booking in 'payment_pending' state (#3)
  createOrder: async (bookingData) => {
    const res = await api.post('/payments/create-order', bookingData);
    return res.data;
  },

  // Submit manual UTR for admin verification (#6 & #7)
  submitUtr: async ({ paymentId, orderId, bookingId, pnr, utr }) => {
    const res = await api.post('/payments/submit-utr', {
      paymentId,
      orderId,
      bookingId,
      pnr,
      utr,
    });
    return res.data;
  },

  // Verify gateway payment (cryptographic signature check on backend) or test simulation
  verifyPayment: async (verificationData) => {
    const res = await api.post('/payments/verify', verificationData);
    return res.data;
  },

  // Get payment details by ID / Order ID
  getPaymentById: async (id) => {
    const res = await api.get(`/payments/${id}`);
    return res.data;
  },

  // Get payment and attempts for a specific booking
  getBookingPayment: async (bookingIdOrPnr) => {
    const res = await api.get(`/bookings/${bookingIdOrPnr}/payment`);
    return res.data;
  },
};

export default paymentService;
