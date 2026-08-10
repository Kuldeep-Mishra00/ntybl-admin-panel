import { useEffect, useState } from 'react';
import { createSubadmin, fetchSubadmins, removeSubadmin } from '../models/subadminsModel.js';

export function useSubadminsController() {
  const [subadmins, setSubadmins] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setError('');
    try {
      setSubadmins(await fetchSubadmins());
    } catch (err) {
      setError(err.message || 'Failed to load.');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function add({ name, username, password }) {
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const created = await createSubadmin({ name, username, password });
      setSubadmins((prev) => [...prev, created]);
      setSuccess('Sub-admin created.');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to create sub-admin.');
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    setError('');
    try {
      await removeSubadmin(id);
      setSubadmins((prev) => prev.filter((s) => s._id !== id));
      setSuccess('Sub-admin removed.');
    } catch (err) {
      setError(err.message || 'Failed to remove.');
    }
  }

  return { subadmins, error, success, saving, add, remove };
}
