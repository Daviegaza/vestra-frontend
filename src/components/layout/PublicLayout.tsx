import { Suspense, lazy, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ToastContainer from '../ui/ToastContainer';
import { Spinner } from '../ui/Card';

const AIAssistant = lazy(() => import('../ai/AIAssistant'));
const PWAInstallPrompt = lazy(() => import('./PWAInstallPrompt'));
const CommandPalette = lazy(() => import('../ui/CommandPalette'));

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

export default function PublicLayout() {
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
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      <main className="public-main">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ToastContainer />
      {deferredReady && (
        <Suspense fallback={null}>
          <AIAssistant />
          <PWAInstallPrompt />
          <CommandPalette />
        </Suspense>
      )}
    </div>
  );
}
