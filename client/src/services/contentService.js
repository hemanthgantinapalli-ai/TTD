import api from './api';

const contentService = {
  getReviews: async () => {
    const response = await api.get('/reviews');
    return response.data;
  },
  getFaqs: async () => {
    const response = await api.get('/faqs');
    return response.data;
  },
  submitContact: async (formData) => {
    const response = await api.post('/leads', formData);
    return response.data;
  },
  getTerms: async () => {
    const response = await api.get('/terms');
    return response.data;
  },
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },
};

export default contentService;
