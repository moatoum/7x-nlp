'use client';

import { useRequestStore } from '@/store/requestStore';
import { RequestEmpty } from './RequestEmpty';
import { RequestSummary } from './RequestSummary';
import { ConfirmationState } from './ConfirmationState';
import { useTranslation } from '@/i18n/LocaleProvider';

export function RequestPanel() {
  const { t } = useTranslation();
  const { stage } = useRequestStore();

  return (
    <div className="h-full flex flex-col bg-[#fafafa]">
      <div className="px-6 py-4 border-b border-gray-100/80">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
          <h2 className="text-[13px] font-semibold text-gray-900 uppercase tracking-wider">{t('request.yourRequest')}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {stage === 'empty' && <RequestEmpty />}
        {(stage === 'gathering' || stage === 'matched' || stage === 'review') && <RequestSummary />}
        {stage === 'submitted' && <ConfirmationState />}
      </div>
    </div>
  );
}
