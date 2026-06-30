import { useEffect, useState } from 'react';
import { Check, Loader2, Crown, Sparkles, X, BadgeCheck } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';
import {
  getCatalog,
  getMySubscriptions,
  subscribe,
  cancelSubscription,
  type TierEntry,
  type Subscription,
  type SubscriptionTier,
} from '../../services/subscriptions';
import type { UserRole } from '../../types';
import PaymentMethodPicker from '../../components/payment/PaymentMethodPicker';
import type { PaymentMethod } from '../../lib/paymentMethods';

const ROLES_WITH_TIERS: { role: UserRole; label: string }[] = [
  { role: 'agent', label: 'Agent' },
  { role: 'landlord', label: 'Landlord' },
  { role: 'buyer', label: 'Buyer (Member)' },
];

export default function SubscriptionPage() {
  const user = useAuthStore((s) => s.user);
  const [catalog, setCatalog] = useState<TierEntry[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [selectedRole, setSelectedRole] = useState<UserRole>('agent');
  const [busy, setBusy] = useState<SubscriptionTier | null>(null);
  const [loading, setLoading] = useState(true);
  const [payOpen, setPayOpen] = useState(false);
  const [pendingTier, setPendingTier] = useState<TierEntry | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const [c, s] = await Promise.all([getCatalog(), getMySubscriptions().catch(() => [])]);
      setCatalog(c);
      setSubs(s);
    } finally { setLoading(false); }
  };

  useEffect(() => { void refresh(); }, []);

  useEffect(() => {
    if (user?.activeRole && ['agent', 'landlord', 'buyer'].includes(user.activeRole)) {
      setSelectedRole(user.activeRole);
    }
  }, [user?.activeRole]);

  const tiersForRole = catalog.filter((t) => t.role === selectedRole);
  const currentSubForRole = subs.find((s) => s.role === selectedRole && s.status === 'active');
  const currentTier = currentSubForRole?.tier || 'free';

  const handleSubscribe = async (entry: TierEntry) => {
    if (entry.tier === currentTier) return;
    if (entry.priceKes === 0) {
      // Downgrade — no payment required.
      setBusy(entry.tier);
      try {
        await subscribe(entry.role, entry.tier, {});
        toast.success(`${entry.label} plan active.`);
        await refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Subscription failed');
      } finally { setBusy(null); }
      return;
    }
    setPendingTier(entry);
    setPayOpen(true);
  };

  const handlePay = async (method: PaymentMethod, ref: string) => {
    if (!pendingTier) return;
    setBusy(pendingTier.tier);
    try {
      await subscribe(pendingTier.role, pendingTier.tier, { paymentMethod: method, paymentRef: ref });
      toast.success(`${pendingTier.label} plan active.`);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Subscription failed');
    } finally {
      setBusy(null);
      setPendingTier(null);
    }
  };

  const handleCancel = async (role: UserRole) => {
    if (!confirm('Cancel this subscription? You keep access until the period ends.')) return;
    try {
      await cancelSubscription(role);
      toast.info('Subscription cancelled');
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Cancel failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 sm:p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-emerald-100 text-xs font-semibold uppercase tracking-wider">
            <Crown size={14} /> Vestra Plans
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Pick the plan that grows with you.</h1>
          <p className="text-sm text-emerald-50/90">Start free. Upgrade when your portfolio needs it. M-Pesa-billed in KES, cancel anytime.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {ROLES_WITH_TIERS.map((r) => {
          const sub = subs.find((s) => s.role === r.role && s.status === 'active');
          return (
            <button
              key={r.role}
              onClick={() => setSelectedRole(r.role)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedRole === r.role
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {r.label}
              {sub && <span className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded uppercase">{sub.tier}</span>}
            </button>
          );
        })}
      </div>

      {currentSubForRole && (
        <Card className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <BadgeCheck size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white capitalize">{currentSubForRole.tier} plan — {selectedRole}</p>
                <p className="text-xs text-gray-500">Renews {new Date(currentSubForRole.expiresAt).toLocaleDateString()} · KES {Number(currentSubForRole.priceKes).toLocaleString()}/{currentSubForRole.periodDays}d · {currentSubForRole.autoRenew ? 'Auto-renew on' : 'Will not renew'}</p>
              </div>
            </div>
            {currentSubForRole.tier !== 'free' && (
              <Button size="sm" variant="outline" onClick={() => handleCancel(selectedRole)}>
                <X size={14} /> Cancel
              </Button>
            )}
          </div>
        </Card>
      )}

      {loading ? (
        <p className="text-center text-sm text-gray-400">Loading plans…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiersForRole.map((entry) => {
            const isCurrent = entry.tier === currentTier;
            const isPopular = entry.tier === 'pro' || entry.tier === 'buyer_pro';
            return (
              <Card key={entry.tier} className={`relative flex flex-col ${isCurrent ? 'ring-2 ring-emerald-500' : ''} ${isPopular ? 'border-2 border-emerald-400' : ''}`}>
                {isPopular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                    <Sparkles size={10} /> Most popular
                  </span>
                )}
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{entry.label}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 min-h-[2em]">{entry.description}</p>
                <div className="mt-3 mb-3">
                  <span className="text-3xl font-black text-gray-900 dark:text-white">
                    {entry.priceKes === 0 ? 'Free' : `KES ${entry.priceKes.toLocaleString()}`}
                  </span>
                  {entry.priceKes > 0 && entry.tier !== 'buyer_verified' && (
                    <span className="text-xs text-gray-500"> /month</span>
                  )}
                  {entry.tier === 'buyer_verified' && (
                    <span className="text-xs text-gray-500"> one-off</span>
                  )}
                </div>
                <ul className="space-y-1.5 flex-1 mb-4">
                  {entry.perks.map((perk) => (
                    <li key={perk} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                      <Check size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Button
                  size="sm"
                  className={isCurrent ? 'w-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 cursor-default' : 'w-full bg-emerald-600 hover:bg-emerald-700 text-white'}
                  disabled={isCurrent || busy === entry.tier}
                  onClick={() => handleSubscribe(entry)}
                >
                  {busy === entry.tier ? <Loader2 size={14} className="animate-spin" />
                    : isCurrent ? 'Current plan'
                    : entry.priceKes === 0 ? 'Downgrade to free'
                    : `Subscribe — KES ${entry.priceKes.toLocaleString()}`}
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        Pay with M-Pesa, Airtel Money, Card, Bank Transfer, PesaLink, Equitel, PayPal, Flutterwave, IntaSend or Cash. Sandbox mode active until provider keys are connected.
      </p>

      <PaymentMethodPicker
        open={payOpen}
        onClose={() => { setPayOpen(false); setPendingTier(null); }}
        amount={pendingTier?.priceKes || 0}
        context={pendingTier ? `${pendingTier.label} plan — ${pendingTier.role}` : ''}
        onPay={handlePay}
      />
    </div>
  );
}
