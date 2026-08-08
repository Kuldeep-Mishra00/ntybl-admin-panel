import { request } from './httpClient.js';

export const fetchWellnessAreas = () => request('/api/content/wellness-areas', { auth: false });

export const createWellnessArea = (formData) =>
  request('/api/content/wellness-areas', { method: 'POST', body: formData, isForm: true });

export const updateWellnessArea = (id, formData) =>
  request(`/api/content/wellness-areas/${id}`, { method: 'PUT', body: formData, isForm: true });

export const removeWellnessArea = (id) =>
  request(`/api/content/wellness-areas/${id}`, { method: 'DELETE' });
