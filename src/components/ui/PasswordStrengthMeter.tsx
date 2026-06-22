import { useMemo } from 'react';

interface Props {
  password: string;
  className?: string;
}

const STRENGTH_LABELS = ['Weak', 'Fair', 'Good', 'Strong'] as const;

function calculateStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(3, score);
}

export default function PasswordStrengthMeter({ password, className = '' }: Props) {
  const score = useMemo(() => calculateStrength(password), [password]);

  if (!password) return null;

  const label = STRENGTH_LABELS[score];
  const pct = ((score + 1) / 4) * 100;
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];
  const textColors = ['text-red-600', 'text-orange-600', 'text-yellow-700', 'text-emerald-600'];

  return (
    <div className={`mt-1.5 space-y-1 ${className}`}>
      <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colors[score]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={`text-xs font-medium ${textColors[score]}`}>{label}</p>
    </div>
  );
}
