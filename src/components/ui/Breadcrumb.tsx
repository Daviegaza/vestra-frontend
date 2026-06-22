import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { Fragment } from 'react';

const routeLabels: Record<string, string> = {
  '': 'Home',
  'market': 'Market',
  'agents': 'Agents',
  'about': 'About',
  'contact': 'Contact',
  'faq': 'FAQ',
  'blog': 'Blog',
  'verify': 'Verify',
  'insights': 'Market Insights',
  'properties': 'Properties',
  'compare': 'Compare',
  'sell': 'Sell Property',
  'dashboard': 'Dashboard',
  'seller': 'Seller',
  'landlord': 'Landlord',
  'tenant': 'Tenant',
  'agent': 'Agent',
  'admin': 'Admin',
  'chama': 'Chama',
  'listings': 'Listings',
  'add': 'Add New',
  'analytics': 'Analytics',
  'units': 'Units',
  'tenants': 'Tenants',
  'maintenance': 'Maintenance',
  'rent': 'Pay Rent',
  'receipts': 'Receipts',
  'leads': 'Leads',
  'commissions': 'Commissions',
  'subscription': 'Subscription',
  'escrow': 'Escrow',
  'users': 'Users',
  'verifications': 'Verifications',
  'fraud': 'Fraud Reports',
  'settings': 'Settings',
  'messages': 'Messages',
  'notifications': 'Notifications',
  'auth': 'Account',
  'login': 'Sign In',
  'register': 'Sign Up',
  'privacy': 'Privacy',
  'terms': 'Terms',
  'favorites': 'Saved Properties',
};

interface BreadcrumbProps {
  className?: string;
}

export default function Breadcrumb({ className = '' }: BreadcrumbProps) {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1 text-sm ${className}`}>
      <Link
        to="/"
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Home"
      >
        <Home size={14} />
      </Link>
      {segments.map((segment, i) => {
        const path = '/' + segments.slice(0, i + 1).join('/');
        const isLast = i === segments.length - 1;
        const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <Fragment key={path}>
            <ChevronRight size={12} className="text-gray-400 shrink-0" />
            {isLast ? (
              <span className="text-gray-900 dark:text-white font-medium truncate max-w-[160px]">{label}</span>
            ) : (
              <Link
                to={path}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors truncate max-w-[160px] p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
