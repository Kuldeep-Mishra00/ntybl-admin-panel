import { Save, Check, X, Loader2 } from 'lucide-react';
import { useAccountSettingsController } from '../controllers/useAccountSettingsController.js';
import Banner from './Banner.jsx';

function UsernameHint({ status }) {
  if (status === 'checking') {
    return <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 inline-flex items-center gap-1"><Loader2 size={13} className="animate-spin" /> Checking availability…</p>;
  }
  if (status === 'available') {
    return <p className="mt-1.5 text-xs text-green-600 dark:text-green-400 inline-flex items-center gap-1"><Check size={13} /> Available — you can use this name.</p>;
  }
  if (status === 'taken') {
    return <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 inline-flex items-center gap-1"><X size={13} /> Already taken — pick another.</p>;
  }
  if (status === 'short') {
    return <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">Username must be at least 3 characters.</p>;
  }
  return null;
}

export default function AccountSettings() {
  const {
    username,
    currentPassword,
    setCurrentPassword,
    newUsername,
    setNewUsername,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    success,
    saving,
    usernameStatus,
    submit,
  } = useAccountSettingsController();

  function handleSubmit(e) {
    e.preventDefault();
    submit();
  }

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Account Settings</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Signed in as <strong>{username}</strong>.</p>

      <Banner error={error} success={success} />

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1.5">Current password</label>
          <input type="password" className="input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        </div>
        <hr className="border-gray-200 dark:border-gray-700" />
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1.5">New username <span className="text-gray-400 font-normal">(optional)</span></label>
          <input className="input" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder={username} autoComplete="off" />
          <UsernameHint status={usernameStatus} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1.5">New password <span className="text-gray-400 font-normal">(optional, min 8 chars)</span></label>
          <input type="password" className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        {newPassword && (
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1.5">Confirm new password</label>
            <input type="password" className="input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        )}
        <button
          type="submit"
          disabled={saving || usernameStatus === 'taken' || usernameStatus === 'checking'}
          className="btn-primary text-sm disabled:opacity-60"
        >
          <Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
