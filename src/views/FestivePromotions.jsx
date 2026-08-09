import { useState } from 'react';
import { Plus, Trash2, Save, Upload, MousePointerClick, X } from 'lucide-react';
import { useFestivePromotionsController } from '../controllers/useFestivePromotionsController.js';
import Banner from './Banner.jsx';
import ClickableImage from './ClickableImage.jsx';

const EMPTY = { _id: null, name: '', message: '', startAt: '', endAt: '', enabled: true, file: null, preview: '' };

// ISO date -> value for <input type="datetime-local"> in the browser's local time.
function toLocalInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d - tz).toISOString().slice(0, 16);
}

function statusOf(p) {
  const now = Date.now();
  const start = new Date(p.startAt).getTime();
  const end = new Date(p.endAt).getTime();
  if (!p.enabled) return { label: 'Disabled', cls: 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300' };
  if (now < start) return { label: 'Upcoming', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' };
  if (now > end) return { label: 'Ended', cls: 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300' };
  return { label: 'Live now', cls: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300' };
}

export default function FestivePromotions() {
  const { promos, error, success, saving, save, remove } = useFestivePromotionsController();
  const [draft, setDraft] = useState(EMPTY);

  const set = (field, value) => setDraft((d) => ({ ...d, [field]: value }));

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setDraft((d) => ({ ...d, file: f, preview: URL.createObjectURL(f) }));
  }

  function editPromo(p) {
    setDraft({
      _id: p._id,
      name: p.name,
      message: p.message || '',
      startAt: toLocalInput(p.startAt),
      endAt: toLocalInput(p.endAt),
      enabled: p.enabled,
      file: null,
      preview: p.image?.url || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function onSave() {
    const ok = await save(draft);
    if (ok) setDraft(EMPTY);
  }

  const totalClicks = promos.reduce((sum, p) => sum + (p.clicks || 0), 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Festive Promotions</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Schedule a promotional banner that appears on the landing page only during its time window. Clicking it
        opens the contact form pre-tagged with the promotion.
      </p>

      <Banner error={error} success={success} />

      {/* Create / edit form */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            {draft._id ? 'Edit promotion' : 'New promotion'}
          </h2>
          {draft._id && (
            <button onClick={() => setDraft(EMPTY)} className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 inline-flex items-center gap-1">
              <X size={14} /> Cancel edit
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-[160px_1fr] gap-5">
          <div>
            {draft.preview ? (
              <ClickableImage src={draft.preview} alt="Flyer" className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
            ) : (
              <div className="w-full h-32 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 grid place-items-center text-gray-400 text-xs">Flyer (optional)</div>
            )}
            <label className="btn-outline text-xs mt-2 cursor-pointer inline-flex w-full justify-center">
              <Upload size={13} /> Flyer image
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Name</label>
              <input className="input" value={draft.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Diwali Dhamaka" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Message</label>
              <input className="input" value={draft.message} onChange={(e) => set('message', e.target.value)} placeholder="Flat 20% off all programs this festive season!" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Starts</label>
                <input type="datetime-local" className="input" value={draft.startAt} onChange={(e) => set('startAt', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Ends</label>
                <input type="datetime-local" className="input" value={draft.endAt} onChange={(e) => set('endAt', e.target.value)} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input type="checkbox" checked={draft.enabled} onChange={(e) => set('enabled', e.target.checked)} />
                Enabled
              </label>
              <button onClick={onSave} disabled={saving} className="btn-primary text-sm">
                <Save size={15} /> {saving ? 'Saving…' : draft._id ? 'Update promotion' : 'Create promotion'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Existing promotions */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">Previous & scheduled promotions</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400 inline-flex items-center gap-1">
          <MousePointerClick size={15} /> {totalClicks} total clicks
        </span>
      </div>

      {promos.length === 0 ? (
        <p className="text-sm text-gray-400">No promotions yet — create one above.</p>
      ) : (
        <div className="space-y-3">
          {promos.map((p) => {
            const st = statusOf(p);
            return (
              <div key={p._id} className="card flex flex-wrap items-center gap-4">
                {p.image?.url && (
                  <ClickableImage src={p.image.url} alt={p.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{p.name}</p>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${st.cls}`}>{st.label}</span>
                  </div>
                  {p.message && <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{p.message}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(p.startAt).toLocaleString()} → {new Date(p.endAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-center shrink-0">
                  <p className="text-lg font-semibold text-brand-green">{p.clicks || 0}</p>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide">clicks</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => editPromo(p)} className="btn-outline text-xs">Edit</button>
                  <button onClick={() => remove(p._id)} className="text-gray-400 hover:text-red-600 transition" aria-label="Delete promotion">
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
