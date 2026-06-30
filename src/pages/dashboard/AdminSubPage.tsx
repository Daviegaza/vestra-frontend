import { useEffect, useState } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Crown, Clock, UserPlus, Receipt, FileText, Loader2,
  CheckCircle2, XCircle, ChevronRight, Search,
} from 'lucide-react';
import Card, { Badge } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { apiRequest } from '../../services/api';
import { toast } from '../../store/toastStore';
import { useAuthStore } from '../../store/authStore';
import { approveExtension, declineExtension, type PaymentExtension } from '../../services/extensions';

type View = 'subscriptions' | 'extensions' | 'invites' | 'rent' | 'leases';

const VIEW_META: Record<View, { title: string; subtitle: string; icon: typeof Crown }> = {
  subscriptions: { title: 'Subscriptions', subtitle: 'Every paying customer + tier breakdown', icon: Crown },
  extensions: { title: 'Time-to-pay requests', subtitle: 'Tenants asking for more time on rent', icon: Clock },
  invites: { title: 'Tenant invitations', subtitle: 'All landlord → tenant invites across the platform', icon: UserPlus },
  rent: { title: 'Rent receipts', subtitle: 'Every rent payment routed through Vestra', icon: Receipt },
  leases: { title: 'Active leases', subtitle: 'All leases on file', icon: FileText },
};

function fmtKES(v: number | string) {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return `KES ${Math.round(n).toLocaleString()}`;
}

interface SubscriptionRow {
  id: string; tier: string; role: string; status: string;
  priceKes: number | string; expiresAt: string; startedAt: string;
  paymentMethod?: string; paymentRef?: string | null;
  user?: { id: string; fullName: string; email: string };
}

interface InviteRow {
  id: string; status: string; createdAt: string;
  tenantEmail?: string; tenantPhone?: string;
  rentAmount: number | string;
  unit?: { id: string; title: string; city: string };
  landlord?: { id: string; fullName: string };
  tenantUser?: { id: string; fullName: string; email: string };
}

interface ReceiptRow {
  id: string; amount: number | string; period: string; paidAt: string; paymentMethod: string;
  mpesaRef?: string;
  tenant?: { fullName: string; email: string };
  unit?: { title: string };
}

interface LeaseRow {
  id: string; rentAmount: number | string; deposit: number | string;
  startDate: string; endDate: string; status: string;
  unit?: { title: string; city: string };
  landlord?: { fullName: string };
  tenant?: { fullName: string; email: string };
}

export default function AdminSubPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const view = (location.pathname.split('/').pop() || 'subscriptions') as View;
  const meta = VIEW_META[view] || VIEW_META.subscriptions;
  const Icon = meta.icon;
  const filterRole = searchParams.get('role');
  const filterTier = searchParams.get('tier');

  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [subs, setSubs] = useState<SubscriptionRow[]>([]);
  const [exts, setExts] = useState<PaymentExtension[]>([]);
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [receipts, setReceipts] = useState<ReceiptRow[]>([]);
  const [leases, setLeases] = useState<LeaseRow[]>([]);

  const refresh = async () => {
    setLoading(true);
    try {
      if (view === 'subscriptions') {
        const r = await apiRequest<{ subscriptions: SubscriptionRow[] }>('/api/admin/subscriptions');
        setSubs(r.subscriptions);
      } else if (view === 'extensions') {
        const r = await apiRequest<{ extensions: PaymentExtension[] }>('/api/admin/extensions');
        setExts(r.extensions);
      } else if (view === 'invites') {
        const r = await apiRequest<{ invites: InviteRow[] }>('/api/admin/invites');
        setInvites(r.invites);
      } else if (view === 'rent') {
        const r = await apiRequest<{ receipts: ReceiptRow[] }>('/api/admin/rent-receipts');
        setReceipts(r.receipts);
      } else if (view === 'leases') {
        const r = await apiRequest<{ leases: LeaseRow[] }>('/api/admin/leases');
        setLeases(r.leases);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load');
    } finally { setLoading(false); }
  };

  useEffect(() => { void refresh(); }, [view]);

  if (user?.activeRole !== 'admin') {
    return (
      <Card className="text-center py-12">
        <Icon size={32} className="mx-auto text-gray-400 mb-2" />
        <p className="font-semibold text-gray-700 dark:text-gray-300">Admin access required</p>
      </Card>
    );
  }

  const handleExtDecision = async (ext: PaymentExtension, kind: 'approve' | 'decline') => {
    const note = prompt(`Optional note for ${ext.requester?.fullName || 'requester'}:`) || undefined;
    try {
      if (kind === 'approve') await approveExtension(ext.id, note);
      else await declineExtension(ext.id, note);
      toast.success(`Extension ${kind}d`);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const q = query.toLowerCase();
  const filteredSubs = subs.filter((s) => {
    if (filterRole && s.role !== filterRole) return false;
    if (filterTier && s.tier !== filterTier) return false;
    if (!q) return true;
    return s.user?.fullName.toLowerCase().includes(q) || s.user?.email.toLowerCase().includes(q) || s.tier.includes(q);
  });
  const filteredExts = exts.filter((e) => !q || e.requester?.fullName.toLowerCase().includes(q) || e.reason.toLowerCase().includes(q));
  const filteredInvites = invites.filter((i) => !q || i.tenantEmail?.toLowerCase().includes(q) || i.unit?.title.toLowerCase().includes(q));
  const filteredReceipts = receipts.filter((r) => !q || r.tenant?.fullName.toLowerCase().includes(q) || r.unit?.title.toLowerCase().includes(q));
  const filteredLeases = leases.filter((l) => !q || l.tenant?.fullName.toLowerCase().includes(q) || l.unit?.title.toLowerCase().includes(q));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs">
        <Link to="/dashboard/admin" className="text-emerald-600 hover:underline flex items-center gap-1"><ArrowLeft size={12} /> Back to overview</Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
          <Icon size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">{meta.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{meta.subtitle}{filterRole && ` · Filtered: ${filterRole}/${filterTier}`}</p>
        </div>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-emerald-600" /></div>
      ) : (
        <>
          {view === 'subscriptions' && (
            <Card padding="none">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="text-left px-4 py-3">User</th>
                    <th className="text-left px-4 py-3">Role · Tier</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Method</th>
                    <th className="text-right px-4 py-3">Price</th>
                    <th className="text-right px-4 py-3">Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubs.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">No subscriptions match</td></tr> :
                    filteredSubs.map((s) => (
                      <tr key={s.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-3"><p className="font-medium">{s.user?.fullName}</p><p className="text-xs text-gray-500">{s.user?.email}</p></td>
                        <td className="px-4 py-3"><Badge variant="emerald" dot>{s.role} · {s.tier}</Badge></td>
                        <td className="px-4 py-3"><span className="text-xs capitalize">{s.status}</span></td>
                        <td className="px-4 py-3 text-xs text-gray-500 uppercase">{s.paymentMethod || 'mpesa'}</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400">{fmtKES(s.priceKes)}</td>
                        <td className="px-4 py-3 text-right text-xs text-gray-500">{new Date(s.expiresAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </Card>
          )}

          {view === 'extensions' && (
            <div className="space-y-2">
              {filteredExts.length === 0 ? <Card className="text-center py-8 text-gray-500 text-sm">No extension requests</Card> :
                filteredExts.map((ext) => (
                  <Card key={ext.id}>
                    <div className="flex items-start gap-3 flex-wrap">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center shrink-0"><Clock size={16} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">{ext.requester?.fullName} · {fmtKES(ext.amount)} {ext.kind}</p>
                        <p className="text-xs text-gray-500">Original due {new Date(ext.originalDue).toLocaleDateString()} → requested {new Date(ext.requestedDue).toLocaleDateString()}</p>
                        <p className="text-sm mt-1">{ext.reason}</p>
                        {ext.decisionNote && <p className="text-xs text-gray-500 mt-1 italic">Decision: {ext.decisionNote}</p>}
                      </div>
                      {ext.status === 'pending' ? (
                        <div className="flex items-center gap-2 shrink-0">
                          <Button size="sm" variant="outline" onClick={() => handleExtDecision(ext, 'decline')}><XCircle size={12} /> Decline</Button>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleExtDecision(ext, 'approve')}><CheckCircle2 size={12} /> Approve</Button>
                        </div>
                      ) : (
                        <Badge variant={ext.status === 'approved' ? 'success' : ext.status === 'declined' ? 'danger' : 'default'}>{ext.status}</Badge>
                      )}
                    </div>
                  </Card>
                ))}
            </div>
          )}

          {view === 'invites' && (
            <Card padding="none">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100 dark:border-gray-800">
                  <tr><th className="text-left px-4 py-3">Tenant</th><th className="text-left px-4 py-3">Unit</th><th className="text-left px-4 py-3">Landlord</th><th className="text-right px-4 py-3">Rent</th><th className="text-left px-4 py-3">Status</th><th className="text-right px-4 py-3">When</th></tr>
                </thead>
                <tbody>
                  {filteredInvites.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">No invitations yet</td></tr> :
                    filteredInvites.map((inv) => (
                      <tr key={inv.id} className="border-b border-gray-50 dark:border-gray-800/50">
                        <td className="px-4 py-3">{inv.tenantUser?.fullName || inv.tenantEmail || inv.tenantPhone}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{inv.unit?.title} · {inv.unit?.city}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{inv.landlord?.fullName}</td>
                        <td className="px-4 py-3 text-right font-mono">{fmtKES(inv.rentAmount)}</td>
                        <td className="px-4 py-3"><Badge variant={inv.status === 'accepted' ? 'success' : inv.status === 'declined' ? 'danger' : 'warning'}>{inv.status}</Badge></td>
                        <td className="px-4 py-3 text-right text-xs text-gray-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </Card>
          )}

          {view === 'rent' && (
            <Card padding="none">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100 dark:border-gray-800">
                  <tr><th className="text-left px-4 py-3">Tenant</th><th className="text-left px-4 py-3">Unit</th><th className="text-left px-4 py-3">Period</th><th className="text-left px-4 py-3">Method</th><th className="text-right px-4 py-3">Amount</th><th className="text-right px-4 py-3">Paid</th></tr>
                </thead>
                <tbody>
                  {filteredReceipts.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">No rent receipts yet</td></tr> :
                    filteredReceipts.map((r) => (
                      <tr key={r.id} className="border-b border-gray-50 dark:border-gray-800/50">
                        <td className="px-4 py-3">{r.tenant?.fullName}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{r.unit?.title}</td>
                        <td className="px-4 py-3 text-xs">{r.period}</td>
                        <td className="px-4 py-3 text-xs uppercase text-gray-500">{r.paymentMethod}</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400">{fmtKES(r.amount)}</td>
                        <td className="px-4 py-3 text-right text-xs text-gray-500">{new Date(r.paidAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </Card>
          )}

          {view === 'leases' && (
            <Card padding="none">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100 dark:border-gray-800">
                  <tr><th className="text-left px-4 py-3">Tenant</th><th className="text-left px-4 py-3">Unit</th><th className="text-left px-4 py-3">Landlord</th><th className="text-left px-4 py-3">Period</th><th className="text-right px-4 py-3">Rent</th><th className="text-left px-4 py-3">Status</th></tr>
                </thead>
                <tbody>
                  {filteredLeases.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">No leases yet</td></tr> :
                    filteredLeases.map((l) => (
                      <tr key={l.id} className="border-b border-gray-50 dark:border-gray-800/50">
                        <td className="px-4 py-3">{l.tenant?.fullName}<p className="text-[10px] text-gray-500">{l.tenant?.email}</p></td>
                        <td className="px-4 py-3 text-xs text-gray-500">{l.unit?.title} · {l.unit?.city}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{l.landlord?.fullName}</td>
                        <td className="px-4 py-3 text-xs">{new Date(l.startDate).toLocaleDateString()} → {new Date(l.endDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-right font-mono">{fmtKES(l.rentAmount)}</td>
                        <td className="px-4 py-3"><Badge variant={l.status === 'active' ? 'success' : l.status === 'expired' ? 'danger' : 'warning'}>{l.status}</Badge></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </Card>
          )}
        </>
      )}

      <div className="text-center">
        <Link to="/dashboard/admin">
          <Button variant="outline" size="sm"><ChevronRight size={12} className="rotate-180" /> Back to admin overview</Button>
        </Link>
      </div>
    </div>
  );
}
