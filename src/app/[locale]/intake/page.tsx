'use client';

import { LazyMotion, domAnimation } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';

export default function IntakePage() {
  return (
    <LazyMotion features={domAnimation}>
      <AppShell />
    </LazyMotion>
  );
}
