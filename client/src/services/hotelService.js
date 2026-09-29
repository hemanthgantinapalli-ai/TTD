import api from './api';

const hotelService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.vegOnly) params.append('vegOnly', 'true');
    if (filters.star && filters.star.length > 0) params.append('star', filters.star.join(','));
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sort) params.append('sort', filters.sort);
    const response = await api.get(`/hotels?${params.toString()}`);
    return response.data;
  },
  getBySlug: async (slug) => {
    const response = await api.get(`/hotels/${slug}`);
    return response.data;
  },
};

export default hotelService;
