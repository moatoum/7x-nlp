'use client';

import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: LucideIcon;
  accentColor?: string;
}

export function StatCard({ label, value, subtitle, trend, trendValue, icon: Icon, accentColor = '#0020f5' }: StatCardProps) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 p-5 overflow-hidden group hover:shadow-sm transition-shadow">
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full opacity-60"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
            {label}
          </p>
          <p className="text-[28px] font-bold text-gray-900 mt-1 tracking-tight leading-none">
            {value}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {trend && (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded-md',
                  trend === 'up' && 'bg-emerald-50 text-emerald-600',
                  trend === 'down' && 'bg-red-50 text-red-500',
                  trend === 'neutral' && 'bg-gray-50 text-gray-400'
                )}
              >
                {trend === 'up' && <TrendingUp className="w-3 h-3" />}
                {trend === 'down' && <TrendingDown className="w-3 h-3" />}
                {trend === 'neutral' && <Minus className="w-3 h-3" />}
                {trendValue}
              </span>
            )}
            {subtitle && (
              <p className="text-[11px] text-gray-400">{subtitle}</p>
            )}
          </div>
        </div>
        {Icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center opacity-80"
            style={{ backgroundColor: `${accentColor}08` }}
          >
            <Icon className="w-5 h-5" style={{ color: accentColor }} />
          </div>
        )}
      </div>
    </div>
  );
}
