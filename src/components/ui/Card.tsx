import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-8' };

export default function Card({
  children,
  className = '',
  hover = false,
  glass = false,
  padding = 'md',
}: CardProps) {
  return (
    <div
      className={`rounded-2xl ${paddingMap[padding]} ${
        glass
          ? 'glass-card'
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm'
      } ${
        hover
          ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-emerald-200 dark:hover:border-emerald-800'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  variant = 'default',
  className = '',
  dot,
}: {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'amber' | 'emerald';
  className?: string;
  dot?: boolean;
}) {
  const colors: Record<string, string> = {
    default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  };

  const dotColors: Record<string, string> = {
    default: 'bg-gray-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[variant]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} ${variant === 'success' || variant === 'emerald' ? 'badge-pulse' : ''}`} />
      )}
      {children}
    </span>
  );
}

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-[3px]' };
  return (
    <div
      className={`animate-spin rounded-full border-gray-200 dark:border-gray-600 border-t-emerald-500 ${sizeClasses[size]}`}
    />
  );
}
