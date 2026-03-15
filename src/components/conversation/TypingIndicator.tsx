'use client';

import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 py-4">
      <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
        <span className="text-white text-[10px] font-bold tracking-tight">7X</span>
      </div>
      <div className="flex items-center gap-1 px-4 py-3 bg-gray-50 rounded-2xl">
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
    </div>
  );
}
