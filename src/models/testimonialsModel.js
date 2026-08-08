import { request } from './httpClient.js';

export const fetchTestimonials = () => request('/api/content/testimonials', { auth: false });

export const createTestimonial = (formData) =>
  request('/api/content/testimonials', { method: 'POST', body: formData, isForm: true });

export const updateTestimonial = (id, formData) =>
  request(`/api/content/testimonials/${id}`, { method: 'PUT', body: formData, isForm: true });

export const removeTestimonial = (id) =>
  request(`/api/content/testimonials/${id}`, { method: 'DELETE' });
