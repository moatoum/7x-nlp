'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

interface TextInputProps {
  placeholder?: string;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export function TextInput({ placeholder = 'Type your answer...', onSubmit, disabled }: TextInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSubmit(trimmed);
      setValue('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2.5"
    >
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-3 border border-gray-200 rounded-[14px] text-[15px] bg-white',
            'placeholder:text-gray-350',
            'focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue/50',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'transition-all duration-200'
          )}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!value.trim() || disabled}
        className={cn(
          'w-11 h-11 rounded-[14px] flex items-center justify-center transition-all duration-200 flex-shrink-0',
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
