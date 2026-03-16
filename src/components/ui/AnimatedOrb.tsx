'use client';

import { cn } from '@/lib/cn';

interface AnimatedOrbProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
  lg: 'w-12 h-12',
};

/**
 * Animated orb — NLS Assistant avatar.
 * Two soft blobs (#817047 gold, #0020f5 blue) orbiting inside a circle.
 */
export function AnimatedOrb({ size = 'md', className }: AnimatedOrbProps) {
  return (
    <div
      className={cn(
        'relative rounded-full flex-shrink-0 overflow-hidden bg-[#0a0a0a]',
        SIZES[size],
        className
      )}
    >
      {/* Gold blob */}
      <div
        className="absolute w-[120%] h-[120%] rounded-full blur-[6px] animate-[spin_6s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #817047 0%, transparent 60%)',
          top: '-10%',
          left: '-10%',
        }}
      />

      {/* Blue blob */}
      <div
        className="absolute w-[120%] h-[120%] rounded-full blur-[6px] animate-[spin_6s_ease-in-out_infinite_reverse]"
        style={{
          background: 'radial-gradient(circle at 70% 70%, #0020f5 0%, transparent 60%)',
          top: '-10%',
          left: '-10%',
        }}
      />

      {/* Soft center glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1/3 h-1/3 rounded-full bg-white/15 blur-[3px]" />
      </div>
    </div>
  );
}
