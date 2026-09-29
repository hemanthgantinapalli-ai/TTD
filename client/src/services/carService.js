import api from './api';

const carService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.ac) params.append('ac', 'true');
    if (filters.sort) params.append('sort', filters.sort);
    const response = await api.get(`/cars?${params.toString()}`);
    return response.data;
  },
  getBySlug: async (slug) => {
    const response = await api.get(`/cars/${slug}`);
    return response.data;
  },
};

export default carService;
