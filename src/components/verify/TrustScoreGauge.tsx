import { useEffect, useRef, useState } from 'react';

interface TrustScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}

export default function TrustScoreGauge({
  score,
  size = 120,
  strokeWidth = 8,
  showLabel = true,
  className = '',
}: TrustScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 1500;
    const startScore = 0;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(startScore + (score - startScore) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [score]);

  const color =
    animatedScore >= 75 ? '#10b981' : animatedScore >= 50 ? '#f59e0b' : '#ef4444';
  const glowColor =
    animatedScore >= 75 ? 'rgba(16,185,129,0.3)' : animatedScore >= 50 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)';

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const center = 50;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 100 100"
          className="transform -rotate-90 w-full h-full"
          style={{ filter: `drop-shadow(0 0 12px ${glowColor})` }}
        >
          <circle cx={center} cy={center} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-gray-200 dark:text-gray-700" />
          <circle
            cx={center} cy={center} r={radius} fill="none"
            stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{animatedScore}</span>
          <span className="text-xs text-gray-500">/100</span>
        </div>
      </div>
      {showLabel && (
        <span className={`text-xs font-semibold mt-2 ${animatedScore >= 75 ? 'text-emerald-600' : animatedScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
          {animatedScore >= 90 ? 'Excellent' : animatedScore >= 75 ? 'Good' : animatedScore >= 50 ? 'Fair' : 'Low Trust'}
        </span>
      )}
    </div>
  );
}
