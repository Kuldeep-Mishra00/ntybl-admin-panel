import { API_URL, ApiError, clearSession, getToken, request } from './httpClient.js';

export const fetchLeads = () => request('/api/leads');

export const markLeadAttended = (id, attended) =>
  request(`/api/leads/${id}/attend`, { method: 'PATCH', body: { attended } });

export async function downloadLeadsCsv() {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/leads/export`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    if (res.status === 401) clearSession();
    throw new ApiError('Failed to export leads.', res.status);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leads.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
