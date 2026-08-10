import { request } from './httpClient.js';

export const fetchPendingChanges = () => request('/api/approvals');
export const fetchMyChanges = () => request('/api/approvals/mine');

export const approveChange = (id) => request(`/api/approvals/${id}/approve`, { method: 'POST' });
export const rejectChange = (id) => request(`/api/approvals/${id}/reject`, { method: 'POST' });
