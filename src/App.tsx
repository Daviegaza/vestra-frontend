import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { initAuth } from './store/authStore';
import { initTheme } from './store/themeStore';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AuthGuard from './components/layout/AuthGuard';
import AIAssistant from './components/ai/AIAssistant';
import ToastContainer from './components/ui/ToastContainer';
import FloatingQuickActions from './components/ui/FloatingQuickActions';
import PWAInstallPrompt from './components/layout/PWAInstallPrompt';
import { Spinner } from './components/ui/Card';

// Lazy-load all page components for code-splitting
const Home = lazy(() => import('./pages/public/Home'));
const Market = lazy(() => import('./pages/public/Market'));
const PropertyDetail = lazy(() => import('./pages/public/PropertyDetail'));
const Verify = lazy(() => import('./pages/public/Verify'));
const Agents = lazy(() => import('./pages/public/Agents'));
const AgentDetail = lazy(() => import('./pages/public/AgentDetail'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));
const FAQ = lazy(() => import('./pages/public/FAQ'));
const Blog = lazy(() => import('./pages/public/Blog'));
const BlogPost = lazy(() => import('./pages/public/BlogPost'));
const MarketInsights = lazy(() => import('./pages/public/MarketInsights'));
const PropertyCompare = lazy(() => import('./pages/public/PropertyCompare'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Dashboard = lazy(() => import('./pages/dashboard/Overview'));
const SellerDashboard = lazy(() => import('./pages/dashboard/SellerDashboard'));
const LandlordDashboard = lazy(() => import('./pages/dashboard/LandlordDashboard'));
const TenantDashboard = lazy(() => import('./pages/dashboard/TenantDashboard'));
const AgentDashboard = lazy(() => import('./pages/dashboard/AgentDashboard'));
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));
const ChamaDashboard = lazy(() => import('./pages/dashboard/ChamaDashboard'));
const Subscription = lazy(() => import('./pages/dashboard/Subscription'));
const EscrowManagement = lazy(() => import('./pages/dashboard/EscrowManagement'));
const Analytics = lazy(() => import('./pages/dashboard/Analytics'));
const Messages = lazy(() => import('./pages/Messages'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Settings = lazy(() => import('./pages/Settings'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));
const MaintenanceHub = lazy(() => import('./pages/dashboard/MaintenanceHub'));
const SellProperty = lazy(() => import('./pages/SellProperty'));

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

function PageShell({ children, noFooter }: { children: React.ReactNode; noFooter?: boolean }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar />
      <main className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </main>
      <AIAssistant />
      <ToastContainer />
      <FloatingQuickActions />
      <PWAInstallPrompt />
      {!noFooter && <Footer />}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    initAuth();
    initTheme();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageShell><Home /></PageShell>} />
        <Route path="/market" element={<PageShell><Market /></PageShell>} />
        <Route path="/agents" element={<PageShell><Agents /></PageShell>} />
        <Route path="/about" element={<PageShell><About /></PageShell>} />
        <Route path="/contact" element={<PageShell><Contact /></PageShell>} />
        <Route path="/faq" element={<PageShell><FAQ /></PageShell>} />
        <Route path="/blog" element={<PageShell><Blog /></PageShell>} />

        <Route path="/properties/:id" element={<AuthGuard><PageShell><PropertyDetail /></PageShell></AuthGuard>} />
        <Route path="/properties/compare" element={<AuthGuard><PageShell><PropertyCompare /></PageShell></AuthGuard>} />
        <Route path="/verify" element={<AuthGuard><PageShell><Verify /></PageShell></AuthGuard>} />
        <Route path="/agents/:id" element={<AuthGuard><PageShell><AgentDetail /></PageShell></AuthGuard>} />
        <Route path="/insights" element={<AuthGuard><PageShell><MarketInsights /></PageShell></AuthGuard>} />
        <Route path="/terms" element={<PageShell><Terms /></PageShell>} />
        <Route path="/privacy" element={<PageShell><Privacy /></PageShell>} />
        <Route path="/blog/:slug" element={<PageShell><BlogPost /></PageShell>} />

        <Route path="/auth/login" element={<PageShell noFooter><Login /></PageShell>} />
        <Route path="/auth/register" element={<PageShell noFooter><Register /></PageShell>} />

        <Route path="/sell" element={<AuthGuard><PageShell noFooter><SellProperty /></PageShell></AuthGuard>} />
        <Route path="/dashboard" element={<AuthGuard><PageShell noFooter><Dashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/seller" element={<AuthGuard><PageShell noFooter><SellerDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/seller/listings" element={<AuthGuard><PageShell noFooter><SellerDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/seller/add" element={<AuthGuard><PageShell noFooter><SellerDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/seller/analytics" element={<AuthGuard><PageShell noFooter><SellerDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/landlord" element={<AuthGuard><PageShell noFooter><LandlordDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/landlord/units" element={<AuthGuard><PageShell noFooter><LandlordDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/landlord/tenants" element={<AuthGuard><PageShell noFooter><LandlordDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/landlord/maintenance" element={<AuthGuard><PageShell noFooter><LandlordDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/tenant" element={<AuthGuard><PageShell noFooter><TenantDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/tenant/rent" element={<AuthGuard><PageShell noFooter><TenantDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/tenant/receipts" element={<AuthGuard><PageShell noFooter><TenantDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/tenant/maintenance" element={<AuthGuard><PageShell noFooter><TenantDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/agent" element={<AuthGuard><PageShell noFooter><AgentDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/agent/listings" element={<AuthGuard><PageShell noFooter><AgentDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/agent/leads" element={<AuthGuard><PageShell noFooter><AgentDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/agent/commissions" element={<AuthGuard><PageShell noFooter><AgentDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/agent/add" element={<AuthGuard><PageShell noFooter><AgentDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/agent/subscription" element={<AuthGuard><PageShell noFooter><Subscription /></PageShell></AuthGuard>} />
        <Route path="/dashboard/escrow" element={<AuthGuard><PageShell noFooter><EscrowManagement /></PageShell></AuthGuard>} />
        <Route path="/dashboard/analytics" element={<AuthGuard><PageShell noFooter><Analytics /></PageShell></AuthGuard>} />
        <Route path="/dashboard/maintenance" element={<AuthGuard><PageShell noFooter><MaintenanceHub /></PageShell></AuthGuard>} />
        <Route path="/dashboard/chama" element={<AuthGuard><PageShell noFooter><ChamaDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/admin" element={<AuthGuard><PageShell noFooter><AdminDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/admin/users" element={<AuthGuard><PageShell noFooter><AdminDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/admin/properties" element={<AuthGuard><PageShell noFooter><AdminDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/admin/verifications" element={<AuthGuard><PageShell noFooter><AdminDashboard /></PageShell></AuthGuard>} />
        <Route path="/dashboard/admin/fraud" element={<AuthGuard><PageShell noFooter><AdminDashboard /></PageShell></AuthGuard>} />

        <Route path="/messages" element={<AuthGuard><PageShell noFooter><Messages /></PageShell></AuthGuard>} />
        <Route path="/notifications" element={<AuthGuard><PageShell noFooter><Notifications /></PageShell></AuthGuard>} />
        <Route path="/settings" element={<AuthGuard><PageShell noFooter><Settings /></PageShell></AuthGuard>} />

        <Route path="*" element={<PageShell><NotFound /></PageShell>} />
      </Routes>
    </BrowserRouter>
  );
}
