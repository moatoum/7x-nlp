'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Check, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n/LocaleProvider';

interface SummaryFieldProps {
  label: string;
  value: string | string[] | null;
  isHighlighted?: boolean;
  fieldKey?: string;
  onEdit?: (fieldKey: string, newValue: string) => void;
}

export function SummaryField({ label, value, isHighlighted, fieldKey, onEdit }: SummaryFieldProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = Array.isArray(value) ? value.join(', ') : value;
  const hasValue = displayValue && displayValue.length > 0;
  const canEdit = hasValue && fieldKey && onEdit;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    if (!canEdit) return;
    setEditValue(displayValue || '');
    setIsEditing(true);
  };

  const confirmEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== displayValue && fieldKey && onEdit) {
      onEdit(fieldKey, trimmed);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        'py-2 rounded-lg transition-all duration-500 -mx-2 px-2',
        isHighlighted && 'bg-brand-blue/[0.06] ring-1 ring-brand-blue/20'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">
          {label}
        </div>
        {canEdit && !isEditing && (
          <button
            onClick={startEditing}
            className="opacity-0 group-hover/field:opacity-100 hover:opacity-100 focus:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-100"
            aria-label={`Edit ${label}`}
          >
            <Pencil className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5"
          >
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              className="flex-1 text-sm text-gray-900 bg-white border border-brand-blue/30 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-blue/40"
            />
            <button
              onClick={confirmEdit}
              className="p-1 rounded-md bg-brand-blue text-white hover:bg-brand-blue-hover transition-colors"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={cancelEdit}
              className="p-1 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ) : hasValue ? (
          <motion.div
            key={displayValue}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.25 }}
            className={cn(
              'text-sm text-gray-900',
              canEdit && 'cursor-pointer hover:text-brand-blue transition-colors'
            )}
            onClick={canEdit ? startEditing : undefined}
          >
            {displayValue}
            {isHighlighted && (
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="ms-2 text-[10px] text-brand-blue font-medium"
              >
                {t('request.updated')}
              </motion.span>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-300"
          >
            —
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
