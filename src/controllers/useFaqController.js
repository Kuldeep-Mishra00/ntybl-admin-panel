import { useEffect, useState } from 'react';
import {
  createFaqItem,
  fetchFaq,
  fetchFaqDisclaimer,
  removeFaqItem,
  updateFaqDisclaimer,
  updateFaqItem,
} from '../models/faqModel.js';

function emptyItem() {
  return { _id: null, question: '', answer: '', order: 0 };
}

export function useFaqController() {
  const [items, setItems] = useState([]);
  const [disclaimer, setDisclaimer] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savingIdx, setSavingIdx] = useState(null);
  const [savingDisclaimer, setSavingDisclaimer] = useState(false);

  async function load() {
    setError('');
    try {
      setItems(await fetchFaq());
    } catch (err) {
      setError(err.message || 'Failed to load.');
    }
    try {
      const data = await fetchFaqDisclaimer();
      setDisclaimer(data?.disclaimer || '');
    } catch {
      // disclaimer endpoint may not exist yet — leave it blank
    }
  }

  useEffect(() => {
    load();
  }, []);

  function update(i, field, value) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }

  async function saveItem(i) {
    const it = items[i];
    if (!it.question.trim() || !it.answer.trim()) {
      setError('Question and answer are required.');
      return;
    }
    setError('');
    setSuccess('');
    setSavingIdx(i);
    const payload = { question: it.question, answer: it.answer, order: it.order };
    try {
      const saved = it._id ? await updateFaqItem(it._id, payload) : await createFaqItem(payload);
      setItems((prev) => prev.map((row, idx) => (idx === i ? saved : row)));
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
      await removeFaqItem(it._id);
      setItems((prev) => prev.filter((_, idx) => idx !== i));
      setSuccess('Deleted.');
    } catch (err) {
      setError(err.message || 'Delete failed.');
    }
  }

  async function saveDisclaimer() {
    setError('');
    setSuccess('');
    setSavingDisclaimer(true);
    try {
      const saved = await updateFaqDisclaimer(disclaimer);
      setDisclaimer(saved?.disclaimer || disclaimer);
      setSuccess('Disclaimer saved.');
    } catch (err) {
      setError(err.message || 'Failed to save disclaimer.');
    } finally {
      setSavingDisclaimer(false);
    }
  }

  return {
    items,
    disclaimer,
    setDisclaimer,
    error,
    success,
    savingIdx,
    savingDisclaimer,
    update,
    addItem,
    saveItem,
    removeItem,
    saveDisclaimer,
  };
}
