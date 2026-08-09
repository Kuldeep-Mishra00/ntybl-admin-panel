import { request } from './httpClient.js';

export const fetchFestivePromotions = () => request('/api/content/festive-promotions');

export const createFestivePromotion = (formData) =>
  request('/api/content/festive-promotions', { method: 'POST', body: formData, isForm: true });

export const updateFestivePromotion = (id, formData) =>
  request(`/api/content/festive-promotions/${id}`, { method: 'PUT', body: formData, isForm: true });

export const removeFestivePromotion = (id) =>
  request(`/api/content/festive-promotions/${id}`, { method: 'DELETE' });
