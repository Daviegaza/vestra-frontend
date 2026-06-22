import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import DashboardShell from '../../components/layout/DashboardShell';
import RoleBanner from '../../components/layout/RoleBanner';
import type { UserRole } from '../../types';

// Buyers don't get a dashboard — they're normal people browsing properties
const roleRoutes: Partial<Record<UserRole, string>> = {
  seller: '/dashboard/seller',
  landlord: '/dashboard/landlord',
  tenant: '/dashboard/tenant',
  agent: '/dashboard/agent',
  admin: '/dashboard/admin',
};

export default function Dashboard() {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/auth/login" replace />;

  // Buyers go straight to browsing — no dashboard needed
  if (user.role === 'buyer') return <Navigate to="/market" replace />;

  const target = roleRoutes[user.role];
  if (target && window.location.pathname === '/dashboard') return <Navigate to={target} replace />;

  return (
    <DashboardShell>
      <RoleBanner />
    </DashboardShell>
  );
}
