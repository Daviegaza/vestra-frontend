import { Users, DollarSign, Home, Target } from 'lucide-react';
import DashboardShell from '../../components/layout/DashboardShell';
import StatCard from '../../components/dashboard/StatCard';
import Card from '../../components/ui/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const monthlyData = [
  { month: 'Jan', sales: 12, rentals: 45, listings: 89, revenue: 2.4 },
  { month: 'Feb', sales: 15, rentals: 52, listings: 95, revenue: 3.1 },
  { month: 'Mar', sales: 18, rentals: 48, listings: 102, revenue: 3.8 },
  { month: 'Apr', sales: 14, rentals: 55, listings: 98, revenue: 3.2 },
  { month: 'May', sales: 22, rentals: 61, listings: 115, revenue: 4.5 },
  { month: 'Jun', sales: 28, rentals: 58, listings: 120, revenue: 5.2 },
];

const propertyTypes = [
  { name: 'Residential', value: 45, color: '#059669' },
  { name: 'Commercial', value: 20, color: '#3b82f6' },
  { name: 'Land', value: 15, color: '#f59e0b' },
  { name: 'Agricultural', value: 10, color: '#8b5cf6' },
  { name: 'Other', value: 10, color: '#6b7280' },
];

const topAgents = [
  { name: 'Wanjiku Mwangi', deals: 28, revenue: 'KES 42M', rating: 4.9 },
  { name: 'Peter Njoroge', deals: 22, revenue: 'KES 35M', rating: 4.9 },
  { name: 'Faith Kamau', deals: 18, revenue: 'KES 28M', rating: 4.8 },
  { name: 'David Ochieng', deals: 15, revenue: 'KES 22M', rating: 4.7 },
  { name: 'Tom Otieno', deals: 12, revenue: 'KES 18M', rating: 4.7 },
];

export default function Analytics() {
  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-1">Platform performance and market insights.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Revenue" value="KES 22.2M" change="+18% this month" icon={DollarSign} color="emerald" />
          <StatCard title="Active Users" value="8,450" change="+12% this month" icon={Users} color="blue" />
          <StatCard title="Properties Listed" value="120" change="+5% this month" icon={Home} color="amber" />
          <StatCard title="Conversion Rate" value="14.2%" change="+2.1% this month" icon={Target} color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className="font-semibold text-white mb-4">Revenue & Transactions</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#059669" radius={[4,4,0,0]} name="Revenue (KES M)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-white mb-4">Monthly Activity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#059669" strokeWidth={2} name="Sales" />
                <Line type="monotone" dataKey="rentals" stroke="#3b82f6" strokeWidth={2} name="Rentals" />
                <Line type="monotone" dataKey="listings" stroke="#f59e0b" strokeWidth={2} name="Listings" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className="font-semibold text-white mb-4">Property Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={propertyTypes} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                  {propertyTypes.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-white mb-4">Top Performing Agents</h3>
            <div className="space-y-3">
              {topAgents.map((a, i) => (
                <div key={a.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-900/50 flex items-center justify-center text-xs font-bold text-emerald-400">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{a.name}</p>
                      <p className="text-xs text-gray-400">{a.deals} deals &middot; {a.revenue}</p>
                    </div>
                  </div>
                  <span className="text-sm text-amber-400 font-semibold">★ {a.rating}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-5">
          <h3 className="font-semibold text-white mb-4">Revenue Streams</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Transaction Fees', value: 'KES 8.5M', pct: '38%', color: 'bg-emerald-500' },
              { label: 'Subscriptions', value: 'KES 5.2M', pct: '24%', color: 'bg-blue-500' },
              { label: 'Verification', value: 'KES 4.8M', pct: '22%', color: 'bg-amber-500' },
              { label: 'Featured Listings', value: 'KES 3.7M', pct: '16%', color: 'bg-purple-500' },
            ].map((stream) => (
              <div key={stream.label} className="p-4 rounded-xl bg-gray-800/50 text-center space-y-2">
                <div className={`w-3 h-3 rounded-full ${stream.color} mx-auto`} />
                <p className="text-xs text-gray-400">{stream.label}</p>
                <p className="text-lg font-bold text-white">{stream.value}</p>
                <p className="text-xs text-gray-500">{stream.pct} of total</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
