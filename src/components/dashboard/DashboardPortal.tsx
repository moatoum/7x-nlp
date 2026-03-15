'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

export function DashboardPortal() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center text-center w-full max-w-lg"
    >
      {/* Heading */}
      <motion.h1
        variants={fadeUp}
        className="text-[26px] md:text-[36px] font-semibold text-gray-900 tracking-[-0.025em] leading-[1.2]"
      >
        What can we move for you?
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={fadeUp}
        className="mt-3 text-[14px] text-gray-400 leading-relaxed max-w-[340px]"
      >
        Logistics solutions across the GCC — tell us what you need.
      </motion.p>

      {/* CTA */}
      <motion.div variants={fadeUp} className="mt-8">
        <Link
          href="/intake"
          className="group inline-flex items-center gap-2.5 h-[48px] px-7 rounded-full bg-black text-white text-[14px] font-medium hover:bg-gray-900 transition-all shadow-sm hover:shadow-md"
        >
          Start a Request
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </motion.div>

      {/* Meta */}
      <motion.div
        variants={fadeUp}
        className="mt-8 flex items-center gap-4 text-[11px] text-gray-300 font-medium tracking-wide"
      >
        <span>93+ Services</span>
        <span className="w-px h-3 bg-gray-200" />
        <span>11 Categories</span>
        <span className="w-px h-3 bg-gray-200" />
        <span>GCC-wide</span>
      </motion.div>
    </motion.div>
  );
}
