'use client';

import { cn } from '@/lib/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'blue' | 'green';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
        variant === 'default' && 'bg-gray-100 text-gray-600',
        variant === 'blue' && 'bg-brand-blue/10 text-brand-blue',
        variant === 'green' && 'bg-emerald-50 text-emerald-700',
        className
      )}
    >
      {children}
    </span>
  );
}
