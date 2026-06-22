import { useState } from 'react';
import { Wrench, Clock, AlertTriangle, CheckCircle, User, Home, Phone, PlusCircle, Search, Calendar, DollarSign } from 'lucide-react';
import DashboardShell from '../../components/layout/DashboardShell';
import StatCard from '../../components/dashboard/StatCard';
import Card, { Badge } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { toast } from '../../store/toastStore';
import { useRentalStore } from '../../store/rentalStore';

type Priority = 'emergency' | 'high' | 'medium' | 'low';
type Status = 'reported' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

const priorityConfig: Record<Priority, { label: string; color: string; icon: typeof Clock; sla: string }> = {
  emergency: { label: 'Emergency', color: 'text-red-400 bg-red-900/20', icon: AlertTriangle, sla: '2 hours' },
  high: { label: 'High', color: 'text-orange-400 bg-orange-900/20', icon: AlertTriangle, sla: '24 hours' },
  medium: { label: 'Medium', color: 'text-amber-400 bg-amber-900/20', icon: Clock, sla: '3 days' },
  low: { label: 'Low', color: 'text-blue-400 bg-blue-900/20', icon: Clock, sla: '7 days' },
};

const statusConfig: Record<Status, { label: string; color: string }> = {
  reported: { label: 'Reported', color: 'warning' },
  assigned: { label: 'Assigned', color: 'info' },
  in_progress: { label: 'In Progress', color: 'info' },
  completed: { label: 'Completed', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'default' },
};

const vendors = [
  { id: 'v-1', name: 'Juma Plumbers Ltd', specialty: 'Plumbing', phone: '+254711111222', rating: 4.5 },
  { id: 'v-2', name: 'QuickFix Electricians', specialty: 'Electrical', phone: '+254722222333', rating: 4.7 },
  { id: 'v-3', name: 'CleanPro Services', specialty: 'General', phone: '+254733333444', rating: 4.2 },
  { id: 'v-4', name: 'RoofMasters Kenya', specialty: 'Roofing', phone: '+254744444555', rating: 4.8 },
  { id: 'v-5', name: 'SecureLock Systems', specialty: 'Security', phone: '+254755555666', rating: 4.4 },
];

export default function MaintenanceHub() {
  const { maintenance, units, submitMaintenance, assignMaintenance, completeMaintenance } = useRentalStore();
  const [showNew, setShowNew] = useState(false);
  const [showAssign, setShowAssign] = useState<string | null>(null);
  const [showCost, setShowCost] = useState<string | null>(null);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ unitId: '', title: '', description: '', priority: 'medium' as Priority });
  const [selectedVendor, setSelectedVendor] = useState('');
  const [costAmount, setCostAmount] = useState('');

  const filtered = maintenance.filter((m) => {
    if (filter !== 'all' && m.status !== filter) return false;
    if (search && !m.title.toLowerCase().includes(search.toLowerCase()) && !m.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const emergencyCount = maintenance.filter((m) => m.priority === 'emergency' && m.status !== 'completed' && m.status !== 'cancelled').length;
  const openCount = maintenance.filter((m) => m.status !== 'completed' && m.status !== 'cancelled').length;
  const completedCount = maintenance.filter((m) => m.status === 'completed').length;

  const handleSubmit = () => {
    if (!form.unitId || !form.title) { toast.error('Please fill unit and title.'); return; }
    const unit = units.find((u) => u.id === form.unitId);
    submitMaintenance({ ...form, unitTitle: unit?.title || '', tenantId: 'user-004', tenantName: 'Tenant' });
    setShowNew(false);
    setForm({ unitId: '', title: '', description: '', priority: 'medium' });
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Maintenance Hub</h1>
            <p className="text-gray-400 mt-1">Track, assign, and resolve all maintenance requests.</p>
          </div>
          <Button onClick={() => setShowNew(true)}><PlusCircle size={16} /> New Request</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <StatCard title="Open Requests" value={openCount} icon={Wrench} color="amber" />
          <StatCard title="Emergency" value={emergencyCount} icon={AlertTriangle} color="red" />
          <StatCard title="Completed" value={completedCount} icon={CheckCircle} color="emerald" />
          <StatCard title="Avg Response" value="4.2h" icon={Clock} color="blue" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search requests..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
          </div>
          <div className="flex gap-1">
            {(['all', 'reported', 'assigned', 'in_progress', 'completed'] as const).map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === s ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                {s === 'all' ? 'All' : s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Maintenance List */}
        <div className="space-y-3">
          {filtered.map((m) => {
            const pConfig = priorityConfig[m.priority as Priority] || priorityConfig.medium;
            const sConfig = statusConfig[m.status as Status] || statusConfig.reported;
            const PIcon = pConfig.icon;
            return (
              <Card key={m.id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Left: Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white">{m.title}</h3>
                      <Badge variant={sConfig.color as 'warning' | 'success' | 'info' | 'default'}>
                        {sConfig.label}
                      </Badge>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${pConfig.color}`}>
                        <PIcon size={10} /> {pConfig.label} · SLA: {pConfig.sla}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{m.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Home size={12} /> {m.unitTitle}</span>
                      <span className="flex items-center gap-1"><User size={12} /> {m.tenantName}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap gap-2 sm:flex-col items-start">
                    {m.status === 'reported' && (
                      <Button size="sm" onClick={() => setShowAssign(m.id)}>Assign Vendor</Button>
                    )}
                    {m.status === 'assigned' && (
                      <Button size="sm" onClick={() => assignMaintenance(m.id)}>Start Work</Button>
                    )}
                    {m.status === 'in_progress' && (
                      <>
                        <Button size="sm" onClick={() => setShowCost(m.id)}><DollarSign size={12} /> Add Cost</Button>
                        <Button size="sm" variant="outline" onClick={() => completeMaintenance(m.id)}><CheckCircle size={12} /> Complete</Button>
                      </>
                    )}
                    {m.status === 'completed' && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle size={12} /> Done</span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <Card className="p-12 text-center text-gray-400">
              <Wrench size={48} className="mx-auto mb-3 text-gray-600" />
              <p className="text-lg">No maintenance requests found.</p>
              <Button className="mt-4" onClick={() => setShowNew(true)}>Create First Request</Button>
            </Card>
          )}
        </div>
      </div>

      {/* New Request Modal */}
      <Modal open={showNew} onClose={() => setShowNew(false)} title="New Maintenance Request">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Unit *</label>
            <select value={form.unitId} onChange={(e) => setForm({ ...form, unitId: e.target.value })}
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-white">
              <option value="">Select unit...</option>
              {units.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}
            </select>
          </div>
          <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Leaking kitchen sink" />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
            <textarea rows={3} className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue in detail..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Priority</label>
            <div className="grid grid-cols-4 gap-2">
              {(['emergency', 'high', 'medium', 'low'] as Priority[]).map((p) => (
                <button key={p} type="button" onClick={() => setForm({ ...form, priority: p })}
                  className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${form.priority === p ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={() => setShowNew(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Submit Request</Button>
          </div>
        </form>
      </Modal>

      {/* Assign Vendor Modal */}
      <Modal open={!!showAssign} onClose={() => setShowAssign(null)} title="Assign Vendor">
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Select a vendor to handle this maintenance request.</p>
          <div className="space-y-2">
            {vendors.map((v) => (
              <button key={v.id} onClick={() => setSelectedVendor(v.id)}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${selectedVendor === v.id ? 'border-emerald-500 bg-emerald-900/20' : 'border-gray-700 bg-gray-800 hover:bg-gray-700'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{v.name}</p>
                    <p className="text-xs text-gray-400">{v.specialty} · ★ {v.rating}</p>
                  </div>
                  <a href={`tel:${v.phone}`} className="p-2 hover:bg-gray-600 rounded-lg"><Phone size={14} className="text-emerald-400" /></a>
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAssign(null)} className="flex-1">Cancel</Button>
            <Button onClick={() => { if (showAssign) { assignMaintenance(showAssign); setShowAssign(null); toast.success(`Assigned to ${vendors.find((v) => v.id === selectedVendor)?.name || 'vendor'}!`); } }} className="flex-1">Assign</Button>
          </div>
        </div>
      </Modal>

      {/* Add Cost Modal */}
      <Modal open={!!showCost} onClose={() => setShowCost(null)} title="Add Cost">
        <div className="space-y-4">
          <Input label="Cost (KES)" type="number" value={costAmount} onChange={(e) => setCostAmount(e.target.value)} placeholder="e.g., 5000" />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCost(null)} className="flex-1">Cancel</Button>
            <Button onClick={() => { toast.success(`Cost of KES ${Number(costAmount).toLocaleString()} recorded!`); setShowCost(null); setCostAmount(''); }} className="flex-1">Save Cost</Button>
          </div>
        </div>
      </Modal>
    </DashboardShell>
  );
}
