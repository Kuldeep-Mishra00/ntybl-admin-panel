import { useEffect, useState } from 'react';
import { changeCredentials, checkUsername } from '../models/authModel.js';
import { storeSession } from '../models/httpClient.js';
import { useAuth } from './AuthContext.jsx';

// idle: nothing to check (blank, or same as current) · short: under 3 chars
// checking: request in flight · available / taken: server verdict
export function useAccountSettingsController() {
  const { username, updateUsername } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState('idle');

  // Live "is this username taken?" check, debounced so we don't hit the API on
  // every keystroke.
  useEffect(() => {
    const name = newUsername.trim();
    if (!name || name === username) { setUsernameStatus('idle'); return; }
    if (name.length < 3) { setUsernameStatus('short'); return; }

    setUsernameStatus('checking');
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const { available } = await checkUsername(name);
        if (!cancelled) setUsernameStatus(available ? 'available' : 'taken');
      } catch {
        if (!cancelled) setUsernameStatus('idle'); // don't block on a failed check
      }
    }, 400);

    return () => { cancelled = true; clearTimeout(t); };
  }, [newUsername, username]);

  async function submit() {
    setError('');
    setSuccess('');

    if (!newUsername.trim() && !newPassword.trim()) {
      setError('Enter a new username and/or a new password.');
      return;
    }
    if (newUsername.trim() && usernameStatus === 'taken') {
      setError('That username is already taken — pick another.');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    if (newPassword && newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    setSaving(true);
    try {
      const payload = { currentPassword };
      if (newUsername.trim()) payload.newUsername = newUsername.trim();
      if (newPassword) payload.newPassword = newPassword;

      const data = await changeCredentials(payload);
      storeSession(data.token, data.username, data.role || 'admin');
      updateUsername(data.username);
      setSuccess('Credentials updated.');
      setCurrentPassword('');
      setNewUsername('');
      setNewPassword('');
      setConfirmPassword('');
      setUsernameStatus('idle');
    } catch (err) {
      setError(err.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  }

  return {
    username,
    currentPassword,
    setCurrentPassword,
    newUsername,
    setNewUsername,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    success,
    saving,
    usernameStatus,
    submit,
  };
}
