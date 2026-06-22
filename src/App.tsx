import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { initAuth } from './store/authStore';
import { initTheme } from './store/themeStore';
import AuthGuard from './components/layout/AuthGuard';
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';
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

export default function App() {
  useEffect(() => {
    initAuth();
    initTheme();
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/market" element={<Market />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Auth-protected Public Routes */}
          <Route element={<AuthGuard><PublicLayout /></AuthGuard>}>
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/properties/compare" element={<PropertyCompare />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/agents/:id" element={<AgentDetail />} />
            <Route path="/insights" element={<MarketInsights />} />
          </Route>

          {/* Auth Routes (Login/Register) */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
          </Route>

          {/* Dashboard Routes (Sidebar + Topbar layout) */}
          <Route element={<AuthGuard><DashboardLayout /></AuthGuard>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/seller" element={<SellerDashboard />} />
            <Route path="/dashboard/seller/listings" element={<SellerDashboard />} />
            <Route path="/dashboard/seller/add" element={<SellerDashboard />} />
            <Route path="/dashboard/seller/analytics" element={<SellerDashboard />} />
            <Route path="/dashboard/landlord" element={<LandlordDashboard />} />
            <Route path="/dashboard/landlord/units" element={<LandlordDashboard />} />
            <Route path="/dashboard/landlord/tenants" element={<LandlordDashboard />} />
            <Route path="/dashboard/landlord/maintenance" element={<LandlordDashboard />} />
            <Route path="/dashboard/tenant" element={<TenantDashboard />} />
            <Route path="/dashboard/tenant/rent" element={<TenantDashboard />} />
            <Route path="/dashboard/tenant/receipts" element={<TenantDashboard />} />
            <Route path="/dashboard/tenant/maintenance" element={<TenantDashboard />} />
            <Route path="/dashboard/agent" element={<AgentDashboard />} />
            <Route path="/dashboard/agent/listings" element={<AgentDashboard />} />
            <Route path="/dashboard/agent/leads" element={<AgentDashboard />} />
            <Route path="/dashboard/agent/commissions" element={<AgentDashboard />} />
            <Route path="/dashboard/agent/add" element={<AgentDashboard />} />
            <Route path="/dashboard/agent/subscription" element={<Subscription />} />
            <Route path="/dashboard/escrow" element={<EscrowManagement />} />
            <Route path="/dashboard/analytics" element={<Analytics />} />
            <Route path="/dashboard/maintenance" element={<MaintenanceHub />} />
            <Route path="/dashboard/chama" element={<ChamaDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/admin/users" element={<AdminDashboard />} />
            <Route path="/dashboard/admin/properties" element={<AdminDashboard />} />
            <Route path="/dashboard/admin/verifications" element={<AdminDashboard />} />
            <Route path="/dashboard/admin/fraud" element={<AdminDashboard />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/sell" element={<SellProperty />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
