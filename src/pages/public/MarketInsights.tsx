import { Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Card from '../../components/ui/Card';

const countyPrices = [
  { name: 'Nairobi', avgSale: 35_000_000, avgRent: 85_000, trend: 'up', change: '+12%' },
  { name: 'Kiambu', avgSale: 18_000_000, avgRent: 45_000, trend: 'up', change: '+8%' },
  { name: 'Mombasa', avgSale: 22_000_000, avgRent: 65_000, trend: 'up', change: '+5%' },
  { name: 'Machakos', avgSale: 12_000_000, avgRent: 30_000, trend: 'down', change: '-3%' },
  { name: 'Nakuru', avgSale: 15_000_000, avgRent: 38_000, trend: 'up', change: '+6%' },
  { name: 'Kajiado', avgSale: 25_000_000, avgRent: 55_000, trend: 'up', change: '+10%' },
];

const priceTrends = [
  { month: 'Jan', sale: 28, rent: 72, land: 15 },
  { month: 'Feb', sale: 30, rent: 74, land: 16 },
  { month: 'Mar', sale: 32, rent: 75, land: 17 },
  { month: 'Apr', sale: 29, rent: 73, land: 18 },
  { month: 'May', sale: 33, rent: 78, land: 19 },
  { month: 'Jun', sale: 35, rent: 82, land: 22 },
];

const propTypeDist = [
  { name: 'Residential', value: 45, color: '#059669' },
  { name: 'Commercial', value: 20, color: '#3b82f6' },
  { name: 'Land', value: 18, color: '#f59e0b' },
  { name: 'Agricultural', value: 10, color: '#8b5cf6' },
  { name: 'Other', value: 7, color: '#6b7280' },
];

const marketActivity = [
  { event: '3BR Villa sold in Karen', price: 'KES 42M', time: '2 hours ago' },
  { event: 'New listing: Commercial space Westlands', price: 'KES 320K/mo', time: '4 hours ago' },
  { event: 'Land parcel sold in Ruiru', price: 'KES 8.5M', time: '6 hours ago' },
  { event: 'Price drop: Apartment in Kilimani', price: 'KES 78K/mo', time: 'Yesterday' },
  { event: 'Verification complete: Nyali beachfront', price: 'Trust 94%', time: 'Yesterday' },
];

const formatKES = (n: number) => {
  if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(1)}M`;
  return `KES ${n.toLocaleString('en-KE')}`;
};

export default function MarketInsights() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Market Insights</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Kenya property market data, trends, and analytics.</p>
      </div>

      {/* Market Pulse */}
      <Card className="p-5 bg-gradient-to-r from-emerald-600 to-kikuyu-600 text-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold flex items-center gap-2"><Activity size={18} /> Live Market Pulse</h2>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Nairobi Metro</span>
        </div>
        <div className="overflow-hidden">
          <div className="flex gap-8 animate-marquee whitespace-nowrap">
            {marketActivity.map((m, i) => (
              <span key={i} className="text-sm opacity-90">
                {m.event} <span className="font-semibold">{m.price}</span> &middot; {m.time}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* County Price Comparison */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">County Price Index</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500">
                <th className="pb-3 font-medium">County</th>
                <th className="pb-3 font-medium">Avg Sale Price</th>
                <th className="pb-3 font-medium">Avg Rent</th>
                <th className="pb-3 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {countyPrices.map((c) => (
                <tr key={c.name} className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="py-3 font-medium text-gray-900 dark:text-white">{c.name}</td>
                  <td className="py-3 text-gray-700 dark:text-gray-300">{formatKES(c.avgSale)}</td>
                  <td className="py-3 text-gray-700 dark:text-gray-300">KES {c.avgRent.toLocaleString('en-KE')}/mo</td>
                  <td className={`py-3 flex items-center gap-1 ${c.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {c.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {c.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Price Trends (KES Millions)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={priceTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="sale" stroke="#059669" strokeWidth={2} name="Sale Price" />
              <Line type="monotone" dataKey="rent" stroke="#3b82f6" strokeWidth={2} name="Rent" />
              <Line type="monotone" dataKey="land" stroke="#f59e0b" strokeWidth={2} name="Land" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Property Type Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={propTypeDist} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                {propTypeDist.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">County Average Sale Prices</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={countyPrices}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(0)}M`} />
            <Tooltip formatter={(value) => [`KES ${Number(value).toLocaleString('en-KE')}`, 'Avg Price']} />
            <Bar dataKey="avgSale" fill="#059669" radius={[4, 4, 0, 0]} name="Avg Sale Price" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
