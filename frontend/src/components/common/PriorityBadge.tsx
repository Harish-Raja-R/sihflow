import React from 'react';
import { clsx } from 'clsx';
import { AlertTriangle, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: string;
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, showIcon = true }) => {
  const getStyles = () => {
    switch (priority?.toUpperCase()) {
      case 'CRITICAL':
        return {
          classes: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <AlertTriangle className="w-3 h-3 mr-1" />,
        };
      case 'HIGH':
        return {
          classes: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: <ArrowUp className="w-3 h-3 mr-1" />,
        };
      case 'MEDIUM':
        return {
          classes: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <AlertCircle className="w-3 h-3 mr-1" />,
        };
      case 'LOW':
      default:
        return {
          classes: 'bg-slate-100 text-slate-600 border-slate-200',
          icon: <ArrowDown className="w-3 h-3 mr-1" />,
        };
    }
  };

  const { classes, icon } = getStyles();

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded border',
        classes
      )}
    >
      {showIcon && icon}
      {priority}
    </span>
  );
};
