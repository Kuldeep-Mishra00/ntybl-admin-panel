import { useEffect, useState } from 'react';
import {
  approveChange,
  clearChangeHistory,
  deleteHistoryChange,
  fetchChangeHistory,
  fetchMyChanges,
  fetchPendingChanges,
  rejectChange,
} from '../models/approvalsModel.js';
import { useAuth } from './AuthContext.jsx';

export function useApprovalsController() {
  const { isAdmin } = useAuth();
  const [changes, setChanges] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busyId, setBusyId] = useState(null);

  async function load() {
    setError('');
    try {
      setChanges(isAdmin ? await fetchPendingChanges() : await fetchMyChanges());
    } catch (err) {
      setError(err.message || 'Failed to load.');
    }
  }

  async function loadHistory() {
    if (!isAdmin) return;
    try {
      setHistory(await fetchChangeHistory());
    } catch {
      /* history is secondary — don't surface an error banner for it */
    }
  }

  useEffect(() => {
    load();
    loadHistory();
  }, []);

  // Marks the row with its outcome (so it flashes green/red), then clears it
  // from the pending list and refreshes the history log below.
  function settle(id, outcome) {
    setChanges((prev) => prev.map((c) => (c._id === id ? { ...c, outcome } : c)));
    setTimeout(() => {
      setChanges((prev) => prev.filter((c) => c._id !== id));
      loadHistory();
    }, 1400);
  }

  async function approve(id) {
    setBusyId(id);
    setError('');
    setSuccess('');
    try {
      await approveChange(id);
      settle(id, 'approved');
      setSuccess('Approved and applied.');
    } catch (err) {
      setError(err.message || 'Approve failed.');
    } finally {
      setBusyId(null);
    }
  }

  async function reject(id) {
    setBusyId(id);
    setError('');
    setSuccess('');
    try {
      await rejectChange(id);
      settle(id, 'rejected');
      setSuccess('Rejected.');
    } catch (err) {
      setError(err.message || 'Reject failed.');
    } finally {
      setBusyId(null);
    }
  }

  async function removeHistory(id) {
    setBusyId(id);
    setError('');
    setSuccess('');
    try {
      await deleteHistoryChange(id);
      setHistory((prev) => prev.filter((c) => c._id !== id));
      setSuccess('Removed from history.');
    } catch (err) {
      setError(err.message || 'Delete failed.');
    } finally {
      setBusyId(null);
    }
  }

  async function clearHistory() {
    setError('');
    setSuccess('');
    try {
      await clearChangeHistory();
      setHistory([]);
      setSuccess('History cleared.');
    } catch (err) {
      setError(err.message || 'Clear failed.');
    }
  }

  return { changes, history, error, success, busyId, isAdmin, approve, reject, removeHistory, clearHistory, reload: load };
}
