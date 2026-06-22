import type { ComponentType } from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon?: ComponentType<{ size?: number; className?: string }>;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { icon: 32, iconWrap: 'w-14 h-14', title: 'text-base', desc: 'text-sm' },
  md: { icon: 40, iconWrap: 'w-18 h-18', title: 'text-lg', desc: 'text-sm' },
  lg: { icon: 56, iconWrap: 'w-24 h-24', title: 'text-xl', desc: 'text-base' },
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
  size = 'md',
}: EmptyStateProps) {
  const s = sizeMap[size];
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {Icon && (
        <div className={`${s.iconWrap} rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4`}>
          <Icon size={s.icon} className="text-gray-400 dark:text-gray-500" />
        </div>
      )}
      <h3 className={`${s.title} font-semibold text-gray-900 dark:text-white`}>{title}</h3>
      {description && <p className={`${s.desc} text-gray-500 dark:text-gray-400 mt-1.5 max-w-sm`}>{description}</p>}
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
