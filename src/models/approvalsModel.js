import { request } from './httpClient.js';

export const fetchPendingChanges = () => request('/api/approvals');
export const fetchChangeHistory = () => request('/api/approvals/history');
export const fetchMyChanges = () => request('/api/approvals/mine');

export const approveChange = (id) => request(`/api/approvals/${id}/approve`, { method: 'POST' });
export const rejectChange = (id) => request(`/api/approvals/${id}/reject`, { method: 'POST' });

export const deleteHistoryChange = (id) => request(`/api/approvals/${id}`, { method: 'DELETE' });
export const clearChangeHistory = () => request('/api/approvals/history', { method: 'DELETE' });
