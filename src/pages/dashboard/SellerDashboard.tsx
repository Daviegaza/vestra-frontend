import { List, Eye, TrendingUp, MessageSquare, PlusCircle, Edit, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

import StatCard from '../../components/dashboard/StatCard';
import Card, { Badge } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';
import { properties } from '../../data/properties';
import { createProperty } from '../../services/properties';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const inquiries = [
  { id: 'inq-001', name: 'John Doe', email: 'john@example.com', property: 'Modern 3BR Villa in Karen', message: 'Is this still available for viewing this weekend?', date: '2026-06-22' },
  { id: 'inq-002', name: 'Mary Wanjiku', email: 'mary@example.com', property: '3BR Townhouse in Lavington', message: 'Can you share the payment terms?', date: '2026-06-21' },
  { id: 'inq-003', name: 'Peter Kamau', email: 'peter@example.com', property: 'Modern 3BR Villa in Karen', message: 'What is the final negotiable price?', date: '2026-06-20' },
];

const chartData = [
  { month: 'Jan', views: 45, inquiries: 8 },
  { month: 'Feb', views: 52, inquiries: 12 },
  { month: 'Mar', views: 38, inquiries: 6 },
  { month: 'Apr', views: 65, inquiries: 15 },
  { month: 'May', views: 72, inquiries: 18 },
  { month: 'Jun', views: 90, inquiries: 22 },
];

export default function SellerDashboard() {
  const location = useLocation();
  const section = location.pathname.split('/').pop() || 'seller';
  const { user } = useAuthStore();

  const myListings = properties.filter((p) => p.ownerId === user?.id);

  const [addForm, setAddForm] = useState({
    title: '', price: '', city: '', county: '', bedrooms: '', bathrooms: '', sizeSqft: '', yearBuilt: '', description: '', listingType: 'sale', propertyType: 'residential',
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
        sizeSqft: Number(addForm.sizeSqft) || 0,
        yearBuilt: Number(addForm.yearBuilt) || 2024,
        description: addForm.description,
        listingType: addForm.listingType as 'sale' | 'rent' | 'lease',
        propertyType: addForm.propertyType as 'residential' | 'commercial' | 'land',
        ownerId: user?.id,
      });
      toast.success('Listing created successfully!');
      setAddForm({ title: '', price: '', city: '', county: '', bedrooms: '', bathrooms: '', sizeSqft: '', yearBuilt: '', description: '', listingType: 'sale', propertyType: 'residential' });
    } catch {
      toast.error('Failed to create listing.');
    }
  };

  return (
    <>
      {(section === 'seller') && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div><h1 className="text-2xl font-bold text-white">Seller Dashboard</h1><p className="text-gray-400 mt-1">Manage your property listings.</p></div>
            <Link to="/dashboard/seller/add"><Button><PlusCircle size={16} /> Add Listing</Button></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Listings" value={myListings.length} icon={List} color="emerald" />
            <StatCard title="Total Views" value={myListings.reduce((s, p) => s + p.views, 0)} icon={Eye} color="blue" />
            <StatCard title="Inquiries" value={inquiries.length} icon={MessageSquare} color="amber" />
            <StatCard title="Est. Value" value={`KES ${(myListings.reduce((s, p) => s + p.price, 0) / 1_000_000).toFixed(0)}M`} icon={TrendingUp} color="purple" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Recent Listings</h2>
            {myListings.length > 0 ? (
              <Card><div className="divide-y divide-gray-700">
                {myListings.map((p) => (
                  <div key={p.id} className="p-4 flex items-center gap-4">
                    <img src={p.images[0]} alt={p.title} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0"><p className="font-medium text-white truncate">{p.title}</p><p className="text-sm text-gray-400">KES {p.price.toLocaleString()} &middot; {p.views} views &middot; {p.inquiries} inquiries</p></div>
                    <Badge variant={p.status === 'active' ? 'success' : p.status === 'pending' ? 'warning' : 'default'}>{p.status}</Badge>
                  </div>
                ))}
              </div></Card>
            ) : (
              <Card className="p-8 text-center text-gray-400">
                <List size={32} className="mx-auto mb-2 text-gray-600" />
                <p>No listings yet.</p>
                <Link to="/dashboard/seller/add" className="text-sm text-emerald-400 hover:underline">Create your first listing</Link>
              </Card>
            )}
          </div>
        </div>
      )}

      {section === 'listings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div><h1 className="text-2xl font-bold text-white">My Listings</h1><p className="text-gray-400 mt-1">{myListings.length} properties</p></div>
            <Link to="/dashboard/seller/add"><Button><PlusCircle size={16} /> Add New</Button></Link>
          </div>
          {myListings.length > 0 ? (
            <Card><div className="divide-y divide-gray-700">
              {myListings.map((p) => (
                <div key={p.id} className="p-4 flex items-center gap-4">
                  <img src={p.images[0]} alt={p.title} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-white">{p.title}</p>
                    <p className="text-sm text-gray-400">KES {p.price.toLocaleString()} &middot; {p.views} views &middot; {p.inquiries} inquiries</p>
                    <p className="text-xs text-gray-500">{p.city}, {p.county}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={p.status === 'active' ? 'success' : p.status === 'pending' ? 'warning' : 'default'}>{p.status}</Badge>
                    <Link to={`/properties/${p.id}`} className="p-2 hover:bg-gray-700 rounded-lg"><Edit size={16} className="text-gray-400" /></Link>
                  </div>
                </div>
              ))}
            </div></Card>
          ) : (
            <Card className="p-12 text-center text-gray-400">
              <List size={48} className="mx-auto mb-3 text-gray-600" />
              <p className="text-lg">No listings yet.</p>
              <Link to="/dashboard/seller/add"><Button className="mt-3"><PlusCircle size={16} /> Add Your First Listing</Button></Link>
            </Card>
          )}
        </div>
      )}

      {section === 'add' && (
        <div className="space-y-6">
          <div><h1 className="text-2xl font-bold text-white">Add New Listing</h1><p className="text-gray-400 mt-1">Create a new property listing.</p></div>
          <Card className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Title *" placeholder="e.g., 3BR Villa in Karen" value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })} />
              <Input label="Price (KES) *" type="number" placeholder="0" value={addForm.price} onChange={(e) => setAddForm({ ...addForm, price: e.target.value })} />
              <Input label="City *" placeholder="e.g., Nairobi" value={addForm.city} onChange={(e) => setAddForm({ ...addForm, city: e.target.value })} />
              <Input label="County" placeholder="e.g., Nairobi" value={addForm.county} onChange={(e) => setAddForm({ ...addForm, county: e.target.value })} />
              <Input label="Bedrooms" type="number" placeholder="0" value={addForm.bedrooms} onChange={(e) => setAddForm({ ...addForm, bedrooms: e.target.value })} />
              <Input label="Bathrooms" type="number" placeholder="0" value={addForm.bathrooms} onChange={(e) => setAddForm({ ...addForm, bathrooms: e.target.value })} />
              <Input label="Size (sqft)" type="number" placeholder="0" value={addForm.sizeSqft} onChange={(e) => setAddForm({ ...addForm, sizeSqft: e.target.value })} />
              <Input label="Year Built" type="number" placeholder="2024" value={addForm.yearBuilt} onChange={(e) => setAddForm({ ...addForm, yearBuilt: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
              <textarea rows={4} className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" placeholder="Describe your property..." value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <select className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white" value={addForm.listingType} onChange={(e) => setAddForm({ ...addForm, listingType: e.target.value })}>
                <option value="sale">For Sale</option><option value="rent">For Rent</option><option value="lease">For Lease</option>
              </select>
              <select className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white" value={addForm.propertyType} onChange={(e) => setAddForm({ ...addForm, propertyType: e.target.value })}>
                <option value="residential">Residential</option><option value="commercial">Commercial</option><option value="land">Land</option>
              </select>
            </div>
            <Button className="w-full" onClick={handleAddListing}><PlusCircle size={16} /> Create Listing</Button>
          </Card>
        </div>
      )}

      {section === 'analytics' && (
        <div className="space-y-6">
          <div><h1 className="text-2xl font-bold text-white">Analytics</h1><p className="text-gray-400 mt-1">Track your listing performance.</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Views" value="720" change="+18% this month" icon={Eye} color="blue" />
            <StatCard title="Inquiries" value="45" change="+12% this month" icon={MessageSquare} color="emerald" />
            <StatCard title="Conversion Rate" value="14%" change="+2% this month" icon={TrendingUp} color="amber" />
            <StatCard title="Avg Days on Market" value="34" change="-5 days" icon={BarChart3} color="purple" />
          </div>
          <Card className="p-5">
            <h3 className="font-semibold text-white mb-4">Monthly Views & Inquiries</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Bar dataKey="views" fill="#10b981" radius={[4,4,0,0]} name="Views" />
                <Bar dataKey="inquiries" fill="#f59e0b" radius={[4,4,0,0]} name="Inquiries" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </>
  );
}
