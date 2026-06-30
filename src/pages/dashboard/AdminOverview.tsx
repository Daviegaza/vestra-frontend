import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DollarSign, Users, Building, Layers, ShieldCheck, Wallet, TrendingUp, TrendingDown,
  Clock, AlertTriangle, CheckCircle2, XCircle, Loader2, Crown, ArrowRight,
} from 'lucide-react';
import Card, { Badge } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { apiRequest } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';
import { approveExtension, declineExtension, getIncomingExtensions, type PaymentExtension } from '../../services/extensions';

interface AdminOverview {
  counts: {
    users: number; properties: number; units: number; activeLeases: number;
    activeSubscriptions: number; pendingExtensions: number; pendingInvites: number; pendingVerifications: number;
  };
  revenue: {
    mrr: number; mrrPrevMonth: number; mrrGrowthPct: number;
    escrowFeesMtd: number; escrowVolumeAllTime: number; rentProcessedMtd: number; totalMtd: number;
  };
  tierBreakdown: { role: string; tier: string; count: number; revenue: number }[];
}

interface RecentActivity {
  recentSubs: { id: string; tier: string; role: string; priceKes: number | string; updatedAt: string; user?: { fullName: string; email: string } }[];
  recentEscrows: { id: string; propertyTitle: string; amount: number | string; status: string; createdAt: string }[];
  recentInvites: { id: string; status: string; createdAt: string; unit?: { title: string }; landlord?: { fullName: string } }[];
  recentExtensions: { id: string; kind: string; amount: number | string; status: string; createdAt: string; requester?: { fullName: string } }[];
}

function fmtKES(v: number | string) {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return `KES ${Math.round(n).toLocaleString()}`;
}

export default function AdminOverview() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<AdminOverview | null>(null);
  const [activity, setActivity] = useState<RecentActivity | null>(null);
  const [extensions, setExtensions] = useState<PaymentExtension[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const [o, a, e] = await Promise.all([
        apiRequest<AdminOverview>('/api/admin/overview'),
        apiRequest<RecentActivity>('/api/admin/recent-activity'),
        getIncomingExtensions().catch(() => []),
      ]);
      setData(o);
      setActivity(a);
      setExtensions(e);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load admin data');
    } finally { setLoading(false); }
  };

  useEffect(() => { void refresh(); }, []);

  if (user?.activeRole !== 'admin') {
    return (
      <Card className="text-center py-12">
        <ShieldCheck size={32} className="mx-auto text-gray-400 mb-2" />
        <p className="font-semibold text-gray-700 dark:text-gray-300">Admin access required</p>
        <p className="text-sm text-gray-500 mt-1">Switch to your Admin role to see this dashboard.</p>
      </Card>
    );
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-emerald-600" /></div>;
  }
  if (!data) return null;

  const growthPositive = data.revenue.mrrGrowthPct >= 0;

  const handleDecision = async (ext: PaymentExtension, kind: 'approve' | 'decline') => {
    const note = prompt(`Optional note for ${ext.requester?.fullName || 'requester'}:`) || undefined;
    try {
      if (kind === 'approve') await approveExtension(ext.id, note);
      else await declineExtension(ext.id, note);
      toast.success(`Extension ${kind}d`);
      setExtensions((prev) => prev.filter((e) => e.id !== ext.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-6 sm:p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck size={14} /> Vestra Admin Control Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Platform overview</h1>
            <p className="text-sm text-slate-300">Live revenue, growth, and the queue of things waiting on you.</p>
          </div>
          <button onClick={() => navigate('/dashboard/admin/subscriptions')} className="text-right cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-lg p-2 -m-2 hover:bg-white/5 transition-colors">
            <p className="text-xs uppercase tracking-wider text-slate-400">This month earnings · tap for detail</p>
            <p className="text-3xl font-black text-emerald-300">{fmtKES(data.revenue.totalMtd)}</p>
            <p className={`text-xs flex items-center justify-end gap-1 mt-1 ${growthPositive ? 'text-emerald-300' : 'text-rose-300'}`}>
              {growthPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {data.revenue.mrrGrowthPct}% vs last month
            </p>
          </button>
        </div>
      </div>

      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Revenue · click any card to drill in</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card hover onClick={() => navigate('/dashboard/admin/subscriptions')}>
            <div className="flex items-center gap-2 text-xs text-gray-500"><Crown size={14} className="text-emerald-600" /> Subscription MRR</div>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{fmtKES(data.revenue.mrr)}</p>
            <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">View subscribers <ArrowRight size={10} /></p>
          </Card>
          <Card hover onClick={() => navigate('/dashboard/escrow')}>
            <div className="flex items-center gap-2 text-xs text-gray-500"><Wallet size={14} className="text-emerald-600" /> Escrow take (MTD)</div>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{fmtKES(data.revenue.escrowFeesMtd)}</p>
            <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">View escrow ledger <ArrowRight size={10} /></p>
          </Card>
          <Card hover onClick={() => navigate('/dashboard/admin/rent')}>
            <div className="flex items-center gap-2 text-xs text-gray-500"><Building size={14} className="text-emerald-600" /> Rent volume (MTD)</div>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{fmtKES(data.revenue.rentProcessedMtd)}</p>
            <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">View receipts <ArrowRight size={10} /></p>
          </Card>
          <Card hover onClick={() => navigate('/dashboard/escrow')}>
            <div className="flex items-center gap-2 text-xs text-gray-500"><DollarSign size={14} className="text-emerald-600" /> Escrow lifetime</div>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{fmtKES(data.revenue.escrowVolumeAllTime)}</p>
            <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">View all transactions <ArrowRight size={10} /></p>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Platform health · click to manage</h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          <Card hover onClick={() => navigate('/dashboard/admin/users')}><div className="flex items-center gap-2 text-xs text-gray-500"><Users size={14} /> Users</div><p className="text-xl font-bold mt-1">{data.counts.users}</p><p className="text-[10px] text-emerald-600 flex items-center gap-1">Manage <ArrowRight size={9} /></p></Card>
          <Card hover onClick={() => navigate('/dashboard/admin/properties')}><div className="flex items-center gap-2 text-xs text-gray-500"><Building size={14} /> Listings</div><p className="text-xl font-bold mt-1">{data.counts.properties}</p><p className="text-[10px] text-emerald-600 flex items-center gap-1">Browse <ArrowRight size={9} /></p></Card>
          <Card hover onClick={() => navigate('/dashboard/admin/subscriptions')}><div className="flex items-center gap-2 text-xs text-gray-500"><Layers size={14} /> Active subs</div><p className="text-xl font-bold mt-1">{data.counts.activeSubscriptions}</p><p className="text-[10px] text-emerald-600 flex items-center gap-1">View list <ArrowRight size={9} /></p></Card>
          <Card hover onClick={() => navigate('/dashboard/admin/leases')}><div className="flex items-center gap-2 text-xs text-gray-500"><CheckCircle2 size={14} /> Active leases</div><p className="text-xl font-bold mt-1">{data.counts.activeLeases}</p><p className="text-[10px] text-emerald-600 flex items-center gap-1">View leases <ArrowRight size={9} /></p></Card>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Needs your attention · click to handle</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card hover onClick={() => navigate('/dashboard/admin/extensions')} className={data.counts.pendingExtensions ? 'ring-2 ring-amber-400' : ''}>
            <div className="flex items-center gap-2 text-xs text-amber-600"><Clock size={14} /> Pending extensions</div>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{data.counts.pendingExtensions}</p>
            <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">Review & approve <ArrowRight size={9} /></p>
          </Card>
          <Card hover onClick={() => navigate('/dashboard/admin/invites')} className={data.counts.pendingInvites ? 'ring-2 ring-blue-400' : ''}>
            <div className="flex items-center gap-2 text-xs text-blue-600"><AlertTriangle size={14} /> Tenant invites pending</div>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{data.counts.pendingInvites}</p>
            <p className="text-[11px] text-blue-600 mt-1 flex items-center gap-1">View invites <ArrowRight size={9} /></p>
          </Card>
          <Card hover onClick={() => navigate('/dashboard/admin/verifications')} className={data.counts.pendingVerifications ? 'ring-2 ring-rose-400' : ''}>
            <div className="flex items-center gap-2 text-xs text-rose-600"><ShieldCheck size={14} /> Verifications pending</div>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{data.counts.pendingVerifications}</p>
            <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">Open queue <ArrowRight size={9} /></p>
          </Card>
        </div>
      </section>

      {data.tierBreakdown.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Subscriptions by tier</h2>
          <Card>
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100 dark:border-gray-800">
                <tr><th className="text-left py-2">Role</th><th className="text-left py-2">Tier</th><th className="text-right py-2">Subscribers</th><th className="text-right py-2">Monthly revenue</th></tr>
              </thead>
              <tbody>
                {data.tierBreakdown.map((t) => (
                  <tr key={`${t.role}-${t.tier}`} onClick={() => navigate(`/dashboard/admin/subscriptions?role=${t.role}&tier=${t.tier}`)} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-900/10 cursor-pointer transition-colors">
                    <td className="py-2 capitalize">{t.role}</td>
                    <td className="py-2"><Badge variant="emerald" dot>{t.tier}</Badge></td>
                    <td className="py-2 text-right font-mono">{t.count}</td>
                    <td className="py-2 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400 flex items-center justify-end gap-1">{fmtKES(t.revenue * t.count)} <ArrowRight size={10} className="text-gray-400" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>
      )}

      {extensions.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Time-to-pay requests waiting on you</h2>
          <div className="space-y-2">
            {extensions.map((ext) => (
              <Card key={ext.id}>
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center shrink-0"><Clock size={16} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white">{ext.requester?.fullName || 'Requester'} · {fmtKES(ext.amount)} {ext.kind}</p>
                    <p className="text-xs text-gray-500">Original due {new Date(ext.originalDue).toLocaleDateString()} → requesting {new Date(ext.requestedDue).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{ext.reason}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => handleDecision(ext, 'decline')}>
                      <XCircle size={12} /> Decline
                    </Button>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleDecision(ext, 'approve')}>
                      <CheckCircle2 size={12} /> Approve
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {activity && (
        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Recent activity</h2>
          <div className="grid gap-3 lg:grid-cols-2">
            <Card>
              <h3 className="font-bold text-sm mb-2 flex items-center gap-1.5"><Crown size={14} className="text-emerald-600" /> Latest subscriptions</h3>
              {activity.recentSubs.length === 0 ? <p className="text-xs text-gray-400">None yet</p> : (
                <ul className="space-y-1 text-sm">
                  {activity.recentSubs.slice(0, 5).map((s) => (
                    <li key={s.id}>
                      <button onClick={() => navigate('/dashboard/admin/subscriptions')} className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors text-left">
                        <span className="truncate">{s.user?.fullName || '—'} · <span className="text-gray-500">{s.role}/{s.tier}</span></span>
                        <span className="font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1">{fmtKES(s.priceKes)} <ArrowRight size={10} /></span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card>
              <h3 className="font-bold text-sm mb-2 flex items-center gap-1.5"><Wallet size={14} className="text-emerald-600" /> Latest escrows</h3>
              {activity.recentEscrows.length === 0 ? <p className="text-xs text-gray-400">None yet</p> : (
                <ul className="space-y-1 text-sm">
                  {activity.recentEscrows.slice(0, 5).map((e) => (
                    <li key={e.id}>
                      <button onClick={() => navigate('/dashboard/escrow')} className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors text-left">
                        <span className="truncate">{e.propertyTitle}</span>
                        <span className="font-mono text-gray-700 dark:text-gray-300 flex items-center gap-1">{fmtKES(e.amount)} · <span className="capitalize text-xs text-gray-500">{e.status}</span> <ArrowRight size={10} /></span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </section>
      )}

      <div className="text-center">
        <Link to="/dashboard/admin/users">
          <Button variant="outline">Manage users <ArrowRight size={14} /></Button>
        </Link>
      </div>
    </div>
  );
}
