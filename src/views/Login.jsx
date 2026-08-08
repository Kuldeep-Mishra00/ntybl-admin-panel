import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useLoginController } from '../controllers/useLoginController.js';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, setUsername, password, setPassword, error, submitting, submit } = useLoginController();

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await submit();
    if (ok) navigate(location.state?.from || '/leads', { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4] px-4">
      <div className="w-full max-w-sm card">
        <div className="text-center mb-6">
          <p className="font-display text-2xl font-semibold text-gray-900">NTYBL</p>
          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-800">Username</label>
            <input
              className="input mt-1.5"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-800">Password</label>
            <input
              className="input mt-1.5"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
            <LogIn size={16} /> {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
