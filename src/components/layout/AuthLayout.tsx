import { Suspense } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Building } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { Sun, Moon } from 'lucide-react';
import { Spinner } from '../ui/Card';

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export default function AuthLayout() {
  const { theme, toggle: toggleTheme } = useThemeStore();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Minimal auth header */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Building size={16} className="text-white" />
          </div>
          <span className="text-emerald-600 dark:text-emerald-400">Vestra</span>
        </Link>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>
      </header>

      {/* Centered auth content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Vestra Properties. All rights reserved.
      </footer>
    </div>
  );
}
