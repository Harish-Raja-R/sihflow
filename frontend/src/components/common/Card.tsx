import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl p-5 border border-slate-200 shadow-sm',
        hoverEffect && 'clean-card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
