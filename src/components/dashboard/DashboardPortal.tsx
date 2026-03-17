'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import { useTranslation } from '@/i18n/LocaleProvider';
import { LocaleLink } from '@/components/ui/LocaleLink';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

import uaeLogoData from '../../../public/animations/uae-logo.json';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export function DashboardPortal() {
  const { t, tArray, dir } = useTranslation();
  const words = tArray('dashboard.rotatingWords');
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setWordIndex((prev) => (prev === words.length - 1 ? 0 : prev + 1));
    }, 2800);
    return () => clearTimeout(timeout);
  }, [wordIndex, words]);

  const isRtl = dir === 'rtl';

  return (
    <div className="relative w-full flex items-center min-h-[calc(100vh-120px)]">
      {/* Left — Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={`relative z-10 flex flex-col items-start text-start max-w-2xl ps-8 md:ps-12 lg:ps-20`}
      >
        {/* Initiative badge */}
        <motion.div variants={fadeUp}>
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-100 text-[11px] font-semibold tracking-widest text-gray-600 uppercase">
            {t('dashboard.badge')}
          </span>
        </motion.div>

        {/* Headline with rotating word */}
        <motion.div variants={fadeUp} className="mt-7">
          <h1 className="text-[40px] md:text-[54px] lg:text-[60px] tracking-[-0.03em] text-gray-900 leading-[1.08]">
            <span className="font-light whitespace-pre-line">{t('dashboard.headline')}</span>
          </h1>
          <div className="relative h-[52px] md:h-[70px] lg:h-[78px] overflow-hidden mt-1">
            {words.map((word, index) => (
              <motion.span
                key={index}
                className={`absolute ${isRtl ? 'right-0' : 'left-0'} text-[40px] md:text-[54px] lg:text-[60px] tracking-[-0.03em] font-semibold text-gray-900 leading-[1.08] whitespace-nowrap`}
                initial={{ opacity: 0, y: 50 }}
                animate={
                  wordIndex === index
                    ? { y: 0, opacity: 1 }
                    : { y: wordIndex > index ? -60 : 60, opacity: 0 }
                }
                transition={{ type: 'spring', stiffness: 50, damping: 15 }}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={fadeUp}
          className="mt-6 text-[16px] md:text-[18px] leading-relaxed text-gray-500 max-w-md"
        >
          <span className="font-semibold text-gray-700">{t('dashboard.descriptionBold')}</span>{' '}
          {t('dashboard.description')}
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={fadeUp} className="mt-9 flex flex-row gap-3">
          <LocaleLink
            href="/intake"
            className="group inline-flex items-center justify-center gap-2.5 h-[52px] px-8 rounded-full bg-gray-900 text-white text-[15px] font-semibold hover:bg-black transition-all shadow-md hover:shadow-lg"
          >
            {t('dashboard.ctaGetSupport')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
          </LocaleLink>
          <LocaleLink
            href="/track"
            className="group inline-flex items-center justify-center gap-2.5 h-[52px] px-8 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-700 text-[15px] font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            {t('dashboard.ctaTrackRequest')}
            <Search className="w-3.5 h-3.5 text-gray-400 transition-colors group-hover:text-gray-600" />
          </LocaleLink>
        </motion.div>
      </motion.div>

      {/* Right — Lottie, coming from right side (mirrors for RTL) */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        className="hidden md:block fixed top-0 pointer-events-none"
        style={{
          width: '270vh',
          height: '270vh',
          ...(isRtl
            ? { left: '-90vh', top: '-85vh' }
            : { right: '-90vh', top: '-85vh' }),
        }}
      >
        <Lottie
          animationData={uaeLogoData}
          loop
          autoplay
          className="w-full h-full"
        />
      </motion.div>
    </div>
  );
}
