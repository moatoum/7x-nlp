'use client';

import { ExternalLink, Plane, Ship, Newspaper, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { PulseEvent } from '@/lib/pulse-types';

interface PulseEventCardProps {
  event: PulseEvent;
}

const SEVERITY_STYLES = {
  critical: {
    dot: 'bg-red-500',
    accent: 'border-l-red-500',
    dotBg: 'bg-red-50',
  },
  warning: {
    dot: 'bg-amber-500',
    accent: 'border-l-amber-400',
    dotBg: 'bg-amber-50',
  },
  info: {
    dot: 'bg-blue-500',
    accent: 'border-l-blue-400',
    dotBg: 'bg-blue-50',
  },
  neutral: {
    dot: 'bg-gray-300',
    accent: 'border-l-gray-200',
    dotBg: 'bg-gray-50',
  },
};

const CATEGORY_STYLES: Record<string, { bg: string; text: string; icon: typeof Plane }> = {
  Aviation: { bg: 'bg-violet-50', text: 'text-violet-600', icon: Plane },
  Maritime: { bg: 'bg-blue-50', text: 'text-blue-600', icon: Ship },
  'Industry News': { bg: 'bg-amber-50', text: 'text-amber-700', icon: Newspaper },
};

export function PulseEventCard({ event }: PulseEventCardProps) {
  const severity = SEVERITY_STYLES[event.severity];
  const category = CATEGORY_STYLES[event.category] || CATEGORY_STYLES['Industry News'];
  const isDisruption = event.severity === 'critical' || event.severity === 'warning';
  const CategoryIcon = isDisruption ? AlertTriangle : category.icon;

  const Wrapper = event.url ? 'a' : 'div';
  const wrapperProps = event.url
    ? { href: event.url, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        'block bg-white rounded-xl border border-gray-100 p-4 transition-all',
        'hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-gray-150',
        'border-l-[3px]',
        severity.accent,
        event.url && 'cursor-pointer group'
      )}
    >
      {/* Top row: category + timestamp */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold',
            isDisruption ? 'bg-red-50 text-red-600' : category.bg,
            isDisruption ? '' : category.text,
          )}>
            <CategoryIcon className="w-3 h-3" />
            {isDisruption ? 'Disruption' : event.category}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-300 font-medium">{event.timeLabel}</span>
          {event.url && (
            <ExternalLink className="w-3 h-3 text-gray-200 group-hover:text-gray-400 transition-colors" />
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[14px] font-semibold text-gray-900 leading-snug line-clamp-1">
        {event.title}
      </h3>

      {/* Description */}
      {event.description && (
        <p className="text-[13px] text-gray-500 mt-1 leading-relaxed line-clamp-2">
          {event.description}
        </p>
      )}

      {/* Meta chips */}
      {event.meta && Object.keys(event.meta).length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {Object.entries(event.meta).map(([key, value]) => (
            <span
              key={key}
              className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-50 text-[10px] text-gray-500 font-medium"
            >
              {value}
            </span>
          ))}
        </div>
      )}
    </Wrapper>
  );
}
