import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Check, X, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';
import Button from '../ui/Button';
import { acceptInvite, declineInvite, getMyInvites, type TenantInvite } from '../../services/invites';

function fmtKES(v: number | string) {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return `KES ${Math.round(n).toLocaleString()}`;
}

export default function InviteBanner() {
  const [invites, setInvites] = useState<TenantInvite[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;
    let alive = true;
    getMyInvites().then((list) => { if (alive) setInvites(list); }).catch(() => undefined);
    return () => { alive = false; };
  }, [isAuthenticated]);

  if (invites.length === 0) return null;

  const handleAccept = async (invite: TenantInvite) => {
    setBusyId(invite.id);
    try {
      const res = await acceptInvite(invite.id);
      useAuthStore.setState({ user: res.user, isAuthenticated: true });
      localStorage.setItem('vestra_user', JSON.stringify(res.user));
      toast.success('Welcome to your new home');
      setInvites((prev) => prev.filter((i) => i.id !== invite.id));
      navigate('/dashboard/tenant');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to accept');
    } finally {
      setBusyId(null);
    }
  };

  const handleDecline = async (invite: TenantInvite) => {
    if (!confirm('Decline this tenant invitation?')) return;
    setBusyId(invite.id);
    try {
      await declineInvite(invite.id);
      toast.info('Invitation declined');
      setInvites((prev) => prev.filter((i) => i.id !== invite.id));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to decline');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-3">
      {invites.map((invite) => (
        <div key={invite.id} className="rounded-2xl border-2 border-orange-300 dark:border-orange-700 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/10 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 flex items-center justify-center shrink-0">
              <Home size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400">Tenant invitation</p>
              <h3 className="font-bold text-gray-900 dark:text-white">{invite.unit?.title || 'A unit'}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {invite.landlord?.fullName || 'Your landlord'} invited you · {fmtKES(invite.rentAmount)}/month
                {invite.unit?.address ? ` · ${invite.unit.address}, ${invite.unit.city}` : ''}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Lease {new Date(invite.startDate).toLocaleDateString()} → {new Date(invite.endDate).toLocaleDateString()} · Deposit {fmtKES(invite.deposit)}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => handleDecline(invite)} disabled={busyId === invite.id}>
                <X size={14} /> Decline
              </Button>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => handleAccept(invite)} disabled={busyId === invite.id}>
                {busyId === invite.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                Accept & become tenant
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
