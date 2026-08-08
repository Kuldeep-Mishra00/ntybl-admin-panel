import { request } from './httpClient.js';

export const fetchFooterLinks = () => request('/api/content/footer-links', { auth: false });

export const replaceFooterLinks = (links) =>
  request('/api/content/footer-links', { method: 'PUT', body: { links } });
