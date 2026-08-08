import { request } from './httpClient.js';

export const fetchHome = () => request('/api/content/home', { auth: false });

export const updateHome = (formData) =>
  request('/api/content/home', { method: 'PUT', body: formData, isForm: true });
