import { useEffect, useState } from 'react';
import { downloadLeadsCsv, fetchLeads } from '../models/leadsModel.js';

export function useLeadsController() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

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

  return { leads, loading, error, exporting, reload: load, exportCsv };
}
