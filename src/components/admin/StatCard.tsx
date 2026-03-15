'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ label, value, subtitle, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
        {label}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {trend && (
          <span
            className={cn(
              'flex items-center',
              trend === 'up' && 'text-emerald-500',
              trend === 'down' && 'text-red-500',
              trend === 'neutral' && 'text-gray-400'
            )}
          >
            {trend === 'up' && <TrendingUp className="w-4 h-4" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4" />}
            {trend === 'neutral' && <Minus className="w-4 h-4" />}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
