import { useEffect, useState } from 'react';
import {
  PiggyBank, Users, Target, ArrowRight, Plus, Loader2, Sparkles,
  CheckCircle2, Receipt, Crown,
} from 'lucide-react';
import Card, { Badge } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import PaymentMethodPicker from '../../components/payment/PaymentMethodPicker';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';
import {
  getMyChamas, createChama, contributeToChama,
  type Chama,
} from '../../services/chama';
import type { PaymentMethod } from '../../lib/paymentMethods';

function fmtKES(v: number | string) {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return `KES ${Math.round(n).toLocaleString()}`;
}

export default function ChamaDashboard() {
  const user = useAuthStore((s) => s.user);
  const [chamas, setChamas] = useState<Chama[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('');
  const [monthly, setMonthly] = useState('');
  const [creating, setCreating] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [payTarget, setPayTarget] = useState<Chama | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const list = await getMyChamas();
      setChamas(list);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load chamas');
    } finally { setLoading(false); }
  };

  useEffect(() => { void refresh(); }, []);

  const handleCreate = async () => {
    if (!name || !description || !target || !monthly) { toast.error('Fill every field'); return; }
    setCreating(true);
    try {
      await createChama({
        name,
        description,
        targetKes: Number(target),
        monthlyContribution: Number(monthly),
      });
      toast.success('Chama created. Invite members from the group page.');
      setName(''); setDescription(''); setTarget(''); setMonthly('');
      setCreateOpen(false);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not create chama');
    } finally { setCreating(false); }
  };

  const handleContribute = (chama: Chama) => {
    setPayTarget(chama);
    setPayOpen(true);
  };

  const handlePay = async (method: PaymentMethod, ref: string) => {
    if (!payTarget) return;
    const period = new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'long' });
    try {
      await contributeToChama(payTarget.id, {
        amount: Number(payTarget.monthlyContribution),
        period,
        paymentMethod: method,
        paymentRef: ref,
      });
      toast.success('Contribution recorded. Asante!');
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not record contribution');
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-800 p-6 sm:p-8 text-white">
        <div className="absolute inset-0 opacity-10"><div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl" /></div>
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-violet-200 text-xs font-semibold uppercase tracking-wider">
              <PiggyBank size={14} /> Vestra Investments
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Pool capital. Buy real estate together.</h1>
            <p className="text-sm text-violet-100/90">Run your chama with a transparent ledger, M-Pesa-anchored contributions, and shared property ownership.</p>
          </div>
          <Button className="bg-white text-violet-700 hover:bg-violet-50" size="lg" onClick={() => setCreateOpen(true)}>
            <Plus size={16} /> Start a chama
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-violet-600" /></div>
      ) : chamas.length === 0 ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 flex items-center justify-center mx-auto mb-3">
            <Sparkles size={28} />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">You aren't in any chamas yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">Chamas let groups of friends, family or colleagues co-buy property. Transparent ledger, M-Pesa contributions, shared ownership.</p>
          <Button className="mt-4 bg-violet-600 hover:bg-violet-700 text-white" onClick={() => setCreateOpen(true)}>
            <Plus size={14} /> Start your first chama
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chamas.map((c) => {
            const raised = Number(c.raisedKes || 0);
            const tgt = Number(c.targetKes);
            const progress = tgt ? Math.min(100, Math.round((raised / tgt) * 100)) : 0;
            return (
              <Card key={c.id} className="flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{c.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{c.description}</p>
                  </div>
                  <Badge variant={c.status === 'active' ? 'success' : 'warning'}>{c.status}</Badge>
                </div>

                <div className="mt-3 mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">{fmtKES(raised)} raised</span>
                    <span className="font-semibold text-violet-700 dark:text-violet-400">{progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>Target {fmtKES(tgt)}</span>
                    <span>KES {Number(c.monthlyContribution).toLocaleString()}/mo per member</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs text-gray-500 mt-1 mb-3">
                  <span className="flex items-center gap-1"><Users size={12} /> {c.members.length} members</span>
                  <span className="flex items-center gap-1"><Target size={12} /> {c.properties.length} {c.properties.length === 1 ? 'property' : 'properties'}</span>
                </div>

                {c.members.length > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    {c.members.slice(0, 4).map((m) => (
                      <div key={m.id} className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 flex items-center justify-center text-[10px] font-bold uppercase border-2 border-white dark:border-gray-900" title={`${m.user?.fullName} · ${m.role}`}>
                        {m.user?.fullName?.[0] || '?'}
                      </div>
                    ))}
                    {c.members.length > 4 && (
                      <span className="text-[10px] text-gray-500 ml-1">+{c.members.length - 4}</span>
                    )}
                  </div>
                )}

                <div className="mt-auto flex items-center gap-2">
                  <Button size="sm" className="flex-1 bg-violet-600 hover:bg-violet-700 text-white" onClick={() => handleContribute(c)}>
                    <Receipt size={12} /> Contribute
                  </Button>
                  <Button size="sm" variant="outline">
                    Details <ArrowRight size={12} />
                  </Button>
                </div>
                {c.members.find((m) => m.userId === user?.id)?.role === 'founder' && (
                  <p className="text-[10px] text-violet-600 dark:text-violet-400 mt-2 flex items-center gap-1"><Crown size={10} /> You founded this</p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Card className="bg-violet-50/40 dark:bg-violet-900/10 border-violet-200 dark:border-violet-900/40">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 flex items-center justify-center shrink-0"><CheckCircle2 size={18} /></div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">How Vestra chamas work</p>
            <p className="text-xs leading-relaxed">Founder creates the group + target. Members contribute via any payment method (M-Pesa, card, bank). Every contribution is logged with proof. When the pot hits the target, the group buys property — ownership recorded with proportional shares.</p>
          </div>
        </div>
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} size="md" variant="bottom" title="Start a chama">
        <div className="space-y-3 pb-2">
          <Input label="Chama name" placeholder="Karen Land Pool" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="w-full space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="What is the group saving for?"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Target (KES)" type="number" placeholder="5000000" value={target} onChange={(e) => setTarget(e.target.value)} />
            <Input label="Monthly per member (KES)" type="number" placeholder="20000" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white" onClick={handleCreate} disabled={creating}>
              {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Create chama
            </Button>
          </div>
        </div>
      </Modal>

      <PaymentMethodPicker
        open={payOpen}
        onClose={() => { setPayOpen(false); setPayTarget(null); }}
        amount={Number(payTarget?.monthlyContribution || 0)}
        context={payTarget ? `Contribution to ${payTarget.name}` : ''}
        onPay={handlePay}
      />
    </div>
  );
}
