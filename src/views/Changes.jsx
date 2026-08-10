import { Check, X, Clock } from 'lucide-react';
import { useApprovalsController } from '../controllers/useApprovalsController.js';
import ClickableImage from './ClickableImage.jsx';
import Banner from './Banner.jsx';

const FIELD_LABELS = {
  title: 'Title', kicker: 'Kicker', tags: 'Tags', videos: 'Videos', detailVideo: 'Product video',
  question: 'Question', answer: 'Answer', order: 'Order', disclaimer: 'Disclaimer',
  name: 'Name', location: 'Location', rating: 'Rating', quote: 'Quote', tag: 'Tag',
  message: 'Message', startAt: 'Starts', endAt: 'Ends', enabled: 'Enabled',
  heroPortraitAlt: 'Hero portrait alt', heroBackdropAlt: 'Hero backdrop alt',
  logoAlt: 'Logo alt', sessionsBannerAlt: 'Sessions banner alt',
};
// internal plumbing fields not worth showing
const HIDDEN_FIELDS = new Set(['existingDetailImages']);

function formatValue(key, value) {
  if (value == null || value === '') return null;
  if (key === 'links' && Array.isArray(value)) {
    return value.map((l) => `${l.platform}${l.url ? ` → ${l.url}` : ''}`).join(', ');
  }
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

// Collects every image URL out of a pending change (staged uploads + any
// existing images the sub-admin chose to keep).
function collectImages(change) {
  const urls = [];
  for (const val of Object.values(change.images || {})) {
    if (Array.isArray(val)) val.forEach((im) => im?.url && urls.push(im.url));
    else if (val?.url) urls.push(val.url);
  }
  const existing = change.body?.existingDetailImages;
  if (existing) {
    try {
      JSON.parse(existing).forEach((im) => im?.url && urls.push(im.url));
    } catch { /* ignore */ }
  }
  return urls;
}

function ChangePreview({ change }) {
  const body = change.body || {};
  const fields = Object.entries(body)
    .filter(([k, v]) => !HIDDEN_FIELDS.has(k) && formatValue(k, v) != null);
  const images = collectImages(change);

  if (change.method === 'DELETE') {
    return <p className="text-sm text-red-600 dark:text-red-400 mt-2">This will delete the item.</p>;
  }
  if (fields.length === 0 && images.length === 0) return null;

  return (
    <div className="mt-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 space-y-2">
      {fields.map(([k, v]) => (
        <div key={k} className="text-sm">
          <span className="font-medium text-gray-600 dark:text-gray-400">{FIELD_LABELS[k] || k}: </span>
          <span className="text-gray-800 dark:text-gray-200 break-words">{formatValue(k, v)}</span>
        </div>
      ))}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {images.map((url, i) => (
            <ClickableImage key={i} src={url} alt="preview" className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Changes() {
  const { changes, error, success, busyId, isAdmin, approve, reject } = useApprovalsController();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
        {isAdmin ? 'Pending Changes' : 'My Changes'}
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {isAdmin
          ? 'Review each sub-admin change below — preview the text and images, then approve to apply it live or reject to discard.'
          : 'Your submitted changes waiting for an admin to approve. They go live once approved.'}
      </p>

      <Banner error={error} success={success} />

      {changes.length === 0 ? (
        <p className="text-sm text-gray-400">{isAdmin ? 'Nothing waiting for approval.' : 'You have no pending changes.'}</p>
      ) : (
        <div className="space-y-3">
          {changes.map((c) => {
            const cardCls =
              c.outcome === 'approved'
                ? 'border-green-300 bg-green-50 dark:border-green-500/40 dark:bg-green-500/10'
                : c.outcome === 'rejected'
                ? 'border-red-300 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10'
                : '';
            return (
              <div key={c._id} className={`card transition-colors ${cardCls}`}>
                <div className="flex flex-wrap items-center gap-4">
                  {c.outcome === 'approved' ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-600 text-white shrink-0">
                      <Check size={13} /> Approved
                    </span>
                  ) : c.outcome === 'rejected' ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-600 text-white shrink-0">
                      <X size={13} /> Rejected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 shrink-0">
                      <Clock size={13} /> Unapproved
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{c.label || `${c.method} ${c.resource}`}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      by {c.submittedByName || c.submittedBy} · {new Date(c.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {isAdmin && !c.outcome && (
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

                {isAdmin && !c.outcome && <ChangePreview change={c} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
