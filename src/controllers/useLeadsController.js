import { useEffect, useState } from 'react';
import { downloadLeadsCsv, fetchLeads, markLeadAttended } from '../models/leadsModel.js';

export function useLeadsController() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [attendingId, setAttendingId] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      setLeads(await fetchLeads());
    } catch (err) {
      setError(err.message || 'Failed to load leads.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function exportCsv() {
    setExporting(true);
    setError('');
    try {
      await downloadLeadsCsv();
    } catch (err) {
      setError(err.message || 'Export failed.');
    } finally {
      setExporting(false);
    }
  }

  async function toggleAttended(lead, attendedBy = '') {
    setAttendingId(lead._id);
    setError('');
    try {
      const updated = await markLeadAttended(lead._id, !lead.attended, attendedBy);
      setLeads((prev) => prev.map((l) => (l._id === updated._id ? updated : l)));
    } catch (err) {
      setError(err.message || 'Failed to update lead.');
    } finally {
      setAttendingId(null);
    }
  }

  return { leads, loading, error, exporting, attendingId, reload: load, exportCsv, toggleAttended };
}
