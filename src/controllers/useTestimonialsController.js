import { useEffect, useState } from 'react';
import {
  createTestimonial,
  fetchTestimonials,
  removeTestimonial,
  updateTestimonial,
} from '../models/testimonialsModel.js';
import { PENDING_MSG, isPending } from '../models/httpClient.js';

function emptyItem() {
  return { _id: null, name: '', location: '', rating: 5, quote: '', tag: '', avatar: null, file: null, preview: '' };
}

function fromApi(item) {
  return {
    _id: item._id,
    name: item.name || '',
    location: item.location || '',
    rating: item.rating || 5,
    quote: item.quote || '',
    tag: item.tag || '',
    avatar: item.avatar,
    file: null,
    preview: item.avatar?.url || '',
  };
}

export function useTestimonialsController() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savingIdx, setSavingIdx] = useState(null);

  async function load() {
    setError('');
    try {
      setItems((await fetchTestimonials()).map(fromApi));
    } catch (err) {
      setError(err.message || 'Failed to load.');
    }
  }

  useEffect(() => {
    load();
  }, []);

  function update(i, field, value) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)));
  }

  function handleFile(i, e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, file: f, preview: URL.createObjectURL(f) } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }

  async function saveItem(i) {
    const it = items[i];
    if (!it.name.trim() || !it.quote.trim()) {
      setError('Name and quote are required.');
      return;
    }
    setError('');
    setSuccess('');
    setSavingIdx(i);
    const form = new FormData();
    form.append('name', it.name);
    form.append('location', it.location);
    form.append('rating', String(it.rating));
    form.append('quote', it.quote);
    form.append('tag', it.tag);
    if (it.file) form.append('avatar', it.file);

    try {
      const saved = it._id ? await updateTestimonial(it._id, form) : await createTestimonial(form);
      if (isPending(saved)) { setSuccess(PENDING_MSG); return; }
      setItems((prev) => prev.map((row, idx) => (idx === i ? fromApi(saved) : row)));
      setSuccess('Saved.');
    } catch (err) {
      setError(err.message || 'Save failed.');
    } finally {
      setSavingIdx(null);
    }
  }

  async function removeItem(i) {
    const it = items[i];
    if (!it._id) {
      setItems((prev) => prev.filter((_, idx) => idx !== i));
      return;
    }
    setError('');
    try {
      const res = await removeTestimonial(it._id);
      if (isPending(res)) { setSuccess(PENDING_MSG); return; }
      setItems((prev) => prev.filter((_, idx) => idx !== i));
      setSuccess('Deleted.');
    } catch (err) {
      setError(err.message || 'Delete failed.');
    }
  }

  return { items, error, success, savingIdx, update, handleFile, addItem, saveItem, removeItem };
}
