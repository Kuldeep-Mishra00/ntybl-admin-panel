import { request } from './httpClient.js';

export const fetchFaq = () => request('/api/content/faq', { auth: false });

export const createFaqItem = (payload) =>
  request('/api/content/faq', { method: 'POST', body: payload });

export const updateFaqItem = (id, payload) =>
  request(`/api/content/faq/${id}`, { method: 'PUT', body: payload });

export const removeFaqItem = (id) =>
  request(`/api/content/faq/${id}`, { method: 'DELETE' });

export const fetchFaqDisclaimer = () => request('/api/content/faq-disclaimer', { auth: false });

export const updateFaqDisclaimer = (disclaimer) =>
  request('/api/content/faq-disclaimer', { method: 'PUT', body: { disclaimer } });
