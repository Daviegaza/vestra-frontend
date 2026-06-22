import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  className?: string;
}

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

const dotSizeMap: Record<string, string> = {
  xs: 'w-1.5 h-1.5 ring-1',
  sm: 'w-2 h-2 ring-1',
  md: 'w-2.5 h-2.5 ring-2',
  lg: 'w-3 h-3 ring-2',
  xl: 'w-3.5 h-3.5 ring-2',
};

function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getColorFromName(name?: string): string {
  const colors = [
    'bg-emerald-500', 'bg-rift-500', 'bg-amber-500',
    'bg-terracotta-500', 'bg-kikuyu-500', 'bg-acacia-500',
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function Avatar({ src, alt, name, size = 'md', online, className = '' }: AvatarProps) {
  const initials = getInitials(name);
  const color = getColorFromName(name);

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={`${sizeMap[size]} rounded-full object-cover ring-2 ring-white/20 dark:ring-white/10`}
        />
      ) : (
        <div
          className={`${sizeMap[size]} ${color} rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-white/20 dark:ring-white/10`}
          aria-label={name || 'User avatar'}
        >
          {name ? initials : <User size={size === 'xs' ? 10 : size === 'sm' ? 12 : 16} />}
        </div>
      )}
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 ${dotSizeMap[size]} rounded-full ring-white dark:ring-surface-900 ${
            online ? 'bg-emerald-500' : 'bg-gray-400'
          }`}
        />
      )}
    </div>
  );
}
