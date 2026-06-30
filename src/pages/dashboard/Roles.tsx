import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Sparkles, Layers, Shield, AlertCircle, Home, Info } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';
import { ROLE_CATALOG, roleAccentClasses, type RoleCatalogEntry } from '../../lib/roleCatalog';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import RoleActivationModal from '../../components/role/RoleActivationModal';

export default function Roles() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const switchRole = useAuthStore((s) => s.switchRole);
  const removeRole = useAuthStore((s) => s.removeRole);
  const [selected, setSelected] = useState<RoleCatalogEntry | null>(null);

  if (!user) return null;

  const hasRole = (role: string) => user.roles.includes(role as never);
  const activated = ROLE_CATALOG.filter((e) => hasRole(e.role));
  const available = ROLE_CATALOG.filter((e) => !hasRole(e.role));

  const handleSwitch = (entry: RoleCatalogEntry) => {
    switchRole(entry.role);
    toast.success(`Switched to ${entry.label} mode`);
    navigate(entry.dashboardPath);
  };
  const handleRemove = (entry: RoleCatalogEntry) => {
    if (!confirm(`Remove your ${entry.label} role? You can re-activate anytime.`)) return;
    removeRole(entry.role);
    toast.info(`${entry.label} role removed`);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 sm:p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-100 text-xs font-semibold uppercase tracking-wider">
            <Layers size={14} /> Your Vestra Roles
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">One account. Every side of property.</h1>
          <p className="text-sm sm:text-base text-emerald-50/90">
            Activate the role you need — landlord, agent, tenant, seller. Each opens its own dashboard. Switch between them anytime.
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs text-emerald-100">
            <Shield size={12} /> Member account always active · {user.roles.length} role{user.roles.length === 1 ? '' : 's'} on
          </div>
        </div>
      </div>

      {activated.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" /> Activated
            </h2>
            <span className="text-xs text-gray-500">{activated.length} active</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {activated.map((entry) => {
              const accent = roleAccentClasses(entry.accent);
              const Icon = entry.icon;
              const isCurrent = user.activeRole === entry.role;
              return (
                <Card key={entry.role} className={`relative ${isCurrent ? 'ring-2 ' + accent.ring : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent.bg}`}>
                      <Icon size={20} className={accent.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 dark:text-white">{entry.label}</h3>
                        {isCurrent && (
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${accent.bg} ${accent.text}`}>Active</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{entry.tagline}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    {!isCurrent ? (
                      <Button size="sm" className={accent.solid + ' text-white'} onClick={() => handleSwitch(entry)}>
                        Switch to {entry.label} <ArrowRight size={12} />
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => navigate(entry.dashboardPath)}>
                        Open dashboard <ArrowRight size={12} />
                      </Button>
                    )}
                    <button onClick={() => handleRemove(entry)} className="ml-auto text-xs text-gray-400 hover:text-red-500 transition-colors">
                      Remove
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-600" /> Add a new role
          </h2>
          {available.length === 0 && <span className="text-xs text-gray-500">All roles activated</span>}
        </div>

        {available.length === 0 ? (
          <Card className="text-center py-8">
            <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">You're already running on every role Vestra offers. Nice.</p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {available.map((entry) => {
              const accent = roleAccentClasses(entry.accent);
              const Icon = entry.icon;
              return (
                <Card key={entry.role} hover className="flex flex-col">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accent.bg}`}>
                      <Icon size={22} className={accent.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white">{entry.label}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{entry.tagline}</p>
                    </div>
                    {entry.requiresReview && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 flex items-center gap-1">
                        <AlertCircle size={10} /> Review
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">{entry.description}</p>
                  <ul className="mt-3 space-y-1.5">
                    {entry.perks.slice(0, 3).map((perk) => (
                      <li key={perk} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                        <CheckCircle2 size={12} className={`mt-0.5 shrink-0 ${accent.text}`} />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Free to activate</span>
                    <Button size="sm" className={accent.solid + ' text-white'} onClick={() => setSelected(entry)}>
                      Activate <ArrowRight size={12} />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* System-assigned roles explainer */}
      {!user.roles.includes('tenant') && (
        <section>
          <div className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
              <Home size={18} />
            </div>
            <div className="flex-1 text-sm">
              <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                Tenant role <Info size={12} className="text-gray-400" />
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                The Tenant role is assigned automatically when a landlord adds you to a unit on Vestra. You don&apos;t need to activate it — just ask your landlord to invite you, and your tenant dashboard appears here.
              </p>
            </div>
          </div>
        </section>
      )}

      <RoleActivationModal entry={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
