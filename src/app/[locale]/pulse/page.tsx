'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PulseHeader } from '@/components/pulse/PulseHeader';
import { PulseFilterBar } from '@/components/pulse/PulseFilterBar';
import { PulseTimeline } from '@/components/pulse/PulseTimeline';
import { usePulseData, usePulseEvents } from '@/hooks/usePulseData';

export default function PulsePage() {
  const { refresh } = usePulseData();
  const { events, loading } = usePulseEvents();

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <DashboardHeader />

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-8">
        <PulseHeader onRefresh={refresh} />
        <PulseFilterBar />
        <PulseTimeline events={events} loading={loading} />
      </div>
    </div>
  );
}
