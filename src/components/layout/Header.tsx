'use client';

import { AlternatingLogo } from '@/components/ui/AlternatingLogo';
import { useRequestStore } from '@/store/requestStore';
import { useUIStore } from '@/store/uiStore';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PanelRight } from 'lucide-react';

export function Header() {
  const { completionPercent, stage } = useRequestStore();
  const { toggleDrawer } = useUIStore();
  const showProgress = stage !== 'empty' && stage !== 'submitted';

  return (
    <header className="h-[56px] border-b border-gray-100 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 flex-shrink-0 z-50">
      <div className="flex items-center gap-1.5">
        <AlternatingLogo />
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-gray-200">|</span>
          <span className="text-[13px] text-gray-400 font-medium">National Logistics Support</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {showProgress && (
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Progress</span>
            <div className="w-32">
              <ProgressBar percent={completionPercent} />
            </div>
            <span className="text-xs text-gray-500 font-semibold tabular-nums">{completionPercent}%</span>
          </div>
        )}

        <button
          onClick={toggleDrawer}
          className="lg:hidden w-9 h-9 rounded-[10px] bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <PanelRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </header>
  );
}
