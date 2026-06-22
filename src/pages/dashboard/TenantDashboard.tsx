import { useState } from 'react';
import { Home, CreditCard, Wrench, Calendar, Receipt, FileText } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import DashboardShell from '../../components/layout/DashboardShell';
import StatCard from '../../components/dashboard/StatCard';
import Card, { Badge } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import STKPushSimulator from '../../components/payment/STKPushSimulator';
import { useRentalStore } from '../../store/rentalStore';
import { formatCurrency } from '../../store/paymentStore';
import { toast } from '../../store/toastStore';
import type { MaintenanceRequest } from '../../types';

export default function TenantDashboard() {
  const location = useLocation();
  const section = location.pathname.split('/').pop() || 'tenant';
  const { receipts, maintenance, payRent, submitMaintenance, leases } = useRentalStore();
  const [showPay, setShowPay] = useState(false);
  const [showMaint, setShowMaint] = useState(false);

  // Tenant-specific data (in real app, filtered by user ID)
  const myReceipts = receipts.filter((r) => r.tenantId === 'tnt-002');
  const myMaintenance = maintenance.filter((m) => m.tenantId === 'tnt-002');
  const myLease = leases.find((l) => l.tenantId === 'tnt-002' && l.status === 'active');
  const openRequests = myMaintenance.filter(m => m.status !== 'completed' && m.status !== 'cancelled').length;

  // Calculate stats
  const paidYTD = myReceipts.reduce((s, r) => {
    const d = new Date(r.paidAt);
    if (d.getFullYear() === 2026) return s + r.amount;
    return s;
  }, 0);

  const handlePayRent = (receipt: string) => {
    payRent('unit-002', 'tnt-002', 45000, 'mpesa');
    setShowPay(false);
    toast.success(`Rent paid! Receipt: ${receipt}`);
  };

  const handleSubmitMaintenance = (title: string, description: string, priority: string) => {
    submitMaintenance({
      unitId: 'unit-002',
      unitTitle: '1BR Studio in Kileleshwa',
      tenantId: 'tnt-002',
      tenantName: 'James Otieno',
      title,
      description,
      priority: priority as MaintenanceRequest['priority'],
    });
  };

  return (
    <DashboardShell>
      {(section === 'tenant') && (
        <div className="space-y-8">
          <div><h1 className="text-2xl font-bold text-white">Tenant Dashboard</h1><p className="text-gray-400 mt-1">Manage your rental and payments.</p></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Monthly Rent" value="KES 45K" icon={Home} color="emerald" />
            <StatCard title="Next Due" value="Jul 1" icon={Calendar} color="blue" />
            <StatCard title="Paid YTD" value={formatCurrency(paidYTD)} icon={CreditCard} color="amber" />
            <StatCard title="Open Requests" value={openRequests} icon={Wrench} color="purple" />
          </div>

          {/* Lease Card */}
          {myLease && (
            <Card className="p-5 bg-gradient-to-r from-emerald-900/20 to-transparent border-emerald-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-900/30 rounded-lg"><FileText size={20} className="text-emerald-400" /></div>
                  <div>
                    <h2 className="font-semibold text-white">Active Lease</h2>
                    <p className="text-sm text-gray-400">{myLease.unitTitle}</p>
                    <p className="text-xs text-gray-500">{new Date(myLease.startDate).toLocaleDateString()} – {new Date(myLease.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            </Card>
          )}

          {/* Pay Rent CTA */}
          <div className="p-6 bg-emerald-900/10 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-900/30">
            <div><h2 className="font-semibold text-white">June Rent</h2><p className="text-sm text-gray-400">KES 45,000 &middot; Due Jul 1, 2026</p></div>
            <Button size="lg" onClick={() => setShowPay(true)}><CreditCard size={16} /> Pay Now via M-Pesa</Button>
          </div>

          {/* Recent Receipts */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Recent Receipts</h2>
            <Card><div className="divide-y divide-gray-700">
              {myReceipts.slice(0, 4).map((r) => (
                <div key={r.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-900/20 rounded-lg"><Receipt size={18} className="text-emerald-400" /></div>
                    <div>
                      <p className="font-medium text-white">{r.period}</p>
                      <p className="text-sm text-gray-400">{r.paymentMethod} · {r.mpesaRef || ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">KES {r.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{new Date(r.paidAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {myReceipts.length === 0 && <div className="p-6 text-center text-gray-400 text-sm">No receipts yet.</div>}
            </div></Card>
          </div>
        </div>
      )}

      {section === 'rent' && (
        <div className="space-y-6 max-w-lg">
          <div><h1 className="text-2xl font-bold text-white">Pay Rent</h1><p className="text-gray-400 mt-1">Secure M-Pesa STK Push payment for your rent.</p></div>
          <Card className="p-6">
            <STKPushSimulator amount={45000} description="June 2026 Rent — 1BR Studio Kileleshwa" accountRef="TNT002-UNIT002" onSuccess={handlePayRent} onCancel={() => setShowPay(false)} />
          </Card>
        </div>
      )}

      {section === 'receipts' && (
        <div className="space-y-6">
          <div><h1 className="text-2xl font-bold text-white">Rent Receipts</h1><p className="text-gray-400 mt-1">{myReceipts.length} receipts</p></div>
          <Card><div className="divide-y divide-gray-700">
            {myReceipts.map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-900/20 rounded-lg"><Receipt size={18} className="text-emerald-400" /></div>
                  <div>
                    <p className="font-medium text-white">{r.period}</p>
                    <p className="text-sm text-gray-400">{r.paymentMethod} {r.mpesaRef && `· ${r.mpesaRef}`}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">KES {r.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{new Date(r.paidAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div></Card>
        </div>
      )}

      {section === 'maintenance' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div><h1 className="text-2xl font-bold text-white">Maintenance Requests</h1><p className="text-gray-400 mt-1">{myMaintenance.length} requests</p></div>
            <Button onClick={() => setShowMaint(true)}><Wrench size={16} /> New Request</Button>
          </div>
          <div className="space-y-4">
            {myMaintenance.map((m) => (
              <Card key={m.id} className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{m.title}</h3>
                  <Badge variant={m.status === 'completed' ? 'success' : m.status === 'in_progress' ? 'info' : 'warning'}>{m.status.replace('_', ' ')}</Badge>
                </div>
                <p className="text-sm text-gray-400">{m.description}</p>
                <p className="text-xs text-gray-500">Unit: {m.unitTitle} &middot; Reported: {new Date(m.createdAt).toLocaleDateString()}</p>
              </Card>
            ))}
            {myMaintenance.length === 0 && (
              <Card className="p-8 text-center text-gray-400">
                <Wrench size={32} className="mx-auto mb-2 text-gray-600" />
                <p>No maintenance requests.</p>
              </Card>
            )}
          </div>

          <Modal open={showMaint} onClose={() => setShowMaint(false)} title="New Maintenance Request">
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const title = (form.elements.namedItem('title') as HTMLInputElement).value;
              const desc = (form.elements.namedItem('description') as HTMLTextAreaElement).value;
              const priority = (form.elements.namedItem('priority') as HTMLSelectElement).value;
              if (!title || !desc) { toast.error('Please fill all fields.'); return; }
              handleSubmitMaintenance(title, desc, priority);
              setShowMaint(false);
            }} className="space-y-4">
              <Input label="Title" name="title" placeholder="e.g., Leaking tap" />
              <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label><textarea name="description" rows={3} className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Priority</label><select name="priority" className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-white"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="emergency">Emergency</option></select></div>
              <Button type="submit" className="w-full">Submit Request</Button>
            </form>
          </Modal>
        </div>
      )}

      <Modal open={showPay} onClose={() => setShowPay(false)} title="Pay Rent via M-Pesa">
        <STKPushSimulator amount={45000} description="June 2026 Rent — 1BR Studio Kileleshwa" accountRef="TNT002-UNIT002" onSuccess={handlePayRent} onCancel={() => setShowPay(false)} />
      </Modal>
    </DashboardShell>
  );
}
