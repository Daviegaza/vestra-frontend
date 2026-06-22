import type { ComponentType } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatItem {
  title: string;
  value: string | number;
  change?: string;
  changeDirection?: 'up' | 'down';
  icon: ComponentType<{ size?: number; className?: string }>;
  color?: 'emerald' | 'amber' | 'blue' | 'red' | 'purple';
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: number;
  className?: string;
}

const colorMap = {
  emerald: {
    light: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    dark: 'dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  amber: {
    light: 'bg-amber-50 text-amber-600 border-amber-100',
    dark: 'dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
    gradient: 'from-amber-500 to-amber-600',
  },
  blue: {
    light: 'bg-blue-50 text-blue-600 border-blue-100',
    dark: 'dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    gradient: 'from-blue-500 to-blue-600',
  },
  red: {
    light: 'bg-red-50 text-red-600 border-red-100',
    dark: 'dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    gradient: 'from-red-500 to-red-600',
  },
  purple: {
    light: 'bg-purple-50 text-purple-600 border-purple-100',
    dark: 'dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
    gradient: 'from-purple-500 to-purple-600',
  },
};

export default function StatsGrid({ stats, columns = 4, className = '' }: StatsGridProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(columns, 4)} gap-4 ${className}`}
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))` }}
    >
      {stats.map((stat) => {
        const c = colorMap[stat.color || 'emerald'];
        return (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 overflow-hidden group"
          >
            <div className="p-5 flex items-start justify-between">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {stat.title}
                </p>
                <p className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white group-hover:scale-105 transition-transform origin-left">
                  {stat.value}
                </p>
                {stat.change && (
                  <p
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      stat.changeDirection === 'down' ? 'text-red-500' : 'text-emerald-500'
                    }`}
                  >
                    {stat.changeDirection === 'down' ? (
                      <TrendingDown size={12} />
                    ) : (
                      <TrendingUp size={12} />
                    )}
                    {stat.change}
                  </p>
                )}
              </div>
              <div
                className={`p-3 rounded-xl border ${c.light} ${c.dark} group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon size={22} />
              </div>
            </div>
            <div className={`h-1 bg-gradient-to-r ${c.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
          </div>
        );
      })}
    </div>
  );
}
