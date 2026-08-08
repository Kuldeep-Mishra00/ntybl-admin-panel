import { NavLink, Outlet } from 'react-router-dom';
import {
  Users,
  Image,
  Compass,
  MessageSquareQuote,
  HelpCircle,
  Link2,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../controllers/AuthContext.jsx';

const NAV_ITEMS = [
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/home-images', label: 'Site Images', icon: Image },
  { to: '/wellness-areas', label: 'Wellness Areas', icon: Compass },
  { to: '/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { to: '/faq', label: 'FAQ', icon: HelpCircle },
  { to: '/footer-links', label: 'Footer Links', icon: Link2 },
  { to: '/account', label: 'Account Settings', icon: Settings },
];

export default function DashboardLayout() {
  const { username, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              isActive ? 'bg-brand-green text-white' : 'text-gray-700 hover:bg-brand-cream'
            }`
          }
        >
          <Icon size={17} />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-[#f8f7f4]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 shrink-0">
        <div className="px-5 py-5 border-b border-gray-200">
          <p className="font-display text-xl font-semibold text-gray-900">NTYBL</p>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
        {navLinks}
        <div className="px-3 py-4 border-t border-gray-200">
          <p className="px-3 text-xs text-gray-500 mb-2 truncate">Signed in as {username}</p>
          <button onClick={logout} className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition">
            <LogOut size={17} /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-14">
        <p className="font-display text-lg font-semibold text-gray-900">NTYBL Admin</p>
        <button onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu" className="p-2 text-gray-700">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/40" onClick={() => setMobileOpen(false)}>
          <aside className="w-72 h-full bg-white flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-5 border-b border-gray-200 mt-14">
              <p className="text-xs text-gray-500 truncate">Signed in as {username}</p>
            </div>
            {navLinks}
            <div className="px-3 py-4 border-t border-gray-200">
              <button onClick={logout} className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition">
                <LogOut size={17} /> Log out
              </button>
            </div>
          </aside>
        </div>
      )}

      <main className="flex-1 min-w-0 p-4 lg:p-8 pt-20 lg:pt-8">
        <Outlet />
      </main>
    </div>
  );
}
