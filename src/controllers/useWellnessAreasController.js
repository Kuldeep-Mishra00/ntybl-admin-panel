import { useEffect, useState } from 'react';
import {
  createWellnessArea,
  fetchWellnessAreas,
  removeWellnessArea,
  updateWellnessArea,
} from '../models/wellnessAreasModel.js';
import { PENDING_MSG, isPending } from '../models/httpClient.js';

function emptyCard() {
  return {
    _id: null, title: '', kicker: '', tags: '', videos: '', order: 0,
    image: null, file: null, preview: '',
    detailVideo: '', detailFile: null, detailPreview: '',
  };
}

function fromApi(item) {
  return {
    _id: item._id,
    title: item.title || '',
    kicker: item.kicker || '',
    tags: (item.tags || []).join(', '),
    videos: (item.videos || []).join(', '),
    order: item.order || 0,
    image: item.image,
    file: null,
    preview: item.image?.url || '',
    detailVideo: item.detailVideo || '',
    detailFile: null,
    detailPreview: item.detailImage?.url || '',
  };
}

export function useWellnessAreasController() {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savingIdx, setSavingIdx] = useState(null);

  async function load() {
    setError('');
    try {
      setCards((await fetchWellnessAreas()).map(fromApi));
    } catch (err) {
      setError(err.message || 'Failed to load.');
    }
  }

  useEffect(() => {
    load();
  }, []);

  function update(i, field, value) {
    setCards((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  }

  function handleFile(i, e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setCards((prev) => prev.map((c, idx) => (idx === i ? { ...c, file: f, preview: URL.createObjectURL(f) } : c)));
  }

  function handleDetailFile(i, e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setCards((prev) => prev.map((c, idx) => (idx === i ? { ...c, detailFile: f, detailPreview: URL.createObjectURL(f) } : c)));
  }

  function addCard() {
    setCards((prev) => [...prev, emptyCard()]);
  }

  async function saveCard(i) {
    const c = cards[i];
    if (!c.title.trim()) {
      setError('Title is required.');
      return;
    }
    setError('');
    setSuccess('');
    setSavingIdx(i);
    const form = new FormData();
    form.append('title', c.title);
    form.append('kicker', c.kicker);
    form.append('tags', c.tags);
    form.append('videos', c.videos);
    form.append('order', String(c.order));
    form.append('detailVideo', c.detailVideo);
    if (c.file) form.append('image', c.file);
    if (c.detailFile) form.append('detailImage', c.detailFile);

    try {
      const saved = c._id ? await updateWellnessArea(c._id, form) : await createWellnessArea(form);
      if (isPending(saved)) { setSuccess(PENDING_MSG); return; }
      setCards((prev) => prev.map((card, idx) => (idx === i ? fromApi(saved) : card)));
      setSuccess('Saved.');
    } catch (err) {
      setError(err.message || 'Save failed.');
    } finally {
      setSavingIdx(null);
    }
  }

  async function removeCard(i) {
    const c = cards[i];
    if (!c._id) {
      setCards((prev) => prev.filter((_, idx) => idx !== i));
      return;
    }
    setError('');
    try {
      const res = await removeWellnessArea(c._id);
      if (isPending(res)) { setSuccess(PENDING_MSG); return; }
      setCards((prev) => prev.filter((_, idx) => idx !== i));
      setSuccess('Deleted.');
    } catch (err) {
      setError(err.message || 'Delete failed.');
    }
  }

  return { cards, error, success, savingIdx, update, handleFile, handleDetailFile, addCard, saveCard, removeCard };
}
