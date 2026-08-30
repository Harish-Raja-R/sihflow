import React from 'react';

export interface ProgressBarProps {
  value?: number;
  progress?: number;
  max?: number;
  showLabel?: boolean;
  color?: 'emerald' | 'blue' | 'amber' | 'rose' | 'purple' | 'red';
  variant?: 'emerald' | 'blue' | 'amber' | 'rose' | 'purple' | 'red' | string;
  height?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  progress,
  max = 100,
  showLabel = false,
  color,
  variant = 'emerald',
  height = 'md',
  className = '',
}) => {
  const actualValue = value !== undefined ? value : progress !== undefined ? progress : 0;
  const percentage = Math.min(Math.max(Math.round((actualValue / max) * 100), 0), 100);

  const selectedColor = color || variant;

  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    red: 'bg-rose-500',
    purple: 'bg-purple-500',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const barColor = colorMap[selectedColor] || 'bg-emerald-500';

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heights[height]}`}>
        <div
          className={`${barColor} h-full transition-all duration-300 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
