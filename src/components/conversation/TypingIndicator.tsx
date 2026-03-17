'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedOrb } from '@/components/ui/AnimatedOrb';
import { useTranslation } from '@/i18n/LocaleProvider';

export function TypingIndicator() {
  const { t, tArray } = useTranslation();
  const messages = tArray('typing.messages');
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex items-center gap-3 py-4" role="status" aria-label={t('typing.ariaLabel')}>
      <AnimatedOrb size="sm" />
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 px-4 py-3">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 bg-gray-400 rounded-full"
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={msgIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-[11px] text-gray-400 ps-1"
          >
            {messages[msgIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
