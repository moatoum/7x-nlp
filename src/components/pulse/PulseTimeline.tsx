'use client';

import { motion, type Variants } from 'framer-motion';
import { Radio } from 'lucide-react';
import { PulseEventCard } from './PulseEventCard';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n/LocaleProvider';
import type { PulseEvent } from '@/lib/pulse-types';

interface PulseTimelineProps {
  events: PulseEvent[];
  loading: boolean;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-red-500 ring-red-100',
  warning: 'bg-amber-400 ring-amber-100',
  info: 'bg-blue-400 ring-blue-100',
  neutral: 'bg-gray-300 ring-gray-100',
};

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-xl border border-gray-100 p-4 border-s-[3px] border-s-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-16 bg-gray-100 rounded-md" />
          <div className="flex-1" />
          <div className="h-3 w-12 bg-gray-100 rounded" />
        </div>
        <div className="h-4 w-3/4 bg-gray-100 rounded mb-2" />
        <div className="h-3 w-full bg-gray-50 rounded mb-1" />
        <div className="h-3 w-2/3 bg-gray-50 rounded" />
        <div className="flex gap-1.5 mt-3">
          <div className="h-5 w-16 bg-gray-50 rounded-md" />
          <div className="h-5 w-20 bg-gray-50 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function PulseTimeline({ events, loading }: PulseTimelineProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="relative ps-6">
        {/* Timeline line */}
        <div className="absolute start-[7px] top-2 bottom-2 w-px bg-gray-100" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="relative">
              <div className="absolute -start-6 top-5 w-[9px] h-[9px] rounded-full bg-gray-200 ring-4 ring-[#fafafa]" />
              <SkeletonCard />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
          <Radio className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-[14px] font-medium text-gray-400">{t('pulse.noEvents')}</p>
        <p className="text-[12px] text-gray-300 mt-1">{t('pulse.tryDifferent')}</p>
      </div>
    );
  }

  return (
    <div className="relative ps-6">
      {/* Timeline line */}
      <div className="absolute start-[7px] top-2 bottom-2 w-px bg-gray-200/60" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {events.map((event) => (
          <motion.div key={event.id} variants={item} className="relative">
            {/* Timeline dot */}
            <div
              className={cn(
                'absolute -start-6 top-5 w-[9px] h-[9px] rounded-full ring-4 ring-[#fafafa]',
                SEVERITY_DOT[event.severity] || SEVERITY_DOT.neutral
              )}
            />
            <PulseEventCard event={event} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
