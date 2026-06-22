import type { ComponentType } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  color?: 'emerald' | 'amber' | 'blue' | 'red' | 'purple';
}

const colorMap = {
  emerald: 'bg-emerald-900/20 text-emerald-400',
  amber: 'bg-amber-900/20 text-amber-400',
  blue: 'bg-blue-900/20 text-blue-400',
  red: 'bg-red-900/20 text-red-400',
  purple: 'bg-purple-900/20 text-purple-400',
};

export default function StatCard({ title, value, change, icon: Icon, color = 'emerald' }: StatCardProps) {
  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-sm hover:shadow-xl hover:border-emerald-700 transition-all duration-300 overflow-hidden">
      <div className="p-5 flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-black text-white">{value}</p>
          {change && (
            <p className={`text-xs font-semibold ${change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{change}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon size={22} />
        </div>
      </div>
      <div className={`h-1 bg-gradient-to-r ${color === 'emerald' ? 'from-emerald-600 to-emerald-500' : color === 'amber' ? 'from-amber-600 to-amber-500' : color === 'blue' ? 'from-blue-600 to-blue-500' : color === 'red' ? 'from-red-600 to-red-500' : 'from-purple-600 to-purple-500'}`} />
    </div>
  );
}
