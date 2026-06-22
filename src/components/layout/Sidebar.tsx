import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../types';
import {
  LayoutDashboard, Home, Users, UserCheck,
  Wrench, CreditCard, Star, TrendingUp, MessageSquare,
  Shield, Settings, LogOut, Building, PlusCircle, List,
  Receipt, Crown, ChevronLeft, ChevronRight,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { useState, useEffect } from 'react';
import Avatar from '../ui/Avatar';
import Tooltip from '../ui/Tooltip';

interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
  badge?: string;
}

type DashboardRole = Exclude<UserRole, 'buyer'>;

const roleNavs: Record<DashboardRole, { primary: NavItem[]; secondary: NavItem[] }> = {
  seller: {
    primary: [
      { to: '/dashboard/seller', label: 'Overview', icon: LayoutDashboard },
      { to: '/dashboard/seller/listings', label: 'My Listings', icon: List },
      { to: '/dashboard/seller/add', label: 'Add Listing', icon: PlusCircle },
      { to: '/dashboard/seller/analytics', label: 'Analytics', icon: TrendingUp },
      { to: '/market', label: 'Browse Market', icon: Building },
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
      { to: '/messages', label: 'Messages', icon: MessageSquare },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
};

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const role = (user?.role || 'seller') as DashboardRole;
  const nav = roleNavs[role] || roleNavs.seller;
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('vestra_sidebar_collapsed') === 'true');

  useEffect(() => {
    localStorage.setItem('vestra_sidebar_collapsed', String(collapsed));
  }, [collapsed]);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside
      className={`sidebar-transition relative flex flex-col h-[calc(100vh-64px)] border-r border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shrink-0 ${
        collapsed ? 'w-[68px]' : 'w-60 lg:w-64'
      }`}
    >
      {/* Role badge */}
      <div className={`px-3 pt-4 pb-2 ${collapsed ? 'flex justify-center' : ''}`}>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-semibold uppercase tracking-wider ${collapsed ? 'px-2' : ''}`}>
          <Shield size={collapsed ? 14 : 12} />
          {!collapsed && <span>{user?.role}</span>}
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
        <div className="space-y-0.5">
          {nav.primary.map((item) => {
            const active = isActive(item.to);
            return collapsed ? (
              <Tooltip key={item.to} content={item.label} position="right">
                <Link
                  to={item.to}
                  className={`flex items-center justify-center w-11 h-11 mx-auto rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <item.icon size={20} />
                </Link>
              </Tooltip>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon size={18} className="shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full font-semibold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {!collapsed && (
          <div>
            <p className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
              More
            </p>
            <div className="space-y-0.5">
              {nav.secondary.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.to)
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon size={18} className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* User + Collapse at bottom */}
      <div className="px-2 py-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar name={user.fullName} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1">
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center justify-center h-9 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${collapsed ? 'w-full' : 'w-9'}`}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
