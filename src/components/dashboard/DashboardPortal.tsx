'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

export function DashboardPortal() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ['seamless', 'reliable', 'efficient', 'smarter', 'faster'],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2500);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center text-center w-full max-w-2xl mx-auto px-6"
    >
      {/* Badge */}
      <motion.div variants={fadeUp}>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100/80 text-[12px] font-medium text-gray-500 hover:bg-gray-200/80 hover:text-gray-700 transition-colors backdrop-blur-sm"
        >
          86+ logistics solutions available
          <ArrowRight className="w-3 h-3" />
        </Link>
      </motion.div>

      {/* Heading with rotating word */}
      <motion.div variants={fadeUp} className="mt-6">
        <h1 className="text-[36px] md:text-[56px] tracking-[-0.03em] text-gray-900 leading-[1.1]">
          <span className="font-light">Logistics made</span>
          <span className="relative flex w-full justify-center overflow-hidden md:pb-3 md:pt-1 h-[50px] md:h-[72px]">
            &nbsp;
            {titles.map((title, index) => (
              <motion.span
                key={index}
                className="absolute font-semibold"
                initial={{ opacity: 0, y: '-100' }}
                transition={{ type: 'spring', stiffness: 50 }}
                animate={
                  titleNumber === index
                    ? { y: 0, opacity: 1 }
                    : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                }
              >
                {title}
              </motion.span>
            ))}
          </span>
        </h1>
      </motion.div>

      {/* Paragraph */}
      <motion.p
        variants={fadeUp}
        className="mt-4 text-[15px] md:text-[17px] leading-relaxed text-gray-400 max-w-md"
      >
        End-to-end logistics across the UAE and GCC. From first mile to last mile,
        warehousing to customs — tell us what you need.
      </motion.p>

      {/* Two Buttons */}
      <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/intake"
          className="group inline-flex items-center justify-center gap-2.5 h-[48px] px-7 rounded-full bg-black text-white text-[14px] font-medium hover:bg-gray-900 transition-all shadow-sm hover:shadow-md"
        >
          Start a Request
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/admin/submissions"
          className="group inline-flex items-center justify-center gap-2.5 h-[48px] px-7 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-700 text-[14px] font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          Track Existing Request
          <Search className="w-3.5 h-3.5 text-gray-400 transition-colors group-hover:text-gray-600" />
        </Link>
      </motion.div>

      {/* Meta */}
      <motion.div
        variants={fadeUp}
        className="mt-10 flex items-center gap-4 text-[11px] text-gray-300 font-medium tracking-wide"
      >
        <span>86+ Services</span>
        <span className="w-px h-3 bg-gray-200" />
        <span>11 Categories</span>
        <span className="w-px h-3 bg-gray-200" />
        <span>GCC-wide</span>
      </motion.div>
    </motion.div>
  );
}
