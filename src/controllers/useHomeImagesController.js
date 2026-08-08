import { useEffect, useState } from 'react';
import { fetchHome, updateHome } from '../models/homeModel.js';

export function useHomeImagesController() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    setError('');
    try {
      setData(await fetchHome());
    } catch (err) {
      setError(err.message || 'Failed to load.');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveSlot(fieldPrefix, { file, altText }) {
    setError('');
    setSuccess('');
    const form = new FormData();
    if (file) form.append(fieldPrefix, file);
    form.append(`${fieldPrefix}Alt`, altText);
    try {
      const updated = await updateHome(form);
      setData(updated);
      setSuccess('Saved.');
    } catch (err) {
      setError(err.message || 'Save failed.');
      throw err;
    }
  }

  return { data, error, success, saveSlot };
}
