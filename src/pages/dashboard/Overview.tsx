import { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Building, Shield, MessageSquare, TrendingUp, Search, Heart, Layers, ArrowRight, Sparkles, PlusCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import StatsGrid from '../../components/dashboard/StatsGrid';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import RoleActivationModal from '../../components/role/RoleActivationModal';
import InviteBanner from '../../components/role/InviteBanner';
import { ROLE_CATALOG, ROLE_INDEX, roleAccentClasses, type RoleCatalogEntry } from '../../lib/roleCatalog';
import { properties } from '../../data/properties';
import type { UserRole } from '../../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, switchRole } = useAuthStore();
  const [activatingRole, setActivatingRole] = useState<RoleCatalogEntry | null>(null);

  if (!user) return <Navigate to="/auth/login" replace />;

  const isBaseMember = user.activeRole === 'buyer';
  const activatedNonBase = user.roles.filter((r) => r !== 'buyer');
  const available = ROLE_CATALOG.filter((e) => !user.roles.includes(e.role));
  const featured = properties.filter((p) => p.isFeatured).slice(0, 3);

  if (!isBaseMember) {
    const entry = ROLE_INDEX[user.activeRole];
    if (entry && window.location.pathname === '/dashboard') {
      return <Navigate to={entry.dashboardPath} replace />;
    }
  }

  const handleSwitchRole = (role: UserRole) => {
    switchRole(role);
    const target = ROLE_INDEX[role]?.dashboardPath || '/dashboard';
    toast.success(`Switched to ${ROLE_INDEX[role]?.label || role}`);
    navigate(target);
  };

  return (
    <div className="space-y-6">
      <WelcomeBanner />
      <InviteBanner />

      {activatedNonBase.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Layers size={18} className="text-emerald-600" /> Your workspaces
            </h2>
            <Link to="/dashboard/roles" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
              Manage roles →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activatedNonBase.map((r) => {
              const entry = ROLE_INDEX[r];
              if (!entry) return null;
              const accent = roleAccentClasses(entry.accent);
              const Icon = entry.icon;
              return (
                <Card key={r} hover className="cursor-pointer" onClick={() => handleSwitchRole(r)}>
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accent.bg}`}>
                      <Icon size={22} className={accent.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 dark:text-white">{entry.label}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Active</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{entry.tagline}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Open workspace</span>
                    <ArrowRight size={14} className={accent.text} />
                  </div>
                </Card>
              );
            })}
            <Link to="/dashboard/roles" className="block">
              <Card hover className="border-2 border-dashed border-gray-300 dark:border-gray-700 bg-transparent h-full flex flex-col items-center justify-center text-center py-6">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center mb-2">
                  <PlusCircle size={22} />
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">Add a new role</p>
                <p className="text-xs text-gray-500 mt-0.5">Landlord, agent, tenant, seller…</p>
              </Card>
            </Link>
          </div>
        </section>
      )}

      {activatedNonBase.length === 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-600" /> What do you want to do on Vestra?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pick a role to unlock a dedicated dashboard. You stay a Vestra member either way.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROLE_CATALOG.map((entry) => {
              const accent = roleAccentClasses(entry.accent);
              const Icon = entry.icon;
              return (
                <Card key={entry.role} hover className="flex flex-col">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${accent.bg}`}>
                    <Icon size={22} className={accent.text} />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{entry.label}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{entry.tagline}</p>
                  <ul className="mt-3 space-y-1.5 flex-1">
                    {entry.perks.slice(0, 3).map((perk) => (
                      <li key={perk} className="text-[11px] text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                        <CheckCircle2 size={11} className={`mt-0.5 shrink-0 ${accent.text}`} /> {perk}
                      </li>
                    ))}
                  </ul>
                  <Button size="sm" className={accent.solid + ' text-white mt-4 w-full'} onClick={() => setActivatingRole(entry)}>
                    Activate <ArrowRight size={12} />
                  </Button>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {isBaseMember && (
        <>
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Market snapshot</h2>
            <StatsGrid
              stats={[
                { title: 'Active Listings', value: properties.filter((p) => p.status === 'active').length, icon: Building, color: 'emerald', change: '+12 this month', changeDirection: 'up' },
                { title: 'Verified Properties', value: properties.filter((p) => p.isVerified).length, icon: Shield, color: 'amber', change: '98% rate', changeDirection: 'up' },
                { title: 'Total Counties', value: 47, icon: TrendingUp, color: 'blue', change: 'All Kenya', changeDirection: 'up' },
                { title: 'Avg Trust Score', value: '8.6/10', icon: Sparkles, color: 'purple', change: 'High trust', changeDirection: 'up' },
              ]}
            />
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Quick actions</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Browse Market', icon: Search, to: '/market' },
                { label: 'Verify Property', icon: Shield, to: '/verify' },
                { label: 'Messages', icon: MessageSquare, to: '/messages' },
                { label: 'Saved', icon: Heart, to: '/settings' },
              ].map((q) => (
                <Link key={q.label} to={q.to}>
                  <Card hover className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
                      <q.icon size={18} />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{q.label}</span>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {featured.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Featured properties</h2>
            <Link to="/market" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
              View all →
            </Link>
          </div>
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
        </section>
      )}

      {available.length > 0 && activatedNonBase.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-600" /> Add another role
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {available.slice(0, 3).map((entry) => {
              const accent = roleAccentClasses(entry.accent);
              const Icon = entry.icon;
              return (
                <Card key={entry.role}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent.bg}`}>
                      <Icon size={18} className={accent.text} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{entry.label}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{entry.tagline}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => setActivatingRole(entry)}>
                    Activate <ArrowRight size={12} />
                  </Button>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      <RoleActivationModal entry={activatingRole} open={!!activatingRole} onClose={() => setActivatingRole(null)} />
    </div>
  );
}
