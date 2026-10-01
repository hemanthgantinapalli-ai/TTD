import api from './api';

export const adminService = {
  // Telemetry & Overview from MongoDB
  getOverview: async () => {
    const res = await api.get('/admin/overview');
    return res.data;
  },

  // Bookings Ledger
  getBookings: async (params) => {
    const res = await api.get('/admin/bookings', { params });
    return res.data;
  },
  createBooking: async (data) => {
    const res = await api.post('/admin/bookings', data);
    return res.data;
  },
  updateBookingStatus: async (id, status, notes) => {
    const res = await api.put(`/admin/bookings/${id}/status`, { status, notes });
    return res.data;
  },
  deleteBooking: async (id) => {
    const res = await api.delete(`/admin/bookings/${id}`);
    return res.data;
  },

  // Hotels & Stays
  getHotels: async () => {
    const res = await api.get('/admin/hotels');
    return res.data;
  },
  createHotel: async (data) => {
    const res = await api.post('/admin/hotels', data);
    return res.data;
  },
  updateHotel: async (id, data) => {
    const res = await api.put(`/admin/hotels/${id}`, data);
    return res.data;
  },
  deleteHotel: async (id) => {
    const res = await api.delete(`/admin/hotels/${id}`);
    return res.data;
  },

  // Fleet & Cabs
  getCars: async () => {
    const res = await api.get('/admin/cars');
    return res.data;
  },
  createCar: async (data) => {
    const res = await api.post('/admin/cars', data);
    return res.data;
  },
  updateCar: async (id, data) => {
    const res = await api.put(`/admin/cars/${id}`, data);
    return res.data;
  },
  deleteCar: async (id) => {
    const res = await api.delete(`/admin/cars/${id}`);
    return res.data;
  },

  // Yatra Packages Catalog
  getPackages: async () => {
    const res = await api.get('/admin/packages');
    return res.data;
  },
  createPackage: async (data) => {
    const res = await api.post('/admin/packages', data);
    return res.data;
  },
  updatePackage: async (id, data) => {
    const res = await api.put(`/admin/packages/${id}`, data);
    return res.data;
  },
  deletePackage: async (id) => {
    const res = await api.delete(`/admin/packages/${id}`);
    return res.data;
  },

  // Devotees & Users
  getUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },
  updateUser: async (id, data) => {
    const res = await api.put(`/admin/users/${id}`, data);
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },

  // Inquiries & Leads
  getEnquiries: async () => {
    const res = await api.get('/admin/enquiries');
    return res.data;
  },
  updateEnquiry: async (id, data) => {
    const res = await api.put(`/admin/enquiries/${id}`, data);
    return res.data;
  },
  deleteEnquiry: async (id) => {
    const res = await api.delete(`/admin/enquiries/${id}`);
    return res.data;
  },

  // Terms & Legal CMS
  getTerms: async () => {
    const res = await api.get('/admin/terms');
    return res.data;
  },
  updateTerms: async (data) => {
    const res = await api.put('/admin/terms', data);
    return res.data;
  },

  // Platform Settings
  getSettings: async () => {
    const res = await api.get('/admin/settings');
    return res.data;
  },
  updateSettings: async (data) => {
    const res = await api.put('/admin/settings', data);
    return res.data;
  },

  // Real-Time Notifications
  getNotifications: async () => {
    const res = await api.get('/admin/notifications');
    return res.data;
  },
  markNotificationRead: async (id) => {
    const res = await api.post(`/admin/notifications/${id}/read`);
    return res.data;
  },
  markAllNotificationsRead: async () => {
    const res = await api.post('/admin/notifications/mark-all-read');
    return res.data;
  },
  deleteNotification: async (id) => {
    const res = await api.delete(`/admin/notifications/${id}`);
    return res.data;
  },

  // Payment Verification Center (Section 8, 9, 10)
  getPayments: async (params) => {
    const res = await api.get('/admin/payments', { params });
    return res.data;
  },
  getPaymentById: async (id) => {
    const res = await api.get(`/admin/payments/${id}`);
    return res.data;
  },
  approvePayment: async (id) => {
    const res = await api.post(`/admin/payments/${id}/approve`);
    return res.data;
  },
  rejectPayment: async (id, reason) => {
    const res = await api.post(`/admin/payments/${id}/reject`, { reason });
    return res.data;
  },
};

export default adminService;
