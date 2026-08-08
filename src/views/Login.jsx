import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useLoginController } from '../controllers/useLoginController.js';
import { useSiteBranding } from '../controllers/useSiteBranding.js';
import ThemeToggle from './ThemeToggle.jsx';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, setUsername, password, setPassword, error, submitting, submit } = useLoginController();
  const { logoUrl } = useSiteBranding();
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await submit();
    if (ok) navigate(location.state?.from || '/leads', { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4] dark:bg-gray-950 px-4">
      <div className="fixed top-4 right-4 z-40">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm card">
        <div className="text-center mb-6">
          {logoUrl && (
            <img src={logoUrl} alt="NTYBL" className="h-14 w-14 object-contain mx-auto mb-2" />
          )}
          <p className="font-display text-2xl font-semibold text-gray-900 dark:text-gray-100">NTYBL</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-800 dark:text-gray-200">Username</label>
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
            <label className="text-sm font-medium text-gray-800 dark:text-gray-200">Password</label>
            <div className="relative mt-1.5">
              <input
                className="input pr-10"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
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
