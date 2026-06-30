import { Home, Users, Wrench, CreditCard, PlusCircle, FileText, Receipt, Clock, TrendingUp, Phone } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

import BuildingUnitsView from '../../components/property/BuildingUnitsView';
import LandlordInvitesPanel from '../../components/role/LandlordInvitesPanel';
import StatCard from '../../components/dashboard/StatCard';
import Card, { Badge } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { toast } from '../../store/toastStore';
import { useRentalStore } from '../../store/rentalStore';
import { formatCurrency } from '../../store/paymentStore';

export default function LandlordDashboard() {
  const location = useLocation();
  const section = location.pathname.split('/').pop() || 'landlord';
  const { units, tenants, leases, maintenance, receipts, addUnit, addTenant, createLease, inviteTenant, assignMaintenance, completeMaintenance } = useRentalStore();

  const [showAddUnit, setShowAddUnit] = useState(false);
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showLease, setShowLease] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [_selectedUnit, setSelectedUnit] = useState('');
  const [unitForm, setUnitForm] = useState({ title: '', address: '', city: '', bedrooms: '', bathrooms: '', rentAmount: '' });
  const [tenantForm, setTenantForm] = useState({ name: '', email: '', phone: '', unitId: '' });
  const [leaseForm, setLeaseForm] = useState({ unitId: '', tenantId: '', tenantName: '', tenantEmail: '', tenantPhone: '', rentAmount: '', deposit: '', startDate: '', endDate: '', terms: '' });
  const [inviteForm, setInviteForm] = useState({ unitId: '', tenantName: '', tenantEmail: '', tenantPhone: '', rentAmount: '' });

  const occupied = units.filter((u) => u.status === 'occupied').length;
  const vacant = units.filter((u) => u.status === 'vacant').length;
  const monthlyIncome = units.reduce((s, u) => s + (u.status === 'occupied' ? u.rentAmount : 0), 0);
  const pendingMaintenance = maintenance.filter((m) => m.status !== 'completed' && m.status !== 'cancelled').length;
  const collectedThisMonth = receipts.filter((r) => {
    const d = new Date(r.paidAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((s, r) => s + r.amount, 0);

  return (
    <>
      {/* Overview */}
      {(section === 'landlord') && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div><h1 className="text-2xl font-bold text-white">Landlord Dashboard</h1><p className="text-gray-400 mt-1">Manage your rental portfolio.</p></div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setSelectedUnit(''); setShowInvite(true); }}><Phone size={16} /> Invite Tenant</Button>
              <Button onClick={() => setShowAddUnit(true)}><PlusCircle size={16} /> Add Unit</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <StatCard title="Total Units" value={units.length} icon={Home} color="emerald" />
            <StatCard title="Occupied" value={occupied} icon={Users} color="blue" />
            <StatCard title="Vacant" value={vacant} icon={Clock} color="amber" />
            <StatCard title="Maintenance" value={pendingMaintenance} icon={Wrench} color="red" />
            <StatCard title="Monthly Income" value={formatCurrency(monthlyIncome)} icon={CreditCard} color="purple" />
          </div>

          <LandlordInvitesPanel />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2"><Receipt size={16} className="text-emerald-400" /><span className="text-xs text-gray-400">Collected This Month</span></div>
              <p className="text-xl font-bold text-white">{formatCurrency(collectedThisMonth)}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2"><FileText size={16} className="text-blue-400" /><span className="text-xs text-gray-400">Active Leases</span></div>
              <p className="text-xl font-bold text-white">{leases.filter((l) => l.status === 'active').length}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2"><TrendingUp size={16} className="text-amber-400" /><span className="text-xs text-gray-400">Collection Rate</span></div>
              <p className="text-xl font-bold text-white">{monthlyIncome > 0 ? Math.round((collectedThisMonth / monthlyIncome) * 100) : 0}%</p>
            </Card>
          </div>

          {/* Units Grid */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">My Units</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {units.map((unit) => (
                <Card key={unit.id} className="overflow-hidden">
                  <img src={unit.image} alt={unit.title} className="w-full h-32 object-cover" />
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white text-sm truncate">{unit.title}</h3>
                      <Badge variant={unit.status === 'occupied' ? 'success' : unit.status === 'vacant' ? 'warning' : 'danger'}>{unit.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-400">{unit.address}</p>
                    <p className="text-sm text-emerald-400 font-semibold">KES {unit.rentAmount.toLocaleString()}/mo</p>
                    {unit.tenantName ? (
                      <p className="text-xs text-gray-500">👤 {unit.tenantName}</p>
                    ) : (
                      <div className="flex gap-1 pt-1">
                        <Button size="sm" variant="outline" className="text-xs py-1" onClick={() => { setSelectedUnit(unit.id); setInviteForm({ ...inviteForm, unitId: unit.id, rentAmount: String(unit.rentAmount) }); setShowInvite(true); }}>Invite</Button>
                        <Button size="sm" className="text-xs py-1" onClick={() => { setTenantForm({ ...tenantForm, unitId: unit.id }); setShowAddTenant(true); }}>+ Tenant</Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Receipts */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-white">Recent Payments</h2>
            </div>
            <Card><div className="divide-y divide-gray-700">
              {receipts.slice(0, 5).map((r) => (
                <div key={r.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-900/20 rounded-lg"><Receipt size={16} className="text-emerald-400" /></div>
                    <div>
                      <p className="font-medium text-white text-sm">{r.unitTitle}</p>
                      <p className="text-xs text-gray-400">{r.period} &middot; {r.paymentMethod} {r.mpesaRef && `· ${r.mpesaRef}`}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">KES {r.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{new Date(r.paidAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {receipts.length === 0 && <div className="p-6 text-center text-gray-400 text-sm">No payments yet.</div>}
            </div></Card>
          </div>
        </div>
      )}

      {/* Units Management */}
      {section === 'units' && <BuildingUnitsView />}

      {/* Tenants */}
      {section === 'tenants' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div><h1 className="text-2xl font-bold text-white">Tenants</h1><p className="text-gray-400 mt-1">{tenants.length} active tenants</p></div>
            <Button onClick={() => setShowAddTenant(true)}><PlusCircle size={16} /> Add Tenant</Button>
          </div>
          <Card><div className="divide-y divide-gray-700">
            {tenants.map((t) => {
              const lease = leases.find((l) => l.tenantId === t.id && l.status === 'active');
              return (
                <div key={t.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-400 font-bold">{t.name[0]}</div>
                    <div>
                      <p className="font-medium text-white">{t.name}</p>
                      <p className="text-sm text-gray-400">{t.email} &middot; {t.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">{t.unitTitle}</p>
                    <p className="text-sm text-white font-medium">KES {t.rentAmount.toLocaleString()}/mo</p>
                    <p className="text-xs text-gray-500">Lease: {new Date(t.leaseStart).toLocaleDateString()} – {new Date(t.leaseEnd).toLocaleDateString()}</p>
                    <div className="flex items-center gap-2 justify-end mt-1">
                      <Badge variant={t.status === 'active' ? 'success' : 'warning'}>{t.status}</Badge>
                      {lease && <Badge variant="info">Leased</Badge>}
                    </div>
                  </div>
                </div>
              );
            })}
            {tenants.length === 0 && <div className="p-8 text-center text-gray-400">No tenants yet. Add a unit and invite tenants.</div>}
          </div></Card>
        </div>
      )}

      {/* Maintenance */}
      {section === 'maintenance' && (
        <div className="space-y-6">
          <div><h1 className="text-2xl font-bold text-white">Maintenance Requests</h1><p className="text-gray-400 mt-1">{maintenance.length} total &middot; {pendingMaintenance} pending</p></div>
          <div className="space-y-4">
            {maintenance.map((m) => (
              <Card key={m.id} className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{m.title}</h3>
                  <div className="flex gap-2">
                    <Badge variant={m.priority === 'high' || m.priority === 'emergency' ? 'danger' : m.priority === 'medium' ? 'warning' : 'info'}>{m.priority}</Badge>
                    <Badge variant={m.status === 'completed' ? 'success' : m.status === 'in_progress' ? 'info' : 'warning'}>{m.status.replace('_', ' ')}</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{m.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Unit: {m.unitTitle} &middot; Tenant: {m.tenantName}</span>
                  <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  {(m.status === 'reported' || m.status === 'assigned') && <Button size="sm" onClick={() => assignMaintenance(m.id)}>Assign</Button>}
                  {m.status === 'in_progress' && <Button size="sm" variant="outline" onClick={() => completeMaintenance(m.id)}>Mark Complete</Button>}
                </div>
              </Card>
            ))}
            {maintenance.length === 0 && <Card className="p-8 text-center text-gray-400"><Wrench size={32} className="mx-auto mb-2 text-gray-600" /><p>No maintenance requests.</p></Card>}
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal open={showAddUnit} onClose={() => setShowAddUnit(false)} title="Add New Unit">
        <form onSubmit={(e) => { e.preventDefault(); if (!unitForm.title) { toast.error('Title is required.'); return; } addUnit({ ...unitForm, bedrooms: Number(unitForm.bedrooms), bathrooms: Number(unitForm.bathrooms), rentAmount: Number(unitForm.rentAmount) }); setUnitForm({ title: '', address: '', city: '', bedrooms: '', bathrooms: '', rentAmount: '' }); setShowAddUnit(false); }} className="space-y-4">
          <Input label="Title *" value={unitForm.title} onChange={(e) => setUnitForm({ ...unitForm, title: e.target.value })} placeholder="e.g., 2BR in Kilimani" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Address" value={unitForm.address} onChange={(e) => setUnitForm({ ...unitForm, address: e.target.value })} />
            <Input label="City" value={unitForm.city} onChange={(e) => setUnitForm({ ...unitForm, city: e.target.value })} />
            <Input label="Bedrooms" type="number" value={unitForm.bedrooms} onChange={(e) => setUnitForm({ ...unitForm, bedrooms: e.target.value })} />
            <Input label="Bathrooms" type="number" value={unitForm.bathrooms} onChange={(e) => setUnitForm({ ...unitForm, bathrooms: e.target.value })} />
            <Input label="Rent (KES)" type="number" value={unitForm.rentAmount} onChange={(e) => setUnitForm({ ...unitForm, rentAmount: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={() => setShowAddUnit(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Add Unit</Button>
          </div>
        </form>
      </Modal>

      <Modal open={showAddTenant} onClose={() => setShowAddTenant(false)} title="Add Tenant">
        <form onSubmit={(e) => { e.preventDefault(); if (!tenantForm.name || !tenantForm.unitId) { toast.error('Name and unit are required.'); return; } const unit = units.find((u) => u.id === tenantForm.unitId); addTenant({ ...tenantForm, unitTitle: unit?.title || '', rentAmount: unit?.rentAmount || 0, leaseStart: new Date().toISOString().split('T')[0], leaseEnd: '' }); setTenantForm({ name: '', email: '', phone: '', unitId: '' }); setShowAddTenant(false); }} className="space-y-4">
          <Input label="Full Name *" value={tenantForm.name} onChange={(e) => setTenantForm({ ...tenantForm, name: e.target.value })} />
          <Input label="Email" type="email" value={tenantForm.email} onChange={(e) => setTenantForm({ ...tenantForm, email: e.target.value })} />
          <Input label="Phone" value={tenantForm.phone} onChange={(e) => setTenantForm({ ...tenantForm, phone: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Unit *</label>
            <select value={tenantForm.unitId} onChange={(e) => { setTenantForm({ ...tenantForm, unitId: e.target.value }); }} className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-white">
              <option value="">Select a unit</option>
              {units.map((u) => <option key={u.id} value={u.id}>{u.title} — KES {u.rentAmount.toLocaleString()}/mo</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={() => setShowAddTenant(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Add Tenant</Button>
          </div>
        </form>
      </Modal>

      <Modal open={showLease} onClose={() => setShowLease(false)} title="Create Lease Agreement">
        <form onSubmit={(e) => { e.preventDefault(); if (!leaseForm.tenantName || !leaseForm.unitId) { toast.error('Tenant and unit are required.'); return; } createLease({ ...leaseForm, landlordId: 'user-003', landlordName: 'Sammy Ndungu', rentAmount: Number(leaseForm.rentAmount), deposit: Number(leaseForm.deposit) }); setLeaseForm({ unitId: '', tenantId: '', tenantName: '', tenantEmail: '', tenantPhone: '', rentAmount: '', deposit: '', startDate: '', endDate: '', terms: '' }); setShowLease(false); }} className="space-y-4">
          <Input label="Tenant Name *" value={leaseForm.tenantName} onChange={(e) => setLeaseForm({ ...leaseForm, tenantName: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Email" type="email" value={leaseForm.tenantEmail} onChange={(e) => setLeaseForm({ ...leaseForm, tenantEmail: e.target.value })} />
            <Input label="Phone" value={leaseForm.tenantPhone} onChange={(e) => setLeaseForm({ ...leaseForm, tenantPhone: e.target.value })} />
            <Input label="Monthly Rent (KES)" type="number" value={leaseForm.rentAmount} onChange={(e) => setLeaseForm({ ...leaseForm, rentAmount: e.target.value })} />
            <Input label="Deposit (KES)" type="number" value={leaseForm.deposit} onChange={(e) => setLeaseForm({ ...leaseForm, deposit: e.target.value })} />
            <Input label="Start Date" type="date" value={leaseForm.startDate} onChange={(e) => setLeaseForm({ ...leaseForm, startDate: e.target.value })} />
            <Input label="End Date" type="date" value={leaseForm.endDate} onChange={(e) => setLeaseForm({ ...leaseForm, endDate: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Terms</label>
            <textarea rows={3} className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-white" value={leaseForm.terms} onChange={(e) => setLeaseForm({ ...leaseForm, terms: e.target.value })} placeholder="Standard lease terms..." />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={() => setShowLease(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1"><FileText size={16} /> Create Lease</Button>
          </div>
        </form>
      </Modal>

      <Modal open={showInvite} onClose={() => setShowInvite(false)} title="Invite Tenant">
        <form onSubmit={(e) => { e.preventDefault(); if (!inviteForm.tenantPhone) { toast.error('Phone number is required.'); return; } inviteTenant({ ...inviteForm, landlordId: 'user-003', landlordName: 'Sammy Ndungu', rentAmount: Number(inviteForm.rentAmount) }); setInviteForm({ unitId: '', tenantName: '', tenantEmail: '', tenantPhone: '', rentAmount: '' }); setShowInvite(false); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Unit</label>
            <select value={inviteForm.unitId} onChange={(e) => { const unit = units.find((u) => u.id === e.target.value); setInviteForm({ ...inviteForm, unitId: e.target.value, rentAmount: String(unit?.rentAmount || '') }); }} className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-white">
              <option value="">Select a unit</option>
              {units.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}
            </select>
          </div>
          <Input label="Tenant Name" value={inviteForm.tenantName} onChange={(e) => setInviteForm({ ...inviteForm, tenantName: e.target.value })} />
          <Input label="Phone *" value={inviteForm.tenantPhone} onChange={(e) => setInviteForm({ ...inviteForm, tenantPhone: e.target.value })} placeholder="+254 7XX XXX XXX" />
          <Input label="Email" type="email" value={inviteForm.tenantEmail} onChange={(e) => setInviteForm({ ...inviteForm, tenantEmail: e.target.value })} />
          <p className="text-xs text-gray-500">Tenant will receive an SMS with a link to accept and set up their account.</p>
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={() => setShowInvite(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1"><Phone size={16} /> Send Invite</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
