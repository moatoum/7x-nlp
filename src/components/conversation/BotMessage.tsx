'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Message, ServiceMatch } from '@/engine/types';
import { ChipGroup } from './ChipGroup';
import { ServiceCardInline } from './ServiceCardInline';
import { AnimatedOrb } from '@/components/ui/AnimatedOrb';
import { isArabic } from '@/lib/cn';

interface BotMessageProps {
  message: Message;
  onChipSelect?: (chipId: string, chipLabel: string) => void;
  onMultiSelect?: (selected: string[]) => void;
  onServiceConfirm?: (selectedServices: ServiceMatch[]) => void;
  isLatest?: boolean;
  isFirst?: boolean;
}

export function BotMessage({ message, onChipSelect, onMultiSelect, onServiceConfirm, isLatest, isFirst }: BotMessageProps) {
  const isStreaming = message.isStreaming;
  const rtl = isArabic(message.content);
  const langClass = rtl ? 'font-arabic dir-rtl' : '';
  const hasSelectableCards = !!message.serviceCards?.length && !!onServiceConfirm && isLatest && !isStreaming;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    // Pre-select all recommended services by default
    if (message.serviceCards?.length) {
      return new Set(message.serviceCards.map((c) => c.id));
    }
    return new Set();
  });

  const handleToggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (!message.serviceCards || !onServiceConfirm) return;
    const selected = message.serviceCards.filter((c) => selectedIds.has(c.id));
    if (selected.length > 0) {
      onServiceConfirm(selected);
    }
  }, [message.serviceCards, onServiceConfirm, selectedIds]);

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
            <AnimatedOrb size="md" />
            <div>
              <p className="text-[13px] font-semibold text-gray-900">LINK Assistant</p>
              <p className="text-[11px] text-gray-400">Logistics Solutions Advisor</p>
            </div>
          </div>
          <div className={`text-[17px] leading-relaxed text-gray-900 whitespace-pre-line font-medium ${langClass}`}>
            {message.content.split('\n\n')[0]}
          </div>
          {message.content.split('\n\n')[1] && (
            <div className={`text-[15px] leading-relaxed text-gray-600 mt-3 whitespace-pre-line ${langClass}`}>
              {message.content.split('\n\n').slice(1).join('\n\n')}
            </div>
          )}
        </div>
      )}

      {!isFirst && (
        <div className={`flex gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
          <AnimatedOrb size="sm" className="mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className={`text-[15px] leading-relaxed text-gray-800 whitespace-pre-line ${langClass}`}>
              {message.content}
              {isStreaming && (
                <span className="inline-block w-[2px] h-[18px] bg-brand-blue ml-0.5 align-text-bottom animate-pulse" />
              )}
            </div>
          </div>
        </div>
      )}

      {message.serviceCards && message.serviceCards.length > 0 && !isStreaming && (
        <div className={`mt-3 ${!isFirst ? 'ml-10' : ''}`}>
          <div className={`space-y-1.5 ${message.serviceCards.length > 5 ? 'max-h-[320px] overflow-y-auto pr-1' : ''}`}>
            {message.serviceCards.map((card, i) => (
              <ServiceCardInline
                key={card.id}
                service={card}
                index={i}
                selectable={hasSelectableCards}
                selected={selectedIds.has(card.id)}
                onToggle={hasSelectableCards ? handleToggle : undefined}
              />
            ))}
          </div>

          {hasSelectableCards && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: message.serviceCards.length * 0.04 + 0.15 }}
              className="flex items-center gap-3 pt-1.5"
            >
              <button
                onClick={handleConfirm}
                disabled={selectedIds.size === 0}
                className="h-[36px] px-5 rounded-full bg-black text-white text-[13px] font-medium hover:bg-gray-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Confirm Selection ({selectedIds.size})
              </button>
            </motion.div>
          )}
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
