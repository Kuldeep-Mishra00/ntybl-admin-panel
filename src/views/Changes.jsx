import { Check, X, Clock } from 'lucide-react';
import { useApprovalsController } from '../controllers/useApprovalsController.js';
import Banner from './Banner.jsx';

export default function Changes() {
  const { changes, error, success, busyId, isAdmin, approve, reject } = useApprovalsController();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
        {isAdmin ? 'Pending Changes' : 'My Changes'}
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {isAdmin
          ? 'Content changes submitted by sub-admins. Approve to apply them live, or reject to discard.'
          : 'Your submitted changes waiting for an admin to approve. They go live once approved.'}
      </p>

      <Banner error={error} success={success} />

      {changes.length === 0 ? (
        <p className="text-sm text-gray-400">{isAdmin ? 'Nothing waiting for approval.' : 'You have no pending changes.'}</p>
      ) : (
        <div className="space-y-3">
          {changes.map((c) => (
            <div key={c._id} className="card flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 shrink-0">
                <Clock size={13} /> Unapproved
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100">{c.label || `${c.method} ${c.resource}`}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  by {c.submittedByName || c.submittedBy} · {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
              {isAdmin && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => approve(c._id)}
                    disabled={busyId === c._id}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-green text-white px-3 py-1.5 text-xs font-medium hover:bg-[#5d7246] transition disabled:opacity-60"
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button
                    onClick={() => reject(c._id)}
                    disabled={busyId === c._id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 text-xs font-medium hover:border-red-400 hover:text-red-600 transition disabled:opacity-60"
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
