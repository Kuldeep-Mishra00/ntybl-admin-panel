import { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useSubadminsController } from '../controllers/useSubadminsController.js';
import Banner from './Banner.jsx';

export default function Subadmins() {
  const { subadmins, error, success, saving, add, remove } = useSubadminsController();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  async function onAdd(e) {
    e.preventDefault();
    const ok = await add({ name, username, password });
    if (ok) {
      setName('');
      setUsername('');
      setPassword('');
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Sub-admins</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Sub-admins can manage all content, but their changes stay in the Changes queue until you approve them.
        They can attend leads but can't undo it, and can't manage sub-admins or approve changes.
      </p>

      <Banner error={error} success={success} />

      <form onSubmit={onAdd} className="card space-y-4 mb-6">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <ShieldCheck size={18} className="text-brand-green" /> New sub-admin
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1.5">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Riya Sharma" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1.5">Login ID (username)</label>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. riya" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1.5">Password <span className="text-gray-400 font-normal">(min 6 chars)</span></label>
          <div className="relative">
            <input
              className="input pr-10"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700" aria-label={showPw ? 'Hide password' : 'Show password'}>
              {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={saving} className="btn-primary text-sm">
          <Plus size={15} /> {saving ? 'Creating…' : 'Create sub-admin'}
        </button>
      </form>

      <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Existing sub-admins</h2>
      {subadmins.length === 0 ? (
        <p className="text-sm text-gray-400">No sub-admins yet.</p>
      ) : (
        <div className="space-y-2">
          {subadmins.map((s) => (
            <div key={s._id} className="card flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{s.name || s.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">ID: {s.username}</p>
              </div>
              <button onClick={() => remove(s._id)} className="text-gray-400 hover:text-red-600 transition" aria-label="Remove sub-admin">
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
