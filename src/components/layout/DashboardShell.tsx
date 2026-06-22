import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../types';
import {
  LayoutDashboard, Home, Users, UserCheck,
  Wrench, CreditCard, Star, TrendingUp, MessageSquare,
  Shield, Settings, LogOut, Building, PlusCircle, List,
  Receipt, Crown,
} from 'lucide-react';
import type { ComponentType } from 'react';

interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
}

// Only roles that MANAGE something get a dashboard sidebar.
// Buyers are normal users — they browse the market directly, no dashboard needed.
type DashboardRole = Exclude<UserRole, 'buyer'>;

const roleNavs: Record<DashboardRole, { primary: NavItem[]; secondary: NavItem[] }> = {
  seller: {
    primary: [
      { to: '/dashboard/seller', label: 'Overview', icon: LayoutDashboard },
      { to: '/dashboard/seller/listings', label: 'My Listings', icon: List },
      { to: '/dashboard/seller/add', label: 'Add Listing', icon: PlusCircle },
      { to: '/dashboard/seller/analytics', label: 'Analytics', icon: TrendingUp },
    ],
    secondary: [
      { to: '/messages', label: 'Messages', icon: MessageSquare },
      { to: '/verify', label: 'Verify Property', icon: Shield },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
  landlord: {
    primary: [
      { to: '/dashboard/landlord', label: 'Overview', icon: LayoutDashboard },
      { to: '/dashboard/landlord/units', label: 'My Units', icon: Home },
      { to: '/dashboard/landlord/tenants', label: 'Tenants', icon: Users },
      { to: '/dashboard/landlord/maintenance', label: 'Maintenance', icon: Wrench },
    ],
    secondary: [
      { to: '/messages', label: 'Messages', icon: MessageSquare },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
  tenant: {
    primary: [
      { to: '/dashboard/tenant', label: 'Overview', icon: LayoutDashboard },
      { to: '/dashboard/tenant/rent', label: 'Pay Rent', icon: CreditCard },
      { to: '/dashboard/tenant/receipts', label: 'Receipts', icon: Receipt },
      { to: '/dashboard/tenant/maintenance', label: 'Maintenance', icon: Wrench },
      { to: '/market', label: 'Find a Home', icon: Building },
    ],
    secondary: [
      { to: '/messages', label: 'Messages', icon: MessageSquare },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
  agent: {
    primary: [
      { to: '/dashboard/agent', label: 'Overview', icon: LayoutDashboard },
      { to: '/dashboard/agent/listings', label: 'My Listings', icon: List },
      { to: '/dashboard/agent/leads', label: 'Leads', icon: UserCheck },
      { to: '/dashboard/agent/commissions', label: 'Commissions', icon: CreditCard },
      { to: '/dashboard/agent/add', label: 'Add Listing', icon: PlusCircle },
    ],
    secondary: [
      { to: '/dashboard/agent/subscription', label: 'Subscription', icon: Crown },
      { to: '/messages', label: 'Messages', icon: MessageSquare },
      { to: '/market', label: 'Browse Market', icon: Building },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
  admin: {
    primary: [
      { to: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
      { to: '/dashboard/admin/users', label: 'Users', icon: Users },
      { to: '/dashboard/admin/properties', label: 'Properties', icon: Building },
      { to: '/dashboard/admin/verifications', label: 'Verifications', icon: Shield },
      { to: '/dashboard/admin/fraud', label: 'Fraud Reports', icon: Star },
    ],
    secondary: [
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
};

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const role = (user?.role || 'seller') as DashboardRole;
  const nav = roleNavs[role] || roleNavs.seller;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <aside className="flex flex-col w-64 lg:w-72 border-r border-gray-800 bg-gray-900 p-4">
        <div className="mb-6 px-2">
          <span className="inline-block px-3 py-1 bg-emerald-900/30 text-emerald-400 rounded-full text-xs font-semibold uppercase tracking-wider">
            {user?.role} Dashboard
          </span>
        </div>

        <nav className="flex-1 space-y-5">
          <div className="space-y-1">
            {nav.primary.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive(item.to)
                    ? 'bg-emerald-900/30 text-emerald-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </div>

          <div>
            <p className="px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">More</p>
            <div className="space-y-1">
              {nav.secondary.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive(item.to)
                      ? 'bg-emerald-900/30 text-emerald-400'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </aside>

      <div className="flex-1 overflow-y-auto bg-gray-950">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
