'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function DashboardHero() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="py-12 md:py-20 text-center max-w-3xl mx-auto px-6"
    >
      <motion.h1
        variants={fadeUp}
        className="text-3xl md:text-hero font-semibold text-gray-900 tracking-tight"
      >
        Global Logistics. Local Expertise.
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="text-gray-500 mt-4 text-base md:text-lg max-w-2xl mx-auto"
      >
        Part of Emirates Post Group, 7X connects businesses across the GCC with 93+ logistics
        solutions tailored to your industry.
      </motion.p>

      <motion.div variants={fadeUp} className="mt-8">
        <Link href="/intake">
          <Button size="lg" className="gap-2">
            Start Your Request
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="mt-10 flex items-center justify-center gap-3 text-[13px] text-gray-400 font-medium"
      >
        <span>11 Categories</span>
        <span className="text-gray-200">|</span>
        <span>93+ Solutions</span>
        <span className="text-gray-200">|</span>
        <span>GCC Coverage</span>
      </motion.div>
    </motion.section>
  );
}
