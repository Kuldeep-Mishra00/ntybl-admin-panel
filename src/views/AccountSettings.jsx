import { Save } from 'lucide-react';
import { useAccountSettingsController } from '../controllers/useAccountSettingsController.js';
import Banner from './Banner.jsx';

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
    submit,
  } = useAccountSettingsController();

  function handleSubmit(e) {
    e.preventDefault();
    submit();
  }

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl font-semibold text-gray-900 mb-1">Account Settings</h1>
      <p className="text-sm text-gray-500 mb-6">Signed in as <strong>{username}</strong>.</p>

      <Banner error={error} success={success} />

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">Current password</label>
          <input type="password" className="input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        </div>
        <hr className="border-gray-200" />
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">New username <span className="text-gray-400 font-normal">(optional)</span></label>
          <input className="input" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder={username} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">New password <span className="text-gray-400 font-normal">(optional, min 8 chars)</span></label>
          <input type="password" className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        {newPassword && (
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">Confirm new password</label>
            <input type="password" className="input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        )}
        <button type="submit" disabled={saving} className="btn-primary text-sm">
          <Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
