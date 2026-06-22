import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'glass' | 'glass-dark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md active:scale-[0.98] transition-all',
  outline:
    'border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 active:scale-[0.98] transition-all',
  ghost:
    'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 active:scale-[0.98] transition-all',
  danger:
    'bg-red-600 text-white hover:bg-red-700 shadow-sm active:scale-[0.98] transition-all',
  glass:
    'glass text-gray-900 dark:text-white hover:bg-white/90 dark:hover:bg-white/10 shadow-sm active:scale-[0.98] transition-all',
  'glass-dark':
    'bg-gray-900/80 text-white backdrop-blur-md border border-white/10 hover:bg-gray-800 active:scale-[0.98] transition-all',
};

const sizeClasses: Record<string, string> = {
  xs: 'px-2.5 py-1 text-xs gap-1',
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
  xl: 'px-8 py-4 text-lg gap-3',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  loading = false,
  icon,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} className="animate-spin shrink-0" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
