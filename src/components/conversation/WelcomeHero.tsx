'use client';

import { motion, type Variants } from 'framer-motion';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function WelcomeHero() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="py-16 text-center"
    >
      <motion.div variants={fadeUp} className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center mx-auto mb-6">
        <span className="text-white text-sm font-bold tracking-tight">7X</span>
      </motion.div>
      <motion.h1 variants={fadeUp} className="text-3xl font-semibold text-gray-900 tracking-tight">
        Logistics, simplified.
      </motion.h1>
      <motion.p variants={fadeUp} className="text-gray-500 mt-3 text-base max-w-md mx-auto">
        Tell us what you need and we&apos;ll guide you to the right solution.
      </motion.p>
    </motion.div>
  );
}
