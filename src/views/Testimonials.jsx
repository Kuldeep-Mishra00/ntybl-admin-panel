import { Plus, Trash2, Save, Upload, Star } from 'lucide-react';
import { useTestimonialsController } from '../controllers/useTestimonialsController.js';
import Banner from './Banner.jsx';

export default function Testimonials() {
  const { items, error, success, savingIdx, update, handleFile, addItem, saveItem, removeItem } =
    useTestimonialsController();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-gray-900 mb-1">Testimonials</h1>
      <p className="text-sm text-gray-500 mb-6">Client stories shown in the scrolling testimonials section.</p>

      <Banner error={error} success={success} />

      <div className="space-y-5">
        {items.map((it, i) => (
          <div key={it._id || `new-${i}`} className="card">
            <div className="grid md:grid-cols-[120px_1fr] gap-5">
              <div>
                {it.preview ? (
                  <img src={it.preview} alt="" className="w-full h-24 object-cover rounded-full border border-gray-200" />
                ) : (
                  <div className="w-24 h-24 mx-auto rounded-full border border-dashed border-gray-300 grid place-items-center text-gray-400 text-xs">No photo</div>
                )}
                <label className="btn-outline text-xs mt-2 cursor-pointer inline-flex w-full justify-center">
                  <Upload size={13} /> Upload
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(i, e)} />
                </label>
              </div>

              <div className="space-y-3">
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                    <input className="input" value={it.name} onChange={(e) => update(i, 'name', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                    <input className="input" value={it.location} onChange={(e) => update(i, 'location', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Tag</label>
                    <input className="input" value={it.tag} onChange={(e) => update(i, 'tag', e.target.value)} placeholder="Weight Loss" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Quote</label>
                  <textarea className="input" rows={2} value={it.quote} onChange={(e) => update(i, 'quote', e.target.value)} />
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} type="button" onClick={() => update(i, 'rating', n)} aria-label={`${n} stars`}>
                          <Star size={18} className={n <= it.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1" />
                  <button onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-600 transition" aria-label="Delete testimonial">
                    <Trash2 size={17} />
                  </button>
                  <button onClick={() => saveItem(i)} disabled={savingIdx === i} className="btn-primary text-sm">
                    <Save size={15} /> {savingIdx === i ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addItem} className="btn-outline text-sm mt-4">
        <Plus size={15} /> Add Testimonial
      </button>
    </div>
  );
}
