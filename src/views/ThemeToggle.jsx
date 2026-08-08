import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../controllers/useTheme.js';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`grid place-items-center w-9 h-9 rounded-full border border-gray-300 text-gray-600 hover:border-brand-green hover:text-brand-green transition dark:border-gray-600 dark:text-gray-300 ${className}`}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
