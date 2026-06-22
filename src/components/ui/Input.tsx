import type { InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  clearable?: boolean;
  glass?: boolean;
}

export default function Input({ label, error, hint, icon, clearable, glass = false, className = '', id, value, onChange, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          id={inputId}
          value={value}
          onChange={onChange}
          className={`w-full rounded-xl border text-sm transition-all duration-200 outline-none
            ${icon ? 'pl-10' : 'pl-4'}
            ${clearable && value ? 'pr-9' : 'pr-4'}
            py-2.5
            ${glass
              ? 'glass border-transparent focus:ring-2 focus:ring-emerald-500/20'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
            }
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />
        {clearable && value && (
          <button
            type="button"
            onClick={(e) => {
              const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
              const el = (e.currentTarget as HTMLElement).previousSibling as HTMLInputElement;
              nativeSetter?.call(el, '');
              el.dispatchEvent(new Event('input', { bubbles: true }));
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={14} />
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export function SearchInput({
  placeholder = 'Search...',
  value,
  onChange,
  className = '',
  glass = false,
}: {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  glass?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border outline-none transition-all duration-200
          ${glass
            ? 'glass border-transparent focus:ring-2 focus:ring-emerald-500/20'
            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
          }
          text-gray-900 dark:text-white placeholder-gray-400`}
      />
    </div>
  );
}
