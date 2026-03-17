'use client';

import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import type { ChipOption } from '@/engine/types';
import { cn, isArabic } from '@/lib/cn';
import { useTranslation } from '@/i18n/LocaleProvider';

interface ChipGroupProps {
  chips: ChipOption[];
  multiSelect?: boolean;
  onSelect?: (chipId: string, chipLabel: string) => void;
  onMultiSelect?: (selected: string[]) => void;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export function ChipGroup({ chips, multiSelect, onSelect, onMultiSelect }: ChipGroupProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return null;

  const handleClick = (chip: ChipOption) => {
    if (multiSelect) {
      setSelected((prev) => {
        const next = new Set(prev);
        if (chip.id === 'none') {
          return new Set(['none']);
        }
        next.delete('none');
        if (next.has(chip.id)) {
          next.delete(chip.id);
        } else {
          next.add(chip.id);
        }
        return next;
      });
    } else {
      onSelect?.(chip.id, chip.label);
    }
  };

  const handleContinue = () => {
    if (selected.size > 0 && onMultiSelect) {
      const labels = chips
        .filter((c) => selected.has(c.id))
        .map((c) => c.label);
      setSubmitted(true);
      onMultiSelect(labels);
    }
  };

  // Detect if any chip label has Arabic text
  const hasArabicChips = chips.some((chip) => isArabic(chip.label));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
      <div className={cn('flex flex-wrap gap-2')}>
        {chips.map((chip) => {
          const chipIsArabic = isArabic(chip.label);
          return (
            <motion.button
              key={chip.id}
              variants={item}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleClick(chip)}
              className={cn(
                'px-4 py-2.5 rounded-[12px] text-[13px] font-medium border transition-all duration-200',
                multiSelect && selected.has(chip.id)
                  ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm bg-white',
                chipIsArabic && 'font-arabic dir-rtl'
              )}
            >
              {chip.label}
            </motion.button>
          );
        })}
      </div>
      {multiSelect && selected.size > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          className={cn(
            'px-5 py-2.5 bg-brand-blue text-white text-[13px] font-medium rounded-[12px] hover:bg-brand-blue-hover transition-colors shadow-sm',
            hasArabicChips && 'font-arabic'
          )}
        >
          {t('conversation.continue')}
        </motion.button>
      )}
    </motion.div>
  );
}
