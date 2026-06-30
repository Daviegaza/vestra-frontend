import { useState, useEffect, Suspense, lazy } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import ToastContainer from '../ui/ToastContainer';
import { Spinner } from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { ROLE_INDEX, roleAccentClasses } from '../../lib/roleCatalog';
import { Layers } from 'lucide-react';

const AIAssistant = lazy(() => import('../ai/AIAssistant'));
const PWAInstallPrompt = lazy(() => import('./PWAInstallPrompt'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <Spinner size="lg" />
        <p className="text-sm text-gray-400 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deferredReady, setDeferredReady] = useState(false);

  useEffect(() => {
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const handle = idle ? idle(() => setDeferredReady(true)) : window.setTimeout(() => setDeferredReady(true), 800);
    return () => {
      const cancel = (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (cancel) cancel(handle as number); else clearTimeout(handle as number);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed left-0 top-16 bottom-0 z-50 lg:hidden"
              >
                <Sidebar />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-64px)] overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <DashboardScopeBar />
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>

      <ToastContainer />
      {deferredReady && (
        <Suspense fallback={null}>
          <AIAssistant />
          <PWAInstallPrompt />
        </Suspense>
      )}
    </div>
  );
}

const SCOPE_LABELS: Record<string, { label: string; scope: string }> = {
  '/dashboard': { label: 'Home', scope: 'Member' },
  '/dashboard/seller': { label: 'Seller Workspace', scope: 'Selling' },
  '/dashboard/landlord': { label: 'Landlord Workspace', scope: 'Rentals' },
  '/dashboard/tenant': { label: 'Tenant Workspace', scope: 'My home' },
  '/dashboard/agent': { label: 'Agent Workspace', scope: 'Brokerage' },
  '/dashboard/admin': { label: 'Admin', scope: 'Platform' },
  '/dashboard/chama': { label: 'Investments', scope: 'Chama' },
  '/dashboard/escrow': { label: 'Escrow', scope: 'Transactions' },
  '/dashboard/roles': { label: 'My Roles', scope: 'Account' },
  '/dashboard/analytics': { label: 'Analytics', scope: 'Insights' },
  '/dashboard/maintenance': { label: 'Maintenance', scope: 'Service' },
};

function DashboardScopeBar() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const activeRole = user?.activeRole || 'buyer';
  const entry = ROLE_INDEX[activeRole];
  const accent = entry ? roleAccentClasses(entry.accent) : roleAccentClasses('emerald');
  const path = '/' + location.pathname.split('/').slice(1, 3).join('/');
  const meta = SCOPE_LABELS[path] || SCOPE_LABELS[location.pathname] || { label: 'Dashboard', scope: '' };

  return (
    <div className="flex items-center justify-between mb-4 sm:mb-5 flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${accent.bg} ${accent.text}`}>
          <Layers size={12} /> {entry?.label || activeRole} mode
        </span>
        <span className="text-xs text-gray-400">/</span>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{meta.label}</span>
        {meta.scope && <span className="text-xs text-gray-400">· {meta.scope}</span>}
      </div>
    </div>
  );
}
