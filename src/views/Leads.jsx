import { Download, RefreshCw } from 'lucide-react';
import { useLeadsController } from '../controllers/useLeadsController.js';
import Banner from './Banner.jsx';

export default function Leads() {
  const { leads, loading, error, exporting, reload, exportCsv } = useLeadsController();

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-semibold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">{leads.length} total submissions</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reload} className="btn-outline text-sm" disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={exportCsv} className="btn-primary text-sm" disabled={exporting || leads.length === 0}>
            <Download size={15} /> {exporting ? 'Exporting…' : 'Download CSV'}
          </button>
        </div>
      </div>

      <Banner error={error} />

      <div className="card p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Concern Area</th>
              <th className="px-4 py-3">Details</th>
              <th className="px-4 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading…</td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">No leads yet.</td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead._id} className="border-b border-gray-100 last:border-0 align-top">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{lead.fullName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{lead.countryCode} {lead.phone}</td>
                  <td className="px-4 py-3">{lead.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{lead.state}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{lead.concernArea}</td>
                  <td className="px-4 py-3 max-w-xs">{lead.problemDetails}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                    {new Date(lead.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
