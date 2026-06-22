import { Link } from 'react-router-dom';
import type { ComponentType } from 'react';
import { ArrowRight } from 'lucide-react';

interface QuickAction {
  label: string;
  description?: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  to: string;
  color?: 'emerald' | 'amber' | 'blue' | 'purple' | 'red';
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

const gradientMap = {
  emerald: 'from-emerald-500/10 to-emerald-500/5 hover:from-emerald-500/20 hover:to-emerald-500/10 border-emerald-200 dark:border-emerald-800',
  amber: 'from-amber-500/10 to-amber-500/5 hover:from-amber-500/20 hover:to-amber-500/10 border-amber-200 dark:border-amber-800',
  blue: 'from-blue-500/10 to-blue-500/5 hover:from-blue-500/20 hover:to-blue-500/10 border-blue-200 dark:border-blue-800',
  purple: 'from-purple-500/10 to-purple-500/5 hover:from-purple-500/20 hover:to-purple-500/10 border-purple-200 dark:border-purple-800',
  red: 'from-red-500/10 to-red-500/5 hover:from-red-500/20 hover:to-red-500/10 border-red-200 dark:border-red-800',
};

const iconBgMap: Record<string, string> = {
  emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
};

export default function QuickActions({ actions, className = '' }: QuickActionsProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ${className}`}>
      {actions.map((action) => (
        <Link
          key={action.label}
          to={action.to}
          className={`group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${gradientMap[action.color || 'emerald']}`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${iconBgMap[action.color || 'emerald']}`}>
            <action.icon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{action.label}</p>
            {action.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{action.description}</p>
            )}
          </div>
          <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>
      ))}
    </div>
  );
}
