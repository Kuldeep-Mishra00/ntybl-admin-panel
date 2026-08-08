import { Plus, Trash2, Save } from 'lucide-react';
import { useFaqController } from '../controllers/useFaqController.js';
import Banner from './Banner.jsx';

export default function Faq() {
  const {
    items,
    disclaimer,
    setDisclaimer,
    error,
    success,
    savingIdx,
    savingDisclaimer,
    update,
    addItem,
    saveItem,
    removeItem,
    saveDisclaimer,
  } = useFaqController();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-gray-900 mb-1">FAQ</h1>
      <p className="text-sm text-gray-500 mb-6">Question &amp; answer pairs shown on the landing page.</p>

      <Banner error={error} success={success} />

      <div className="space-y-4">
        {items.map((it, i) => (
          <div key={it._id || `new-${i}`} className="card">
            <label className="block text-xs font-medium text-gray-600 mb-1">Question</label>
            <input className="input mb-3" value={it.question} onChange={(e) => update(i, 'question', e.target.value)} />
            <label className="block text-xs font-medium text-gray-600 mb-1">Answer</label>
            <textarea className="input" rows={2} value={it.answer} onChange={(e) => update(i, 'answer', e.target.value)} />
            <div className="flex items-center gap-3 mt-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Order</label>
                <input type="number" className="input w-24" value={it.order} onChange={(e) => update(i, 'order', Number(e.target.value))} />
              </div>
              <div className="flex-1" />
              <button onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-600 transition self-end mb-2" aria-label="Delete FAQ">
                <Trash2 size={17} />
              </button>
              <button onClick={() => saveItem(i)} disabled={savingIdx === i} className="btn-primary text-sm self-end">
                <Save size={15} /> {savingIdx === i ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addItem} className="btn-outline text-sm mt-4">
        <Plus size={15} /> Add FAQ
      </button>

      <div className="card mt-8">
        <h3 className="font-semibold text-gray-900 mb-1">Disclaimer</h3>
        <p className="text-xs text-gray-500 mb-3">Shown beneath the FAQ list on the landing page.</p>
        <textarea
          className="input"
          rows={3}
          value={disclaimer}
          onChange={(e) => setDisclaimer(e.target.value)}
          placeholder="e.g. Individual results may vary. This program supports a healthy lifestyle and is not a substitute for professional medical advice."
        />
        <div className="mt-3">
          <button onClick={saveDisclaimer} disabled={savingDisclaimer} className="btn-primary text-sm">
            <Save size={15} /> {savingDisclaimer ? 'Saving…' : 'Save Disclaimer'}
          </button>
        </div>
      </div>
    </div>
  );
}
