import { useEffect, useState } from 'react';
import { getToken } from '../models/httpClient.js';
import { useAuth } from './AuthContext.jsx';

function decodeExp(token) {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)).exp; // seconds since epoch
  } catch {
    return null;
  }
}

// Ticks down to the JWT's own `exp` claim (set server-side) rather than
// tracking a separate duration client-side, so this can never drift out of
// sync with what actually invalidates the token.
export function useSessionCountdown() {
  const { logout } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(null);

  useEffect(() => {
    const token = getToken();
    const exp = token ? decodeExp(token) : null;
    if (!exp) return;

    function tick() {
      const remaining = exp - Math.floor(Date.now() / 1000);
      setSecondsLeft(remaining);
      if (remaining <= 0) logout();
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [logout]);

  return secondsLeft;
}
