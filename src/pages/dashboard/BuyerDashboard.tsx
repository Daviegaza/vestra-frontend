import { Heart, Shield, TrendingUp, Building, ArrowRight, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import DashboardShell from '../../components/layout/DashboardShell';
import StatCard from '../../components/dashboard/StatCard';
import PropertyCard from '../../components/property/PropertyCard';
import Card, { Badge } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useWishlistStore } from '../../store/wishlistStore';
import { properties } from '../../data/properties';
import { getMyEscrows } from '../../services/escrow';
import { useAsync } from '../../hooks/useAsync';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
const statusColors: Record<string, BadgeVariant> = {
  initiated: 'info', deposit_paid: 'warning', balance_paid: 'info', completed: 'success', cancelled: 'danger', refunded: 'danger', disputed: 'danger',
};

export default function BuyerDashboard() {
  const location = useLocation();
  const section = location.pathname.split('/').pop() || 'buyer';
  const { all: getFavorites, favorites } = useWishlistStore();
  const { data: escrows, loading: escrowsLoading } = useAsync(() => getMyEscrows('user-001'), []);

  const savedProperties = useMemo(() => {
    const ids = getFavorites();
    return properties.filter((p) => ids.includes(p.id));
  }, [favorites, getFavorites]);

  const recommendations = useMemo(() => properties.filter((_, i) => i % 2 === 0).slice(0, 6), []);

  const activeEscrows = (escrows || []).filter(e => e.status !== 'completed' && e.status !== 'cancelled').length;

  return (
    <DashboardShell>
      {(section === 'buyer') && (
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Buyer Dashboard</h1>
            <p className="text-gray-400 mt-1">Your property journey at a glance.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Saved Properties" value={savedProperties.length} icon={Heart} color="emerald" />
            <StatCard title="Active Escrows" value={activeEscrows} icon={Shield} color="blue" />
            <StatCard title="Total in Escrow" value="KES 19.7M" icon={TrendingUp} color="amber" />
            <StatCard title="Recommendations" value={recommendations.length} icon={Building} color="purple" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Saved Properties</h2>
              <Link to="/dashboard/buyer/favorites" className="text-sm text-emerald-400 hover:underline flex items-center gap-1">View All <ArrowRight size={14} /></Link>
            </div>
            {savedProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {savedProperties.slice(0, 4).map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>
            ) : (
              <Card className="p-8 text-center text-gray-400">
                <Heart size={32} className="mx-auto mb-2 text-gray-600" />
                <p>No saved properties yet.</p>
                <Link to="/market" className="text-sm text-emerald-400 hover:underline">Browse properties</Link>
              </Card>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Recent Escrows</h2>
            {escrowsLoading ? (
              <div className="space-y-2">
                <div className="skeleton h-16 w-full" />
                <div className="skeleton h-16 w-full" />
              </div>
            ) : (escrows || []).length > 0 ? (
              <Card>
                <div className="divide-y divide-gray-700">
                  {(escrows || []).slice(0, 3).map((esc) => (
                    <div key={esc.id} className="p-4 flex items-center justify-between">
                      <div><p className="font-medium text-white">{esc.propertyTitle}</p><p className="text-sm text-gray-400">KES {esc.amount.toLocaleString()} &middot; {new Date(esc.createdAt).toLocaleDateString()}</p></div>
                      <Badge variant={statusColors[esc.status]}>{esc.status.replace('_', ' ')}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center text-gray-400">
                <Shield size={32} className="mx-auto mb-2 text-gray-600" />
                <p>No escrow transactions yet.</p>
              </Card>
            )}
            <Link to="/dashboard/buyer/escrow" className="text-sm text-emerald-400 hover:underline mt-2 inline-block">View all escrows <ArrowRight size={14} className="inline" /></Link>
          </div>
        </div>
      )}

      {section === 'favorites' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Saved Properties</h1>
              <p className="text-gray-400 mt-1">{savedProperties.length} properties saved</p>
            </div>
            <Link to="/market"><Button variant="outline"><Search size={16} className="mr-1" /> Browse More</Button></Link>
          </div>
          {savedProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          ) : (
            <Card className="p-12 text-center text-gray-400">
              <Heart size={48} className="mx-auto mb-3 text-gray-600" />
              <p className="text-lg">No saved properties yet.</p>
              <Link to="/market" className="text-emerald-400 hover:underline text-sm">Start browsing and save your favorites</Link>
            </Card>
          )}
        </div>
      )}

      {section === 'escrow' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">My Escrows</h1>
            <p className="text-gray-400 mt-1">Track your secure property transactions.</p>
          </div>
          {escrowsLoading ? (
            <div className="space-y-3">
              <div className="skeleton h-24 w-full" />
              <div className="skeleton h-24 w-full" />
            </div>
          ) : (
            <Card>
              <div className="divide-y divide-gray-700">
                {(escrows || []).map((esc) => (
                  <div key={esc.id} className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">{esc.propertyTitle}</h3>
                      <Badge variant={statusColors[esc.status]}>{esc.status.replace('_', ' ')}</Badge>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-400">
                      <span>Amount: <strong className="text-white">KES {esc.amount.toLocaleString()}</strong></span>
                      <span>Date: {new Date(esc.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: esc.status === 'completed' ? '100%' : esc.status === 'balance_paid' ? '75%' : esc.status === 'deposit_paid' ? '50%' : '25%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
