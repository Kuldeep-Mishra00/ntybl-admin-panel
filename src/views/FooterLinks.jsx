import { Plus, Trash2, Save } from 'lucide-react';
import { useFooterLinksController } from '../controllers/useFooterLinksController.js';
import Banner from './Banner.jsx';

const COMMON_PLATFORMS = ['facebook', 'instagram', 'twitter', 'youtube', 'linkedin', 'tiktok'];

export default function FooterLinks() {
  const { links, error, success, saving, update, addLink, removeLink, save } = useFooterLinksController();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Footer Social Links</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Icons shown in the "Follow Us" section of the footer. Saving replaces the whole list.</p>

      <Banner error={error} success={success} />

      <div className="card space-y-3">
        {links.length === 0 && <p className="text-sm text-gray-400">No links yet — add one below.</p>}
        {links.map((l, i) => (
          <div key={i} className="flex items-center gap-3">
            <select className="input w-28 shrink-0" value={l.platform} onChange={(e) => update(i, 'platform', e.target.value)}>
              {COMMON_PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input
              className="input flex-1 min-w-0"
              placeholder="https://..."
              value={l.url}
              onChange={(e) => update(i, 'url', e.target.value)}
            />
            <button onClick={() => removeLink(i)} className="text-gray-400 hover:text-red-600 transition shrink-0" aria-label="Remove link">
              <Trash2 size={17} />
            </button>
          </div>
        ))}

        <div className="flex gap-3 pt-2">
          <button onClick={addLink} className="btn-outline text-sm">
            <Plus size={15} /> Add Link
          </button>
          <button onClick={save} disabled={saving} className="btn-primary text-sm">
            <Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
