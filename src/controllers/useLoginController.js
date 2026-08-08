import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';

export function useLoginController() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      return true;
    } catch (err) {
      setError(err.message || 'Login failed.');
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  return { username, setUsername, password, setPassword, error, submitting, submit };
}
