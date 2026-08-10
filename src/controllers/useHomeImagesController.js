import { useEffect, useState } from 'react';
import { fetchHome, updateHome } from '../models/homeModel.js';
import { PENDING_MSG, isPending } from '../models/httpClient.js';

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
      if (isPending(updated)) { setSuccess(PENDING_MSG); return; }
      setData(updated);
      setSuccess('Saved.');
    } catch (err) {
      setError(err.message || 'Save failed.');
      throw err;
    }
  }

  async function saveWhatsapp(number, message) {
    setError('');
    setSuccess('');
    const form = new FormData();
    form.append('whatsappNumber', number);
    form.append('whatsappMessage', message);
    try {
      const updated = await updateHome(form);
      if (isPending(updated)) { setSuccess(PENDING_MSG); return; }
      setData(updated);
      setSuccess('WhatsApp settings saved.');
    } catch (err) {
      setError(err.message || 'Save failed.');
    }
  }

  async function saveMetaPixel(pixelId) {
    setError('');
    setSuccess('');
    const form = new FormData();
    form.append('metaPixelId', pixelId);
    try {
      const updated = await updateHome(form);
      if (isPending(updated)) { setSuccess(PENDING_MSG); return; }
      setData(updated);
      setSuccess('Meta Pixel saved.');
    } catch (err) {
      setError(err.message || 'Save failed.');
    }
  }

  return { data, error, success, saveSlot, saveWhatsapp, saveMetaPixel };
}
