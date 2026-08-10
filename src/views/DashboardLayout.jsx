import { NavLink, Outlet } from 'react-router-dom';
import {
  Users,
  Image,
  Compass,
  MessageSquareQuote,
  HelpCircle,
  Link2,
  Settings,
  PartyPopper,
  ClipboardCheck,
  UserCog,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../controllers/AuthContext.jsx';
import { useSiteBranding } from '../controllers/useSiteBranding.js';
import SessionCountdown from './SessionCountdown.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const CONTENT_ITEMS = [
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/home-images', label: 'Site Images', icon: Image },
  { to: '/wellness-areas', label: 'Wellness Areas', icon: Compass },
  { to: '/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { to: '/faq', label: 'FAQ', icon: HelpCircle },
  { to: '/footer-links', label: 'Footer Links', icon: Link2 },
  { to: '/festive', label: 'Festive Promotions', icon: PartyPopper },
];

export default function DashboardLayout() {
  const { username, logout, isAdmin } = useAuth();
  const { logoUrl } = useSiteBranding();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NAV_ITEMS = [
    ...CONTENT_ITEMS,
    { to: '/changes', label: isAdmin ? 'Changes' : 'My Changes', icon: ClipboardCheck },
    ...(isAdmin ? [{ to: '/subadmins', label: 'Sub-admins', icon: UserCog }] : []),
    { to: '/account', label: 'Account Settings', icon: Settings },
  ];

  const navLinks = (
    <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              isActive
                ? 'bg-brand-green text-white'
                : 'text-gray-700 hover:bg-brand-cream dark:text-gray-300 dark:hover:bg-gray-800'
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
    <div className="min-h-screen flex bg-[#f8f7f4] dark:bg-gray-950">
      {/* Desktop sidebar — sticky full-height so nav + Log out stay in view
          no matter how tall the page content is. */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="px-5 py-5 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
          {logoUrl && <img src={logoUrl} alt="NTYBL" className="h-9 w-9 object-contain shrink-0" />}
          <div>
            <p className="font-display text-xl font-semibold text-gray-900 dark:text-gray-100">NTYBL</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
          </div>
        </div>
        {navLinks}
        <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800">
          <p className="px-3 text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">Signed in as {username}</p>
          <button onClick={logout} className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 transition">
            <LogOut size={17} /> Log out
          </button>
        </div>
      </aside>

      {/* Desktop theme toggle — top-right */}
      <div className="hidden lg:block fixed top-4 right-6 z-40">
        <ThemeToggle />
      </div>

      {/* Mobile top bar + drawer */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          {logoUrl && <img src={logoUrl} alt="NTYBL" className="h-7 w-7 object-contain" />}
          <p className="font-display text-lg font-semibold text-gray-900 dark:text-gray-100">NTYBL Admin</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu" className="p-2 text-gray-700 dark:text-gray-200">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/40" onClick={() => setMobileOpen(false)}>
          <aside className="w-72 h-full bg-white dark:bg-gray-900 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-5 border-b border-gray-200 dark:border-gray-800 mt-14">
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Signed in as {username}</p>
            </div>
            {navLinks}
            <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800">
              <button onClick={logout} className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 transition">
                <LogOut size={17} /> Log out
              </button>
            </div>
          </aside>
        </div>
      )}

      <main className="flex-1 min-w-0 p-4 lg:p-8 pt-20 lg:pt-8">
        <Outlet />
      </main>

      {/* Hidden while the mobile drawer is open, otherwise the fixed pill sits
          on top of the drawer's Log out button and blocks it. */}
      {!mobileOpen && <SessionCountdown />}
    </div>
  );
}
