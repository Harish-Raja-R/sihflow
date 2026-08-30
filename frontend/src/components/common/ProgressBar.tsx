import React from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'blue' | 'amber' | 'rose' | 'auto';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = false,
  size = 'md',
  color = 'auto',
  className,
}) => {
  const clampedProgress = Math.min(Math.max(progress || 0, 0), 100);

  const getColor = () => {
    if (color !== 'auto') {
      switch (color) {
        case 'emerald': return 'bg-emerald-500';
        case 'blue': return 'bg-blue-600';
        case 'amber': return 'bg-amber-500';
        case 'rose': return 'bg-rose-500';
      }
    }
    if (clampedProgress >= 90) return 'bg-emerald-500';
    if (clampedProgress >= 70) return 'bg-blue-600';
    if (clampedProgress >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getHeight = () => {
    switch (size) {
      case 'sm': return 'h-1.5';
      case 'lg': return 'h-2.5';
      case 'md':
      default: return 'h-2';
    }
  };

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1 text-xs">
          <span className="text-slate-500 font-medium">Completion</span>
          <span className="text-slate-800 font-semibold font-mono">{clampedProgress}%</span>
        </div>
      )}
      <div className={clsx('w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/80', getHeight())}>
        <div
          className={clsx('h-full rounded-full transition-all duration-300 ease-out', getColor())}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};
