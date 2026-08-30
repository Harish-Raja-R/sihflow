import React from 'react';
import { clsx } from 'clsx';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStyles = () => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
      case 'DONE':
      case 'APPROVED':
      case 'PASS':
      case 'ON_TRACK':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'IN_PROGRESS':
      case 'ACTIVE':
      case 'DEVELOPING':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'IN_REVIEW':
      case 'TRIAGED':
      case 'PENDING':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'BLOCKED':
      case 'AT_RISK':
      case 'DELAYED':
      case 'FAIL':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'TODO':
      case 'OPEN':
      case 'IDENTIFIED':
      case 'NOT_STARTED':
      case 'NOT_TESTED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'BACKLOG':
      case 'PLANNED':
      case 'DRAFT':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const formattedStatus = status?.replace(/_/g, ' ') || 'UNKNOWN';

  return (
    <span
      className={clsx(
        'inline-flex items-center font-semibold border rounded-md tracking-wide uppercase',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        getStyles()
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {formattedStatus}
    </span>
  );
};
