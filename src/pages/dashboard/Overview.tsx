import { Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import StatsGrid from '../../components/dashboard/StatsGrid';
import QuickActions from '../../components/dashboard/QuickActions';
import Card from '../../components/ui/Card';
import { Building, Eye, MessageSquare, TrendingUp, Users, Wrench, CreditCard, PlusCircle, Search, Shield } from 'lucide-react';
import type { UserRole } from '../../types';
import { properties } from '../../data/properties';

// Buyers don't get a dashboard
const roleRoutes: Partial<Record<UserRole, string>> = {
  seller: '/dashboard/seller',
  landlord: '/dashboard/landlord',
  tenant: '/dashboard/tenant',
  agent: '/dashboard/agent',
  admin: '/dashboard/admin',
};

const roleActions: Record<string, { label: string; description: string; icon: typeof Building; to: string; color: 'emerald' | 'amber' | 'blue' | 'purple' }[]> = {
  seller: [
    { label: 'Add Listing', description: 'Create a new property listing', icon: PlusCircle, to: '/dashboard/seller/add', color: 'emerald' },
    { label: 'My Listings', description: 'Manage your properties', icon: Building, to: '/dashboard/seller/listings', color: 'blue' },
    { label: 'Analytics', description: 'View performance stats', icon: TrendingUp, to: '/dashboard/seller/analytics', color: 'amber' },
    { label: 'Verify Property', description: 'Get AI trust score', icon: Shield, to: '/verify', color: 'purple' },
    { label: 'Browse Market', description: 'Explore the market', icon: Search, to: '/market', color: 'emerald' },
    { label: 'Messages', description: 'View your inbox', icon: MessageSquare, to: '/messages', color: 'blue' },
  ],
  landlord: [
    { label: 'Add Unit', description: 'Add a rental unit', icon: PlusCircle, to: '/dashboard/landlord/units', color: 'emerald' },
    { label: 'View Tenants', description: 'Manage your tenants', icon: Users, to: '/dashboard/landlord/tenants', color: 'blue' },
    { label: 'Maintenance', description: 'Track repair requests', icon: Wrench, to: '/dashboard/landlord/maintenance', color: 'amber' },
    { label: 'Rent Collection', description: 'View payment history', icon: CreditCard, to: '/dashboard/landlord', color: 'purple' },
    { label: 'Browse Market', description: 'Find new properties', icon: Search, to: '/market', color: 'emerald' },
    { label: 'Messages', description: 'View your inbox', icon: MessageSquare, to: '/messages', color: 'blue' },
  ],
  tenant: [
    { label: 'Pay Rent', description: 'Pay via M-Pesa', icon: CreditCard, to: '/dashboard/tenant/rent', color: 'emerald' },
    { label: 'View Receipts', description: 'Payment history', icon: TrendingUp, to: '/dashboard/tenant/receipts', color: 'blue' },
    { label: 'Maintenance', description: 'Submit a request', icon: Wrench, to: '/dashboard/tenant/maintenance', color: 'amber' },
    { label: 'Find a Home', description: 'Browse properties', icon: Search, to: '/market', color: 'purple' },
    { label: 'Messages', description: 'View your inbox', icon: MessageSquare, to: '/messages', color: 'emerald' },
    { label: 'Settings', description: 'Account settings', icon: Users, to: '/settings', color: 'blue' },
  ],
  agent: [
    { label: 'Add Listing', description: 'Create a listing', icon: PlusCircle, to: '/dashboard/agent/add', color: 'emerald' },
    { label: 'My Listings', description: 'Manage properties', icon: Building, to: '/dashboard/agent/listings', color: 'blue' },
    { label: 'Leads', description: 'View client leads', icon: Users, to: '/dashboard/agent/leads', color: 'amber' },
    { label: 'Commissions', description: 'Earnings tracker', icon: CreditCard, to: '/dashboard/agent/commissions', color: 'purple' },
    { label: 'Subscription', description: 'Manage plan', icon: TrendingUp, to: '/dashboard/agent/subscription', color: 'emerald' },
    { label: 'Browse Market', description: 'Explore the market', icon: Search, to: '/market', color: 'blue' },
  ],
  admin: [
    { label: 'Manage Users', description: 'User administration', icon: Users, to: '/dashboard/admin/users', color: 'emerald' },
    { label: 'Properties', description: 'All properties', icon: Building, to: '/dashboard/admin/properties', color: 'blue' },
    { label: 'Verifications', description: 'Pending approvals', icon: Shield, to: '/dashboard/admin/verifications', color: 'amber' },
    { label: 'Fraud Reports', description: 'Investigate cases', icon: Shield, to: '/dashboard/admin/fraud', color: 'purple' },
    { label: 'Analytics', description: 'Platform stats', icon: TrendingUp, to: '/dashboard/admin', color: 'emerald' },
    { label: 'Messages', description: 'View inbox', icon: MessageSquare, to: '/messages', color: 'blue' },
  ],
};

export default function Dashboard() {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/auth/login" replace />;
  if (user.role === 'buyer') return <Navigate to="/market" replace />;

  const target = roleRoutes[user.role];
  if (target && window.location.pathname === '/dashboard') return <Navigate to={target} replace />;

  // Fallback overview for any role
  const actions = roleActions[user.role] || roleActions.seller;
  const featured = properties.filter((p) => p.isFeatured).slice(0, 3);

  return (
    <div className="space-y-6">
      <WelcomeBanner />

      {/* Quick Stats */}
      <StatsGrid
        stats={[
          { title: 'Active Listings', value: properties.filter(p => p.status === 'active').length, icon: Building, color: 'emerald', change: '+12 this month', changeDirection: 'up' },
          { title: 'Total Views', value: properties.reduce((s, p) => s + p.views, 0).toLocaleString(), icon: Eye, color: 'blue', change: '+23% this week', changeDirection: 'up' },
          { title: 'Verified Properties', value: properties.filter(p => p.isVerified).length, icon: Shield, color: 'amber', change: '98% rate', changeDirection: 'up' },
          { title: 'Market Activity', value: 'High', icon: TrendingUp, color: 'purple', change: 'Nairobi leading', changeDirection: 'up' },
        ]}
      />

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
        <QuickActions actions={actions} />
      </div>

      {/* Featured Properties */}
      {featured.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Featured Properties</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featured.map((p) => (
              <Link key={p.id} to={`/properties/${p.id}`}>
                <Card hover padding="none" className="overflow-hidden">
                  <img src={p.images[0]} alt={p.title} className="w-full h-40 object-cover" />
                  <div className="p-4 space-y-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{p.title}</p>
                    <p className="text-sm text-gray-500">{p.city}, {p.county}</p>
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold">KES {p.price.toLocaleString()}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
