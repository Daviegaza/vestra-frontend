import { Users, CreditCard, List, PlusCircle, Target } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import DashboardShell from '../../components/layout/DashboardShell';
import StatCard from '../../components/dashboard/StatCard';
import Card, { Badge } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from '../../store/toastStore';
import { createProperty } from '../../services/properties';
import { useAuthStore } from '../../store/authStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import type { Lead, Commission } from '../../types';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
const leadStatusColors: Record<string, BadgeVariant> = { new: 'info', contacted: 'warning', qualified: 'success', closed: 'success', lost: 'danger' };

export default function AgentDashboard() {
  const location = useLocation();
  const section = location.pathname.split('/').pop() || 'agent';
  const { user } = useAuthStore();
  const { tier } = useSubscriptionStore();

  const [leads, setLeads] = useState<Lead[]>([
    { id: 'ld-001', name: 'Alice Wambua', email: 'alice@example.com', phone: '+254733111111', propertyTitle: 'Modern 3BR Villa in Karen', message: 'Very interested, would like a viewing this weekend.', status: 'qualified', createdAt: '2026-06-22' },
    { id: 'ld-002', name: 'Brian Kiprono', email: 'brian@example.com', phone: '+254744222222', propertyTitle: '3BR Townhouse in Lavington', message: 'What are the payment terms and financing options?', status: 'new', createdAt: '2026-06-21' },
    { id: 'ld-003', name: 'Cynthia Mueni', email: 'cynthia@example.com', phone: '+254755333333', propertyTitle: '5BR Mansion in Runda', message: 'Ready to make an offer. Can we discuss?', status: 'contacted', createdAt: '2026-06-20' },
    { id: 'ld-004', name: 'David Mutua', email: 'david@example.com', phone: '+254766444444', propertyTitle: '4BR Family Home in Langata', message: 'Looking for a family home, flexible on price.', status: 'closed', createdAt: '2026-06-10' },
  ]);

  const commissions: Commission[] = [
    { id: 'com-001', propertyTitle: '3BR Townhouse in Lavington', salePrice: 32000000, commissionRate: 3, commissionAmount: 960000, currency: 'KES', status: 'paid', closedAt: '2026-05-20' },
    { id: 'com-002', propertyTitle: '4BR Family Home in Langata', salePrice: 28000000, commissionRate: 3, commissionAmount: 840000, currency: 'KES', status: 'pending', closedAt: '2026-06-15' },
    { id: 'com-003', propertyTitle: '2BR Apartment in Kilimani', salePrice: 12000000, commissionRate: 2.5, commissionAmount: 300000, currency: 'KES', status: 'pending', closedAt: '2026-06-22' },
  ];

  const handleUpdateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    toast.success(`Lead status updated to ${status}`);
  };

  const [addForm, setAddForm] = useState({
    title: '', price: '', city: '', county: '', bedrooms: '', bathrooms: '', description: '',
  });

  const handleAddListing = async () => {
    if (!addForm.title || !addForm.price || !addForm.city) {
      toast.error('Please fill in title, price, and city at minimum.');
      return;
    }
    try {
      await createProperty({
        title: addForm.title,
        price: Number(addForm.price),
        city: addForm.city,
        county: addForm.county || 'Nairobi',
        bedrooms: Number(addForm.bedrooms) || 0,
        bathrooms: Number(addForm.bathrooms) || 0,
        description: addForm.description,
        listingType: 'sale',
        propertyType: 'residential',
        ownerId: user?.id,
        agentId: user?.id,
      });
      toast.success('Listing created successfully!');
      setAddForm({ title: '', price: '', city: '', county: '', bedrooms: '', bathrooms: '', description: '' });
    } catch {
      toast.error('Failed to create listing.');
    }
  };

  const activeLeads = leads.filter(l => l.status !== 'closed' && l.status !== 'lost').length;
  const totalCommission = commissions.reduce((s, c) => s + c.commissionAmount, 0);

  return (
    <DashboardShell>
      {(section === 'agent') && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div><h1 className="text-2xl font-bold text-white">Agent Dashboard</h1><p className="text-gray-400 mt-1">Manage your leads and track performance.</p></div>
            <Link to="/dashboard/agent/add"><Button><PlusCircle size={16} /> Add Listing</Button></Link>
          </div>

          {tier === 'free' && (
            <div className="p-4 bg-amber-900/20 border border-amber-700/30 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-medium text-amber-400 text-sm">Upgrade your subscription</p>
                <p className="text-xs text-gray-400">You're on the Free tier. Upgrade to Pro for more listings, leads, and features.</p>
              </div>
              <Link to="/dashboard/agent/subscription"><Button size="sm">Upgrade</Button></Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Active Leads" value={activeLeads} icon={Users} color="emerald" />
            <StatCard title="Total Listings" value="42" icon={List} color="blue" />
            <StatCard title="Total Commission" value={`KES ${(totalCommission / 1_000_000).toFixed(1)}M`} icon={CreditCard} color="amber" />
            <StatCard title="Conversion" value="68%" icon={Target} color="purple" />
          </div>
          <div><h2 className="text-lg font-semibold text-white mb-4">Recent Leads</h2>
            <Card><div className="divide-y divide-gray-700">
              {leads.slice(0, 4).map((ld) => (
                <div key={ld.id} className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between"><p className="font-medium text-white">{ld.name}</p><Badge variant={leadStatusColors[ld.status]}>{ld.status}</Badge></div>
                  <p className="text-sm text-gray-400">{ld.propertyTitle}</p>
                  <p className="text-sm text-gray-500">{ld.message}</p>
                  <div className="text-xs text-gray-600">{ld.email} &middot; {ld.phone}</div>
                </div>
              ))}
            </div></Card>
          </div>
        </div>
      )}

      {section === 'listings' && (
        <div className="space-y-6">
          <div><h1 className="text-2xl font-bold text-white">My Listings</h1><p className="text-gray-400 mt-1">42 properties listed</p></div>
          <Card className="p-6 text-center text-gray-400">
            <List size={48} className="mx-auto mb-3 text-gray-600" />
            <p>Your full listing management tools</p>
            <Link to="/dashboard/agent/add"><Button className="mt-4"><PlusCircle size={16} /> Add New Listing</Button></Link>
          </Card>
        </div>
      )}

      {section === 'leads' && (
        <div className="space-y-6">
          <div><h1 className="text-2xl font-bold text-white">Leads</h1><p className="text-gray-400 mt-1">{leads.length} leads</p></div>
          <Card><div className="divide-y divide-gray-700">
            {leads.map((ld) => (
              <div key={ld.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between"><p className="font-medium text-white">{ld.name}</p><Badge variant={leadStatusColors[ld.status]}>{ld.status}</Badge></div>
                <p className="text-sm text-gray-400">{ld.propertyTitle}</p>
                <p className="text-sm text-gray-500">{ld.message}</p>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{ld.email} &middot; {ld.phone}</span>
                  <span>{new Date(ld.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" onClick={() => toast.success(`WhatsApp opened for ${ld.phone}`)}>Contact</Button>
                  {ld.status !== 'qualified' && ld.status !== 'closed' && ld.status !== 'lost' && (
                    <Button size="sm" variant="outline" onClick={() => handleUpdateLeadStatus(ld.id, 'qualified')}>Mark Qualified</Button>
                  )}
                  {ld.status === 'qualified' && (
                    <Button size="sm" variant="outline" onClick={() => handleUpdateLeadStatus(ld.id, 'closed')}>Mark Closed</Button>
                  )}
                </div>
              </div>
            ))}
          </div></Card>
        </div>
      )}

      {section === 'commissions' && (
        <div className="space-y-6">
          <div><h1 className="text-2xl font-bold text-white">Commissions</h1><p className="text-gray-400 mt-1">Total: KES {totalCommission.toLocaleString()}</p></div>
          <Card><div className="divide-y divide-gray-700">
            {commissions.map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{c.propertyTitle}</p>
                  <p className="text-sm text-gray-400">Sale: KES {c.salePrice.toLocaleString()} &middot; Rate: {c.commissionRate}%</p>
                  <p className="text-xs text-gray-500">Closed: {new Date(c.closedAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-lg">KES {c.commissionAmount.toLocaleString()}</p>
                  <Badge variant={c.status === 'paid' ? 'success' : 'warning'}>{c.status}</Badge>
                </div>
              </div>
            ))}
          </div></Card>
        </div>
      )}

      {section === 'add' && (
        <div className="space-y-6">
          <div><h1 className="text-2xl font-bold text-white">Add New Listing</h1><p className="text-gray-400 mt-1">List a new property on behalf of a seller.</p></div>
          <Card className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Property Title *" placeholder="e.g., 3BR Villa in Karen" value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })} />
              <Input label="Price (KES) *" type="number" placeholder="0" value={addForm.price} onChange={(e) => setAddForm({ ...addForm, price: e.target.value })} />
              <Input label="City *" placeholder="e.g., Nairobi" value={addForm.city} onChange={(e) => setAddForm({ ...addForm, city: e.target.value })} />
              <Input label="County" placeholder="e.g., Nairobi" value={addForm.county} onChange={(e) => setAddForm({ ...addForm, county: e.target.value })} />
              <Input label="Bedrooms" type="number" placeholder="0" value={addForm.bedrooms} onChange={(e) => setAddForm({ ...addForm, bedrooms: e.target.value })} />
              <Input label="Bathrooms" type="number" placeholder="0" value={addForm.bathrooms} onChange={(e) => setAddForm({ ...addForm, bathrooms: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
              <textarea rows={4} className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" placeholder="Describe the property..." value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} />
            </div>
            <Button className="w-full" onClick={handleAddListing}><PlusCircle size={16} /> Create Listing</Button>
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}
