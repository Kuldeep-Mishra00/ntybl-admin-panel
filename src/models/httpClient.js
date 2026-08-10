export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const TOKEN_KEY = 'ntybl_admin_token';
const USERNAME_KEY = 'ntybl_admin_username';
const ROLE_KEY = 'ntybl_admin_role';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function getStoredUsername() {
  return localStorage.getItem(USERNAME_KEY);
}
export function getStoredRole() {
  return localStorage.getItem(ROLE_KEY) || 'admin';
}
export function storeSession(token, username, role = 'admin') {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
  localStorage.setItem(ROLE_KEY, role);
}
export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// A 202 response from a sub-admin's write means it was staged for approval
// (see the backend staging middleware) rather than applied.
export const PENDING_MSG = 'Submitted for admin approval — it goes live once approved.';
export const isPending = (result) => !!(result && result.pending);

export async function request(path, { method = 'GET', body, isForm = false, auth = true } = {}) {
  const headers = {};
  if (!isForm && body != null) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isForm ? body : body != null ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    if (res.status === 401) clearSession(); // token expired/invalid — force a fresh login
    throw new ApiError((data && data.error) || `Request failed (${res.status})`, res.status);
  }
  return data;
}
