import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Users, Building, Shield, AlertTriangle, UserCheck, UserX, Trash2, Search, CheckCircle, XCircle } from 'lucide-react';

import StatCard from '../../components/dashboard/StatCard';
import Card, { Badge } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { toast } from '../../store/toastStore';
import { properties } from '../../data/properties';
import type { User as UserType } from '../../types';

const initialUsers: UserType[] = [
  { id: 'user-001', email: 'buyer@vestra.com', fullName: 'John Doe', phone: '+254711111111', role: 'buyer', isVerified: true, isKycVerified: true, location: 'Nairobi' },
  { id: 'user-002', email: 'seller@vestra.com', fullName: 'Jane Muthoni', phone: '+254722222222', role: 'seller', isVerified: true, isKycVerified: true, location: 'Karen' },
  { id: 'user-003', email: 'landlord@vestra.com', fullName: 'Sammy Ndungu', phone: '+254733333333', role: 'landlord', isVerified: true, isKycVerified: true, location: 'Kilimani' },
  { id: 'user-004', email: 'tenant@vestra.com', fullName: 'Mary Wanjiru', phone: '+254744444444', role: 'tenant', isVerified: true, isKycVerified: false, location: 'Westlands' },
  { id: 'user-005', email: 'agent@vestra.com', fullName: 'Wanjiku Mwangi', phone: '+254755555555', role: 'agent', isVerified: true, isKycVerified: true, location: 'Nairobi' },
  { id: 'user-006', email: 'admin@vestra.com', fullName: 'Admin User', phone: '+254766666666', role: 'admin', isVerified: true, isKycVerified: true, location: 'Nairobi' },
  { id: 'user-007', email: 'unverified@test.com', fullName: 'Peter Otieno', phone: '+254777777777', role: 'buyer', isVerified: false, isKycVerified: false, location: 'Kisumu' },
  { id: 'user-008', email: 'flagged@test.com', fullName: 'Alice Kilonzo', phone: '+254788888888', role: 'seller', isVerified: false, isKycVerified: false, location: 'Nairobi' },
];

const roleColors: Record<string, string> = {
  buyer: 'info', seller: 'warning', landlord: 'success', tenant: 'default', agent: 'amber' as const, admin: 'danger',
};

type Tab = 'overview' | 'users' | 'properties' | 'verifications' | 'fraud' | 'audit';
const urlToTab: Record<string, Tab> = {
  admin: 'overview', users: 'users', properties: 'properties', verifications: 'verifications', fraud: 'fraud',
};

export default function AdminDashboard() {
  const location = useLocation();
  const pathSegment = location.pathname.split('/').pop() || 'admin';
  const [activeTab, setActiveTab] = useState<Tab>(urlToTab[pathSegment] || 'overview');
  const [userSearch, setUserSearch] = useState('');
  const [allUsers, setAllUsers] = useState(initialUsers);
  const [pendingVerifications, setPendingVerifications] = useState([
    { id: 'ver-001', propertyTitle: 'Agricultural Land in Limuru', owner: 'Alice Kilonzo', status: 'pending' as const, submittedAt: '2026-06-22T10:00:00Z', aiScore: 82 },
    { id: 'ver-002', propertyTitle: 'Industrial Warehouse in Athi River', owner: 'Bob Muthoka', status: 'pending' as const, submittedAt: '2026-06-21T14:00:00Z', aiScore: 84 },
    { id: 'ver-003', propertyTitle: 'Beachfront Plot in Diani', owner: 'Catherine Mwikali', status: 'in_progress' as const, submittedAt: '2026-06-20T09:00:00Z', aiScore: 81 },
  ]);
  const [fraudReports, setFraudReports] = useState([
    { id: 'fr-001', propertyId: 'prop-099', propertyTitle: 'Suspicious Land in Kitengela', reporter: 'John Doe', reason: 'Multiple title deeds for same parcel', status: 'under_review', reportedAt: '2026-06-22' },
    { id: 'fr-002', propertyId: 'prop-088', propertyTitle: 'Fake Listing in Eastleigh', reporter: 'Jane Muthoni', reason: 'Seller refused to provide title deed', status: 'investigating', reportedAt: '2026-06-20' },
    { id: 'fr-003', propertyId: 'prop-077', propertyTitle: 'Double Allocation in Ruaka', reporter: 'Sammy Ndungu', reason: 'Property sold to two different buyers', status: 'resolved', reportedAt: '2026-06-15' },
  ]);

  useEffect(() => {
    setActiveTab(urlToTab[pathSegment] || 'overview');
  }, [pathSegment]);

  const filteredUsers = allUsers.filter((u) => {
    const q = userSearch.toLowerCase();
    return !q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.includes(q);
  });

  const handleVerifyUser = (id: string) => {
    setAllUsers((prev) => prev.map((u) => u.id === id ? { ...u, isVerified: true } : u));
    toast.success('User verified successfully');
  };

  const handleSuspendUser = (id: string) => {
    setAllUsers((prev) => prev.map((u) => u.id === id ? { ...u, isVerified: false } : u));
    toast.warning('User suspended');
  };

  const handleDeleteUser = (id: string) => {
    setAllUsers((prev) => prev.filter((u) => u.id !== id));
    toast.error('User deleted');
  };

  const handleApproveVerification = (id: string) => {
    setPendingVerifications((prev) => prev.filter((v) => v.id !== id));
    toast.success('Verification approved');
  };

  const handleFlagVerification = (id: string) => {
    setPendingVerifications((prev) => prev.map((v) => v.id === id ? { ...v, status: 'pending' as const } : v));
    toast.warning('Verification flagged for review');
  };

  const handleResolveFraud = (id: string) => {
    setFraudReports((prev) => prev.map((f) => f.id === id ? { ...f, status: 'resolved' } : f));
    toast.success('Fraud report resolved');
  };

  const handleDismissFraud = (id: string) => {
    setFraudReports((prev) => prev.filter((f) => f.id !== id));
    toast.info('Fraud report dismissed');
  };

  const auditLogs = [
    { id: 'log-001', action: 'User registered', user: 'Peter Otieno', timestamp: '2026-06-22T09:00:00Z' },
    { id: 'log-002', action: 'Property listed', user: 'Alice Kilonzo', timestamp: '2026-06-22T08:30:00Z' },
    { id: 'log-003', action: 'Verification requested', user: 'Alice Kilonzo', timestamp: '2026-06-22T08:35:00Z' },
    { id: 'log-004', action: 'Escrow created', user: 'John Doe', timestamp: '2026-06-21T15:00:00Z' },
    { id: 'log-005', action: 'KYC submitted', user: 'Mary Wanjiru', timestamp: '2026-06-21T12:00:00Z' },
    { id: 'log-006', action: 'Login failed (3 attempts)', user: 'unknown@test.com', timestamp: '2026-06-21T02:00:00Z' },
    { id: 'log-007', action: 'Fraud report filed', user: 'Jane Muthoni', timestamp: '2026-06-20T16:00:00Z' },
    { id: 'log-008', action: 'Property sold', user: 'Sammy Ndungu', timestamp: '2026-06-20T10:00:00Z' },
  ];

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'users', label: 'Users' },
    { key: 'properties', label: 'Properties' },
    { key: 'verifications', label: 'Verifications' },
    { key: 'fraud', label: 'Fraud Reports' },
    { key: 'audit', label: 'Audit Log' },
  ];

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Platform administration and monitoring.</p>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Users" value={allUsers.length} icon={Users} color="emerald" />
              <StatCard title="Total Properties" value={properties.length} icon={Building} color="blue" />
              <StatCard title="Pending Verifications" value={pendingVerifications.length} icon={Shield} color="amber" />
              <StatCard title="Fraud Reports" value={fraudReports.length} change="1 new" icon={AlertTriangle} color="red" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">User Distribution</h3>
                <div className="space-y-3">
                  {(['buyer', 'seller', 'agent', 'landlord', 'tenant', 'admin'] as const).map((role) => {
                    const count = allUsers.filter((u) => u.role === role).length;
                    return (
                      <div key={role} className="flex items-center gap-3">
                        <span className="w-20 text-sm text-gray-600 dark:text-gray-400 capitalize">{role}s</span>
                        <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(count / Math.max(allUsers.length, 1)) * 100}%` }} />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-6">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{log.action}</p>
                        <p className="text-xs text-gray-500">by {log.user}</p>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="relative max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left px-4 py-3 font-medium text-gray-500">User</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">KYC</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Location</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 dark:text-white">{u.fullName}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={(roleColors[u.role] as 'info' | 'success' | 'warning' | 'danger') || 'default'}>{u.role}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          {u.isVerified ? (
                            <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle size={12} /> Verified</span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-red-500"><XCircle size={12} /> Unverified</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {u.isKycVerified ? (
                            <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle size={12} /> Passed</span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-amber-500"><AlertTriangle size={12} /> Pending</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.location || '—'}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleVerifyUser(u.id)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Verify"><UserCheck size={14} className="text-emerald-500" /></button>
                            <button onClick={() => handleSuspendUser(u.id)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Suspend"><UserX size={14} className="text-amber-500" /></button>
                            <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Delete"><Trash2 size={14} className="text-red-500" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'properties' && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Property</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Price</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Trust</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Views</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100 dark:border-gray-700/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={p.title} className="w-10 h-10 rounded object-cover" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{p.title}</p>
                            <p className="text-xs text-gray-500">{p.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge>{p.propertyType}</Badge></td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">KES {p.price.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <Badge variant={p.status === 'active' ? 'success' : p.status === 'pending' ? 'warning' : 'default'}>{p.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className={p.trustScore >= 90 ? 'text-emerald-600' : p.trustScore >= 80 ? 'text-amber-600' : 'text-red-600'}>
                          {p.trustScore}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{p.views}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => toast.success('Property approved')} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Approve"><CheckCircle size={14} className="text-emerald-500" /></button>
                          <button onClick={() => toast.warning('Property suspended')} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Suspend"><XCircle size={14} className="text-amber-500" /></button>
                          <button onClick={() => toast.error('Property flagged for deletion')} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Delete"><Trash2 size={14} className="text-red-500" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'verifications' && (
          <Card>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {pendingVerifications.map((v) => (
                <div key={v.id} className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900 dark:text-white">{v.propertyTitle}</p>
                    <p className="text-sm text-gray-500">Owner: {v.owner} &middot; AI Score: <span className="text-emerald-600">{v.aiScore}%</span></p>
                    <p className="text-xs text-gray-400">Submitted: {new Date(v.submittedAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={v.status === 'pending' ? 'warning' : 'info'}>{v.status.replace('_', ' ')}</Badge>
                    <div className="flex gap-1">
                      <Button size="sm" onClick={() => handleApproveVerification(v.id)}><CheckCircle size={14} /> Approve</Button>
                      <Button size="sm" variant="danger" onClick={() => handleFlagVerification(v.id)}>Flag</Button>
                    </div>
                  </div>
                </div>
              ))}
              {pendingVerifications.length === 0 && (
                <div className="p-8 text-center text-gray-400">No pending verifications.</div>
              )}
            </div>
          </Card>
        )}

        {activeTab === 'fraud' && (
          <Card>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {fraudReports.map((f) => (
                <div key={f.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 dark:text-white">{f.propertyTitle}</p>
                    <Badge variant={f.status === 'resolved' ? 'success' : f.status === 'under_review' ? 'warning' : 'danger'}>
                      {f.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">Reported by {f.reporter} &middot; {f.reason}</p>
                  <p className="text-xs text-gray-400">{new Date(f.reportedAt).toLocaleDateString()}</p>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => toast.info('Investigation started')}>Investigate</Button>
                    <Button size="sm" variant="outline" onClick={() => handleResolveFraud(f.id)}><CheckCircle size={14} /> Resolve</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDismissFraud(f.id)}><Trash2 size={14} /> Dismiss</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'audit' && (
          <Card>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${log.action.includes('failed') ? 'bg-red-500' : log.action.includes('Fraud') ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{log.action}</p>
                      <p className="text-xs text-gray-500">by {log.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
  );
}
