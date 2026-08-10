import { Plus, Trash2, Save, Upload } from 'lucide-react';
import { useWellnessAreasController } from '../controllers/useWellnessAreasController.js';
import Banner from './Banner.jsx';
import ClickableImage from './ClickableImage.jsx';

export default function WellnessAreas() {
  const { cards, error, success, savingIdx, update, handleFile, handleDetailFile, addCard, saveCard, removeCard } =
    useWellnessAreasController();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Wellness Areas</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Each card shown on the landing page. Videos are YouTube video IDs (the part after <code>v=</code> in the URL), comma-separated.
      </p>

      <Banner error={error} success={success} />

      <div className="space-y-5">
        {cards.map((c, i) => (
          <div key={c._id || `new-${i}`} className="card">
            <div className="grid md:grid-cols-[160px_1fr] gap-5">
              <div>
                {c.preview ? (
                  <ClickableImage src={c.preview} alt={c.kicker || 'Card image'} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                ) : (
                  <div className="w-full h-32 rounded-lg border border-dashed border-gray-300 grid place-items-center text-gray-400 text-xs">No image</div>
                )}
                <label className="btn-outline text-xs mt-2 cursor-pointer inline-flex w-full justify-center">
                  <Upload size={13} /> Upload
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(i, e)} />
                </label>
                <p className="text-[11px] text-gray-400 mt-1 text-center">4:3 landscape</p>
              </div>

              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Title</label>
                    <input className="input" value={c.title} onChange={(e) => update(i, 'title', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Kicker</label>
                    <input className="input" value={c.kicker} onChange={(e) => update(i, 'kicker', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Tags (comma-separated)</label>
                  <input className="input" value={c.tags} onChange={(e) => update(i, 'tags', e.target.value)} placeholder="Weight Loss, Weight Gain" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">YouTube video IDs (comma-separated)</label>
                  <input className="input" value={c.videos} onChange={(e) => update(i, 'videos', e.target.value)} placeholder="dQw4w9WgXcQ, abc12345678" />
                </div>

                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Product Image / Video <span className="font-normal text-gray-400">— shown inside the expanded "Read More" card</span></p>
                  <div className="grid sm:grid-cols-[120px_1fr] gap-3 items-start">
                    <div>
                      {c.detailPreview ? (
                        <ClickableImage src={c.detailPreview} alt="Product image" className="w-full h-20 object-cover rounded-lg border border-gray-200" />
                      ) : (
                        <div className="w-full h-20 rounded-lg border border-dashed border-gray-300 grid place-items-center text-gray-400 text-[11px]">No image</div>
                      )}
                      <label className="btn-outline text-xs mt-2 cursor-pointer inline-flex w-full justify-center">
                        <Upload size={13} /> Product image
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleDetailFile(i, e)} />
                      </label>
                      <p className="text-[11px] text-gray-400 mt-1 text-center">16:9 landscape</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Product video (YouTube ID)</label>
                      <input className="input" value={c.detailVideo} onChange={(e) => update(i, 'detailVideo', e.target.value)} placeholder="dQw4w9WgXcQ" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Order</label>
                    <input type="number" className="input w-24" value={c.order} onChange={(e) => update(i, 'order', Number(e.target.value))} />
                  </div>
                  <div className="flex-1" />
                  <button onClick={() => removeCard(i)} className="text-gray-400 hover:text-red-600 transition self-end mb-2" aria-label="Delete card">
                    <Trash2 size={17} />
                  </button>
                  <button onClick={() => saveCard(i)} disabled={savingIdx === i} className="btn-primary text-sm self-end">
                    <Save size={15} /> {savingIdx === i ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addCard} className="btn-outline text-sm mt-4">
        <Plus size={15} /> Add Wellness Area
      </button>
    </div>
  );
}
