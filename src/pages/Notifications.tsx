import { useState } from 'react';
import { Info, AlertTriangle, CheckCircle, CreditCard, Shield, MessageSquare, X } from 'lucide-react';
import DashboardShell from '../components/layout/DashboardShell';
import { Badge } from '../components/ui/Card';
import { notifications as mockData } from '../data/notifications';
import { toast } from '../store/toastStore';
import type { Notification } from '../types';

const typeIcons: Record<string, typeof Info> = {
  info: Info, success: CheckCircle, warning: AlertTriangle, error: X,
  payment: CreditCard, verification: Shield, message: MessageSquare,
};

const typeColors: Record<string, string> = {
  info: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  success: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
  warning: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  error: 'text-red-600 bg-red-50 dark:bg-red-900/20',
  payment: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
  verification: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
  message: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
};

export default function Notifications() {
  const [items, setItems] = useState<Notification[]>([...mockData]);

  const unread = items.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const markAsRead = (id: string) => {
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{unread} unread</p>
          </div>
          {unread > 0 && (
            <button onClick={markAllAsRead} className="text-sm text-emerald-600 hover:underline">Mark all as read</button>
          )}
        </div>

        <div className="space-y-2">
          {items.map((n) => {
            const Icon = typeIcons[n.type] || Info;
            return (
              <div
                key={n.id}
                className={`p-4 flex items-start gap-4 cursor-pointer rounded-xl bg-gray-800 border border-gray-700 ${!n.read ? 'border-l-2 border-l-emerald-500' : ''}`}
                onClick={() => markAsRead(n.id)}
              >
                <div className={`p-2 rounded-lg ${typeColors[n.type]}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {n.title}
                    </p>
                    {!n.read && <Badge variant="success">New</Badge>}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
