import { request } from './httpClient.js';

export const fetchSubadmins = () => request('/api/admin/subadmins');

export const createSubadmin = (payload) =>
  request('/api/admin/subadmins', { method: 'POST', body: payload });

export const removeSubadmin = (id) =>
  request(`/api/admin/subadmins/${id}`, { method: 'DELETE' });
