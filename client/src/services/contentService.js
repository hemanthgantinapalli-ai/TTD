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
    const response = await api.post('/contact', formData);
    return response.data;
  },
};

export default contentService;
