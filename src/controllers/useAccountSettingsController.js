import { useState } from 'react';
import { changeCredentials } from '../models/authModel.js';
import { storeSession } from '../models/httpClient.js';
import { useAuth } from './AuthContext.jsx';

export function useAccountSettingsController() {
  const { username, updateUsername } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit() {
    setError('');
    setSuccess('');

    if (!newUsername.trim() && !newPassword.trim()) {
      setError('Enter a new username and/or a new password.');
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
      storeSession(data.token, data.username);
      updateUsername(data.username);
      setSuccess('Credentials updated.');
      setCurrentPassword('');
      setNewUsername('');
      setNewPassword('');
      setConfirmPassword('');
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
    submit,
  };
}
