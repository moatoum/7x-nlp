'use client';

import { useCallback } from 'react';
import { AlternatingLogo } from '@/components/ui/AlternatingLogo';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useRequestStore } from '@/store/requestStore';
import { useConversationStore } from '@/store/conversationStore';
import { useUIStore } from '@/store/uiStore';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PanelRight, RotateCcw } from 'lucide-react';
import { useTranslation } from '@/i18n/LocaleProvider';

export function Header() {
  const { t } = useTranslation();
  const { completionPercent, stage } = useRequestStore();
  const started = useConversationStore((s) => s.started);
  const { toggleDrawer } = useUIStore();
  const showProgress = stage !== 'empty' && stage !== 'submitted';
  const showRestart = started && stage !== 'submitted';

  const handleRestart = useCallback(() => {
    if (!window.confirm(t('header.restartConfirm'))) return;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('7x-conversation');
      sessionStorage.removeItem('7x-request');
    }
    useConversationStore.getState().reset();
    useRequestStore.getState().reset();
  }, [t]);

  return (
    <header className="h-[56px] border-b border-gray-100 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 flex-shrink-0 fixed top-0 inset-x-0 z-50 md:relative md:top-auto md:inset-x-auto">
      <div className="flex items-center gap-1.5">
        <AlternatingLogo />
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-gray-200">|</span>
          <span className="text-[13px] text-gray-400 font-medium">{t('header.link')}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {showProgress && (
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{t('header.progress')}</span>
            <div className="w-32">
              <ProgressBar percent={completionPercent} />
            </div>
            <span className="text-xs text-gray-500 font-semibold tabular-nums">{completionPercent}%</span>
          </div>
        )}

        <LanguageSwitcher />

        {showRestart && (
          <button
            onClick={handleRestart}
            title={t('header.restartTitle')}
            className="w-9 h-9 rounded-[10px] bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-gray-500" />
          </button>
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
