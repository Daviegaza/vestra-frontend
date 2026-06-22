import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AIAssistant from '../ai/AIAssistant';
import ToastContainer from '../ui/ToastContainer';
import PWAInstallPrompt from './PWAInstallPrompt';
import { Spinner } from '../ui/Card';
import CommandPalette from '../ui/CommandPalette';

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
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <AIAssistant />
      <ToastContainer />
      <PWAInstallPrompt />
      <CommandPalette />
    </div>
  );
}
