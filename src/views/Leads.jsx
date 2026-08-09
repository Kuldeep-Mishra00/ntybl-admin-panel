import { Download, RefreshCw, Check, CheckCircle2 } from 'lucide-react';
import { useLeadsController } from '../controllers/useLeadsController.js';
import Banner from './Banner.jsx';

export default function Leads() {
  const { leads, loading, error, exporting, attendingId, reload, exportCsv, toggleAttended } =
    useLeadsController();

  const attendedCount = leads.filter((l) => l.attended).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-semibold text-gray-900 dark:text-gray-100">Leads</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {leads.length} total · {attendedCount} attended
          </p>
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
            <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Concern Area</th>
              <th className="px-4 py-3">Height</th>
              <th className="px-4 py-3">Weight</th>
              <th className="px-4 py-3">Details</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Attended</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-400">Loading…</td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-400">No leads yet.</td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead._id}
                  className={`border-b border-gray-100 dark:border-gray-800 last:border-0 align-top ${
                    lead.attended
                      ? 'bg-green-50 dark:bg-green-500/10 text-green-900 dark:text-green-200'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <td className={`px-4 py-3 font-medium whitespace-nowrap ${lead.attended ? '' : 'text-gray-900 dark:text-gray-100'}`}>{lead.fullName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{lead.countryCode} {lead.phone}</td>
                  <td className="px-4 py-3">{lead.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{lead.state}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{lead.concernArea}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{lead.height || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{lead.weight || '—'}</td>
                  <td className="px-4 py-3 max-w-xs">{lead.problemDetails}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {new Date(lead.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {lead.attended ? (
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1 font-medium text-green-700 dark:text-green-300">
                          <CheckCircle2 size={15} /> Attended
                        </span>
                        {lead.attendedBy && (
                          <span className="text-xs text-green-700/80 dark:text-green-300/80">by {lead.attendedBy}</span>
                        )}
                        <button
                          onClick={() => toggleAttended(lead)}
                          disabled={attendingId === lead._id}
                          className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 underline underline-offset-2 text-left"
                        >
                          {attendingId === lead._id ? 'Updating…' : 'Undo'}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => toggleAttended(lead)}
                        disabled={attendingId === lead._id}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-green text-white px-3 py-1.5 text-xs font-medium hover:bg-[#5d7246] transition disabled:opacity-60"
                      >
                        <Check size={14} /> {attendingId === lead._id ? 'Marking…' : 'Attend'}
                      </button>
                    )}
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
