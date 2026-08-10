import { useEffect, useState } from 'react';
import { fetchFooterLinks, replaceFooterLinks } from '../models/footerLinksModel.js';
import { PENDING_MSG, isPending } from '../models/httpClient.js';

export function useFooterLinksController() {
  const [links, setLinks] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setError('');
    try {
      setLinks(await fetchFooterLinks());
    } catch (err) {
      setError(err.message || 'Failed to load.');
    }
  }

  useEffect(() => {
    load();
  }, []);

  function update(i, field, value) {
    setLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
  }

  function addLink() {
    setLinks((prev) => [...prev, { platform: 'instagram', url: '', order: prev.length }]);
  }

  function removeLink(i) {
    setLinks((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function save() {
    const invalid = links.some((l) => !l.platform.trim());
    if (invalid) {
      setError('Every link needs a platform.');
      return;
    }
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const res = await replaceFooterLinks(links.map((l, i) => ({ ...l, order: i })));
      if (isPending(res)) { setSuccess(PENDING_MSG); return; }
      setLinks(res);
      setSuccess('Saved.');
    } catch (err) {
      setError(err.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  return { links, error, success, saving, update, addLink, removeLink, save };
}
