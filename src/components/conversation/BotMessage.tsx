'use client';

import { motion } from 'framer-motion';
import type { Message } from '@/engine/types';
import { ChipGroup } from './ChipGroup';
import { ServiceCardInline } from './ServiceCardInline';

interface BotMessageProps {
  message: Message;
  onChipSelect?: (chipId: string, chipLabel: string) => void;
  onMultiSelect?: (selected: string[]) => void;
  isLatest?: boolean;
  isFirst?: boolean;
}

export function BotMessage({ message, onChipSelect, onMultiSelect, isLatest, isFirst }: BotMessageProps) {
  const isStreaming = message.isStreaming;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="py-4"
    >
      {isFirst && (
        <div className="mb-6 pb-6 border-b border-gray-50">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-[11px] bg-black flex items-center justify-center">
              <span className="text-white text-[11px] font-bold tracking-tight">7X</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-900">7X Assistant</p>
              <p className="text-[11px] text-gray-400">Logistics Solutions Advisor</p>
            </div>
          </div>
          <div className="text-[17px] leading-relaxed text-gray-900 whitespace-pre-line font-medium">
            {message.content.split('\n\n')[0]}
          </div>
          {message.content.split('\n\n')[1] && (
            <div className="text-[15px] leading-relaxed text-gray-600 mt-3 whitespace-pre-line">
              {message.content.split('\n\n').slice(1).join('\n\n')}
            </div>
          )}
        </div>
      )}

      {!isFirst && (
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-[9px] bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-[9px] font-bold tracking-tight">7X</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] leading-relaxed text-gray-800 whitespace-pre-line">
              {message.content}
              {isStreaming && (
                <span className="inline-block w-[2px] h-[18px] bg-brand-blue ml-0.5 align-text-bottom animate-pulse" />
              )}
            </div>
          </div>
        </div>
      )}

      {message.serviceCards && message.serviceCards.length > 0 && !isStreaming && (
        <div className={`mt-4 space-y-2.5 ${!isFirst ? 'ml-10' : ''}`}>
          {message.serviceCards.map((card, i) => (
            <ServiceCardInline key={card.id} service={card} index={i} />
          ))}
        </div>
      )}

      {message.chips && isLatest && onChipSelect && !isStreaming && (
        <div className={`mt-4 ${!isFirst ? 'ml-10' : ''}`}>
          <ChipGroup
            chips={message.chips}
            multiSelect={message.multiSelect}
            onSelect={onChipSelect}
            onMultiSelect={onMultiSelect}
          />
        </div>
      )}
    </motion.div>
  );
}
