import axios from 'axios';
import { API_BASE } from '../constants/routes';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ttdyatra_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use((response) => response, (error) => {
  const requestUrl = error.config?.url || '';
  if (requestUrl.startsWith('/admin/') && error.response?.status === 401) {
    localStorage.removeItem('ttdyatra_user');
    localStorage.removeItem('ttdyatra_token');
    if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      window.location.assign('/admin/login');
    }
  }
  if (requestUrl.startsWith('/admin/') && error.response?.status === 403 && window.location.pathname.startsWith('/admin')) {
    window.location.assign('/dashboard');
  }
  return Promise.reject(error);
});

export default api;
