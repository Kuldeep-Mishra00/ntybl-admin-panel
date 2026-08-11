import { request } from './httpClient.js';

export const login = (username, password) =>
  request('/api/admin/login', { method: 'POST', body: { username, password }, auth: false });

export const changeCredentials = (payload) =>
  request('/api/admin/credentials', { method: 'PUT', body: payload });

export const checkUsername = (username) =>
  request(`/api/admin/username-available?username=${encodeURIComponent(username)}`);
