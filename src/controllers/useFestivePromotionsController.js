import { useEffect, useState } from 'react';
import {
  createFestivePromotion,
  fetchFestivePromotions,
  removeFestivePromotion,
  updateFestivePromotion,
} from '../models/festivePromotionsModel.js';

export function useFestivePromotionsController() {
  const [promos, setPromos] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setError('');
    try {
      setPromos(await fetchFestivePromotions());
    } catch (err) {
      setError(err.message || 'Failed to load.');
    }
  }

  useEffect(() => {
    load();
  }, []);

  // draft: { _id?, name, message, startAt, endAt, enabled, file }
  async function save(draft) {
    if (!draft.name?.trim()) {
      setError('Name is required.');
      return false;
    }
    if (!draft.startAt || !draft.endAt) {
      setError('Start and end date/time are required.');
      return false;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    const form = new FormData();
    form.append('name', draft.name);
    form.append('message', draft.message || '');
    form.append('startAt', new Date(draft.startAt).toISOString());
    form.append('endAt', new Date(draft.endAt).toISOString());
    form.append('enabled', String(!!draft.enabled));
    if (draft.file) form.append('image', draft.file);

    try {
      const saved = draft._id
        ? await updateFestivePromotion(draft._id, form)
        : await createFestivePromotion(form);
      setPromos((prev) => {
        const exists = prev.some((p) => p._id === saved._id);
        return exists ? prev.map((p) => (p._id === saved._id ? saved : p)) : [saved, ...prev];
      });
      setSuccess('Saved.');
      return true;
    } catch (err) {
      setError(err.message || 'Save failed.');
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    setError('');
    try {
      await removeFestivePromotion(id);
      setPromos((prev) => prev.filter((p) => p._id !== id));
      setSuccess('Deleted.');
    } catch (err) {
      setError(err.message || 'Delete failed.');
    }
  }

  return { promos, error, success, saving, save, remove, reload: load };
}
