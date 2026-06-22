interface ProgressBarProps {
  value?: number;
  max?: number;
  variant?: 'emerald' | 'amber' | 'blue' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  indeterminate?: boolean;
  className?: string;
}

const variantColors = {
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  blue: 'bg-rift-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
};

const sizeHeights = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export default function ProgressBar({
  value = 0,
  max = 100,
  variant = 'emerald',
  size = 'md',
  showLabel = false,
  label,
  animated = true,
  indeterminate = false,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`space-y-1 ${className}`}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="text-gray-600 dark:text-gray-400 font-medium">{label}</span>}
          {showLabel && <span className="text-gray-500 dark:text-gray-500 font-medium">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeHeights[size]}`}>
        <div
          className={`${sizeHeights[size]} rounded-full ${variantColors[variant]} ${
            animated && !indeterminate ? 'transition-all duration-500 ease-out' : ''
          } ${indeterminate ? 'w-1/3 progress-indeterminate' : ''}`}
          style={indeterminate ? undefined : { width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

export function CircularProgress({
  value = 0,
  max = 100,
  size = 64,
  strokeWidth = 4,
  variant = 'emerald' as const,
  showLabel = true,
  className = '',
}: {
  value?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'emerald' | 'amber' | 'blue' | 'red' | 'purple';
  showLabel?: boolean;
  className?: string;
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const variantColorsStroke = {
    emerald: 'stroke-emerald-500',
    amber: 'stroke-amber-500',
    blue: 'stroke-rift-500',
    red: 'stroke-red-500',
    purple: 'stroke-purple-500',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-gray-200 dark:stroke-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={`${variantColorsStroke[variant]} transition-all duration-700 ease-out`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {showLabel && (
        <span className="absolute text-sm font-bold text-gray-900 dark:text-white">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
