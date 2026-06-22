import { useState } from 'react';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Clock, Ban, RefreshCw, CreditCard } from 'lucide-react';
import DashboardShell from '../../components/layout/DashboardShell';
import StatCard from '../../components/dashboard/StatCard';
import Card, { Badge } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import STKPushSimulator from '../../components/payment/STKPushSimulator';
import { useEscrowStore } from '../../store/escrowStore';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';
import { properties } from '../../data/properties';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
const statusColors: Record<string, BadgeVariant> = {
  initiated: 'info', deposit_paid: 'warning', balance_paid: 'info', completed: 'success', cancelled: 'danger', refunded: 'danger', disputed: 'danger',
};

const statusIcons: Record<string, typeof Clock> = {
  initiated: Clock, deposit_paid: TrendingUp, balance_paid: TrendingUp, completed: CheckCircle, cancelled: Ban, refunded: RefreshCw, disputed: AlertTriangle,
};

export default function EscrowManagement() {
  const { user } = useAuthStore();
  const { escrows, createEscrow, updateStatus, disputeEscrow } = useEscrowStore();
  const [showCreate, setShowCreate] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [selectedEscrow, setSelectedEscrow] = useState('');
  const [showDispute, setShowDispute] = useState(false);
  const [createForm, setCreateForm] = useState({ propertyId: '', amount: '' });

  const myEscrows = escrows.filter((e) => e.buyerId === user?.id || e.sellerId === user?.id);
  const activeEscrows = myEscrows.filter((e) => !['completed', 'cancelled', 'refunded'].includes(e.status));
  const totalInEscrow = activeEscrows.reduce((s, e) => s + e.amount, 0);

  const handleCreateEscrow = () => {
    const prop = properties.find((p) => p.id === createForm.propertyId);
    if (!prop) { toast.error('Property not found.'); return; }
    if (!createForm.amount) { toast.error('Enter deposit amount.'); return; }
    createEscrow({
      propertyId: prop.id,
      propertyTitle: prop.title,
      buyerId: user?.id,
      sellerId: prop.ownerId,
      amount: Number(createForm.amount),
    });
    setShowCreate(false);
    setCreateForm({ propertyId: '', amount: '' });
  };

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Escrow Management</h1>
            <p className="text-gray-400 mt-1">Secure property transactions with automated escrow.</p>
          </div>
          <Button onClick={() => setShowCreate(true)}><Shield size={16} /> New Escrow</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Escrows" value={activeEscrows.length} icon={Shield} color="emerald" />
          <StatCard title="Total in Escrow" value={`KES ${(totalInEscrow / 1_000_000).toFixed(1)}M`} icon={TrendingUp} color="blue" />
          <StatCard title="Completed" value={myEscrows.filter((e) => e.status === 'completed').length} icon={CheckCircle} color="amber" />
          <StatCard title="Disputed" value={myEscrows.filter((e) => e.status === 'disputed').length} icon={AlertTriangle} color="red" />
        </div>

        {/* Escrow Flow Diagram */}
        <Card className="p-5">
          <h3 className="font-semibold text-white mb-4">How Escrow Works</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {['Initiate', 'Deposit Paid', 'Balance Paid', 'Completed'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300">
                  <span className="w-5 h-5 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400 font-bold text-[10px]">{i + 1}</span>
                  {step}
                </div>
                {i < 3 && <span className="text-gray-600">→</span>}
              </div>
            ))}
          </div>
        </Card>

        {/* Escrow List */}
        <div className="space-y-4">
          {myEscrows.length === 0 && (
            <Card className="p-12 text-center text-gray-400">
              <Shield size={48} className="mx-auto mb-3 text-gray-600" />
              <p className="text-lg">No escrow transactions yet.</p>
              <Button className="mt-4" onClick={() => setShowCreate(true)}>Create Your First Escrow</Button>
            </Card>
          )}

          {myEscrows.map((esc) => {
            const StatusIcon = statusIcons[esc.status] || Clock;
            const progress = esc.status === 'completed' ? 100 : esc.status === 'balance_paid' ? 75 : esc.status === 'deposit_paid' ? 50 : esc.status === 'initiated' ? 10 : 0;
            return (
              <Card key={esc.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${esc.status === 'completed' ? 'bg-emerald-900/20' : esc.status === 'disputed' ? 'bg-red-900/20' : 'bg-blue-900/20'}`}>
                      <StatusIcon size={20} className={esc.status === 'completed' ? 'text-emerald-400' : esc.status === 'disputed' ? 'text-red-400' : 'text-blue-400'} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{esc.propertyTitle}</h3>
                      <p className="text-sm text-gray-400">KES {esc.amount.toLocaleString()} &middot; {new Date(esc.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant={statusColors[esc.status]}>{esc.status.replace('_', ' ')}</Badge>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-500 ${esc.status === 'disputed' ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${progress}%` }} />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {esc.status === 'initiated' && (
                    <>
                      <Button size="sm" onClick={() => { setSelectedEscrow(esc.id); setShowPay(true); }}><CreditCard size={12} /> Pay Deposit</Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(esc.id, 'cancelled')}>Cancel</Button>
                    </>
                  )}
                  {esc.status === 'deposit_paid' && (
                    <>
                      <Button size="sm" onClick={() => updateStatus(esc.id, 'balance_paid')}>Pay Balance</Button>
                      <Button size="sm" variant="outline" onClick={() => { setSelectedEscrow(esc.id); setShowDispute(true); }}><AlertTriangle size={12} /> Dispute</Button>
                    </>
                  )}
                  {esc.status === 'balance_paid' && (
                    <Button size="sm" onClick={() => updateStatus(esc.id, 'completed')}><CheckCircle size={12} /> Release Funds</Button>
                  )}
                  {esc.status === 'disputed' && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(esc.id, 'deposit_paid')}><RefreshCw size={12} /> Resolve Dispute</Button>
                  )}
                  {esc.status === 'completed' && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle size={12} /> Transaction complete</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Create Escrow Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create New Escrow">
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Select a property and enter the deposit amount to begin the escrow process.</p>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Property</label>
            <select value={createForm.propertyId} onChange={(e) => setCreateForm({ ...createForm, propertyId: e.target.value })} className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-white">
              <option value="">Select property...</option>
              {properties.map((p) => <option key={p.id} value={p.id}>{p.title} — KES {p.price.toLocaleString()}</option>)}
            </select>
          </div>
          <Input label="Deposit Amount (KES)" type="number" value={createForm.amount} onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })} placeholder="10% of purchase price" />
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 text-xs text-blue-300">
            Your deposit will be held securely in escrow until all transaction conditions are met. Vestra's escrow fee is 0.5% of the transaction amount.
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCreate(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleCreateEscrow} className="flex-1"><Shield size={16} /> Create Escrow</Button>
          </div>
        </div>
      </Modal>

      {/* Pay Deposit Modal */}
      <Modal open={showPay} onClose={() => { setShowPay(false); setSelectedEscrow(''); }} title="Pay Escrow Deposit">
        {selectedEscrow && (() => {
          const esc = escrows.find((e) => e.id === selectedEscrow);
          if (!esc) return null;
          return (
            <STKPushSimulator
              amount={esc.amount}
              description={`Escrow Deposit — ${esc.propertyTitle}`}
              accountRef={`ESCROW-${esc.id}`}
              onSuccess={() => { setShowPay(false); updateStatus(esc.id, 'deposit_paid'); }}
              onCancel={() => setShowPay(false)}
            />
          );
        })()}
      </Modal>

      {/* Dispute Modal */}
      <Modal open={showDispute} onClose={() => { setShowDispute(false); setSelectedEscrow(''); }} title="Dispute Escrow">
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Please describe the reason for the dispute. Our team will investigate within 24 hours.</p>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Reason</label>
            <textarea rows={3} className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-white" placeholder="Describe the issue..."
              onChange={(e) => { const val = e.target.value; (window as any).__disputeReason = val; }} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowDispute(false)} className="flex-1">Cancel</Button>
            <Button variant="danger" onClick={() => { disputeEscrow(selectedEscrow, (window as any).__disputeReason || 'No reason provided'); setShowDispute(false); setSelectedEscrow(''); }} className="flex-1"><AlertTriangle size={16} /> File Dispute</Button>
          </div>
        </div>
      </Modal>
    </DashboardShell>
  );
}
