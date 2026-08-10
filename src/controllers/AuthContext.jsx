import { createContext, useContext, useState } from 'react';
import { login as loginRequest } from '../models/authModel.js';
import { clearSession, getStoredRole, getStoredUsername, getToken, storeSession } from '../models/httpClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [username, setUsername] = useState(getStoredUsername());
  const [role, setRole] = useState(getStoredRole());

  async function login(user, pass) {
    const data = await loginRequest(user, pass); // throws on failure — caller shows the error
    storeSession(data.token, data.username, data.role || 'admin');
    setToken(data.token);
    setUsername(data.username);
    setRole(data.role || 'admin');
  }

  function logout() {
    clearSession();
    setToken(null);
    setUsername(null);
    setRole('admin');
  }

  function updateUsername(name) {
    setUsername(name);
  }

  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider value={{ token, username, role, isAdmin, isAuthenticated: !!token, login, logout, updateUsername }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
