import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export default function Card({ children, className = '', hover = false, glass = false }: CardProps) {
  return (
    <div
      className={`rounded-xl bg-gray-800 border border-gray-700 shadow-sm ${
        hover ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1' : ''
      } ${
        glass ? 'backdrop-blur-lg bg-gray-800/70' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) {
  const colors: Record<string, string> = {
    default: 'bg-gray-700 text-gray-300',
    success: 'bg-emerald-900/30 text-emerald-400',
    warning: 'bg-amber-900/30 text-amber-400',
    danger: 'bg-red-900/30 text-red-400',
    info: 'bg-blue-900/30 text-blue-400',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[variant]}`}>
      {children}
    </span>
  );
}

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-600 border-t-emerald-400 ${sizeClasses[size]}`} />
  );
}
