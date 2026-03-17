'use client';

import { motion, type Variants } from 'framer-motion';
import { AnimatedOrb } from '@/components/ui/AnimatedOrb';
import { useTranslation } from '@/i18n/LocaleProvider';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function WelcomeHero() {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="py-16 text-center"
    >
      <motion.div variants={fadeUp} className="flex justify-center mb-6">
        <AnimatedOrb size="lg" />
      </motion.div>
      <motion.h1 variants={fadeUp} className="text-3xl font-semibold text-gray-900 tracking-tight">
        {t('welcome.title')}
      </motion.h1>
      <motion.p variants={fadeUp} className="text-gray-500 mt-3 text-base max-w-md mx-auto">
        {t('welcome.subtitle')}
      </motion.p>
    </motion.div>
  );
}
