'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn, isArabic } from '@/lib/cn';
import { motion } from 'framer-motion';

interface TextInputProps {
  placeholder?: string;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export function TextInput({ placeholder = 'Type your message...', onSubmit, disabled }: TextInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
    }
  }, []);

  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  useEffect(() => {
    autoResize();
  }, [value, autoResize]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSubmit(trimmed);
      setValue('');
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-end gap-2.5"
    >
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          dir={isArabic(value) ? 'rtl' : 'ltr'}
          className={cn(
            'w-full px-4 py-3 border border-gray-200 rounded-[14px] text-[15px] bg-white resize-none',
            'placeholder:text-gray-350',
            'focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue/50',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'transition-all duration-200',
            'min-h-[46px] max-h-[120px]',
            isArabic(value) && 'font-arabic text-right'
          )}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!value.trim() || disabled}
        className={cn(
          'w-11 h-11 rounded-[14px] flex items-center justify-center transition-all duration-200 flex-shrink-0 mb-[1px]',
          value.trim() && !disabled
            ? 'bg-brand-blue text-white hover:bg-brand-blue-hover shadow-sm'
            : 'bg-gray-50 text-gray-300 border border-gray-100'
        )}
      >
        <ArrowUp className="w-[18px] h-[18px]" />
      </button>
    </motion.div>
  );
}
