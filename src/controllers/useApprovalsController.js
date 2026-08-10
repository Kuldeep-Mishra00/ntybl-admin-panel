import { useEffect, useState } from 'react';
import { approveChange, fetchMyChanges, fetchPendingChanges, rejectChange } from '../models/approvalsModel.js';
import { useAuth } from './AuthContext.jsx';

export function useApprovalsController() {
  const { isAdmin } = useAuth();
  const [changes, setChanges] = useState([]);
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

  useEffect(() => {
    load();
  }, []);

  async function approve(id) {
    setBusyId(id);
    setError('');
    setSuccess('');
    try {
      await approveChange(id);
      setChanges((prev) => prev.filter((c) => c._id !== id));
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
      setChanges((prev) => prev.filter((c) => c._id !== id));
      setSuccess('Rejected.');
    } catch (err) {
      setError(err.message || 'Reject failed.');
    } finally {
      setBusyId(null);
    }
  }

  return { changes, error, success, busyId, isAdmin, approve, reject, reload: load };
}
