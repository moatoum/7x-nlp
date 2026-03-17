'use client';

import { usePulseStore } from '@/store/pulseStore';
import { buildPulseEvents } from '@/lib/buildPulseEvents';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n/LocaleProvider';
import type { PulseFilter } from '@/lib/pulse-types';

const FILTER_KEYS: { value: PulseFilter; labelKey: string }[] = [
  { value: 'all', labelKey: 'pulse.filterAll' },
  { value: 'disruptions', labelKey: 'pulse.filterDisruptions' },
  { value: 'flights', labelKey: 'pulse.filterFlights' },
  { value: 'maritime', labelKey: 'pulse.filterMaritime' },
  { value: 'news', labelKey: 'pulse.filterNews' },
];

export function PulseFilterBar() {
  const { t } = useTranslation();
  const activeFilter = usePulseStore((s) => s.activeFilter);
  const setActiveFilter = usePulseStore((s) => s.setActiveFilter);
  const maritime = usePulseStore((s) => s.maritime.data);
  const aviation = usePulseStore((s) => s.aviation.data);
  const news = usePulseStore((s) => s.news.data);

  // Compute counts for each filter
  const allEvents = buildPulseEvents(maritime, aviation, news);
  const counts: Record<PulseFilter, number> = {
    all: allEvents.length,
    disruptions: allEvents.filter((e) => e.severity === 'warning' || e.severity === 'critical').length,
    flights: allEvents.filter((e) => e.category === 'Aviation').length,
    maritime: allEvents.filter((e) => e.category === 'Maritime').length,
    news: allEvents.filter((e) => e.category === 'Industry News').length,
  };

  const hasDisruptions = counts.disruptions > 0;

  return (
    <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
      {FILTER_KEYS.map((filter) => (
        <button
          key={filter.value}
          onClick={() => setActiveFilter(filter.value)}
          className={cn(
            'inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[12px] font-medium transition-all whitespace-nowrap shrink-0',
            activeFilter === filter.value
              ? 'bg-gray-900 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
          )}
        >
          {filter.value === 'disruptions' && hasDisruptions && activeFilter !== 'disruptions' && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          )}
          {t(filter.labelKey)}
          {counts[filter.value] > 0 && (
            <span className={cn(
              'text-[10px] font-semibold',
              activeFilter === filter.value ? 'text-white/60' : 'text-gray-300'
            )}>
              {counts[filter.value]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
