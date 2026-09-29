import api from './api';

const packageService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.duration) params.append('duration', filters.duration);
    const response = await api.get(`/packages?${params.toString()}`);
    return response.data;
  },
  getBySlug: async (slug) => {
    const response = await api.get(`/packages/${slug}`);
    return response.data;
  },
};

export default packageService;
