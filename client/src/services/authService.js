import api from './api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  sendOtp: async (phoneData) => {
    const response = await api.post('/auth/send-otp', phoneData);
    return response.data;
  },
  verifyOtp: async (otpData) => {
    const response = await api.post('/auth/verify-otp', otpData);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default authService;
