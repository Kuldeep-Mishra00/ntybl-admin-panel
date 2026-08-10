import { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { useHomeImagesController } from '../controllers/useHomeImagesController.js';
import Banner from './Banner.jsx';
import ClickableImage from './ClickableImage.jsx';

function ImageSlot({ label, slot, onSave, hint }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(slot?.url || '');
  const [altText, setAltText] = useState(slot?.altText || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPreview(slot?.url || '');
    setAltText(slot?.altText || '');
  }, [slot]);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({ file, altText });
      setFile(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{label}</h3>
      {hint && <p className="text-xs text-gray-400 mb-3">Recommended: {hint}</p>}
      {!hint && <div className="mb-3" />}
      {preview ? (
        <ClickableImage src={preview} alt={label} className="w-full h-48 object-cover rounded-lg border border-gray-200 mb-3" />
      ) : (
        <div className="w-full h-48 rounded-lg border border-dashed border-gray-300 grid place-items-center text-gray-400 text-sm mb-3">
          No image set
        </div>
      )}
      <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Alt text</label>
      <input className="input mb-3" value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Describe the image" />
      <label className="btn-outline text-sm cursor-pointer inline-flex">
        <Upload size={15} /> Choose file
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>
      {file && <span className="ml-2 text-xs text-gray-500">{file.name}</span>}
      <div className="mt-4">
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export default function HomeImages() {
  const { data, error, success, saveSlot } = useHomeImagesController();

  if (!data && !error) return <p className="text-gray-500">Loading…</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Site Images</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Images shown across the landing page — Hero section, site logo (navbar &amp; footer), and the
        Sessions banner.
      </p>

      <Banner error={error} success={success} />

      <div className="grid md:grid-cols-2 gap-6">
        <ImageSlot label="Hero Portrait" hint="4:5 portrait — e.g. 800×1000" slot={data?.heroPortrait} onSave={(v) => saveSlot('heroPortrait', v)} />
        <ImageSlot label="Hero Backdrop" hint="16:9 landscape — e.g. 1920×1080" slot={data?.heroBackdrop} onSave={(v) => saveSlot('heroBackdrop', v)} />
        <ImageSlot label="Site Logo (Navbar & Footer)" hint="1:1 square, transparent PNG — e.g. 512×512" slot={data?.logo} onSave={(v) => saveSlot('logo', v)} />
        <ImageSlot label="Sessions Banner Background" hint="16:9 landscape — e.g. 1920×1080" slot={data?.sessionsBanner} onSave={(v) => saveSlot('sessionsBanner', v)} />
      </div>
    </div>
  );
}
