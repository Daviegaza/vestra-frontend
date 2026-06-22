import { Clock, User, Home, CreditCard, FileText, Wrench, Shield, Bell } from 'lucide-react';
import { formatRelativeTime } from '../../lib/utils';

export interface Activity {
  id: string;
  type: 'listing' | 'payment' | 'lease' | 'maintenance' | 'verification' | 'message' | 'escrow';
  title: string;
  description: string;
  user: string;
  timestamp: string;
}

const iconMap = {
  listing: Home,
  payment: CreditCard,
  lease: FileText,
  maintenance: Wrench,
  verification: Shield,
  message: Bell,
  escrow: Shield,
};

const colorMap = {
  listing: 'bg-blue-900/20 text-blue-400',
  payment: 'bg-emerald-900/20 text-emerald-400',
  lease: 'bg-purple-900/20 text-purple-400',
  maintenance: 'bg-amber-900/20 text-amber-400',
  verification: 'bg-emerald-900/20 text-emerald-400',
  message: 'bg-blue-900/20 text-blue-400',
  escrow: 'bg-amber-900/20 text-amber-400',
};

export default function ActivityFeed({ activities, className = '' }: { activities: Activity[]; className?: string }) {
  if (!activities || activities.length === 0) {
    return (
      <div className={`p-8 text-center text-gray-400 ${className}`}>
        <Clock size={32} className="mx-auto mb-2 text-gray-600" />
        <p className="text-sm">No recent activity.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {activities.slice(0, 10).map((a) => {
        const Icon = iconMap[a.type] || Bell;
        return (
          <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
            <div className={`p-2 rounded-lg shrink-0 ${colorMap[a.type]}`}>
              <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{a.title}</p>
              <p className="text-xs text-gray-400">{a.description}</p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                <span className="flex items-center gap-1"><User size={10} /> {a.user}</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {formatRelativeTime(a.timestamp)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
