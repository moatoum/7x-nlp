'use client';

import { motion, type Variants } from 'framer-motion';
import { SERVICE_CATALOG, CATEGORY_LABELS } from '@/engine/catalog';
import { FeatureCard } from './FeatureCard';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function getServiceCountsByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const service of SERVICE_CATALOG) {
    counts[service.category] = (counts[service.category] || 0) + 1;
  }
  return counts;
}

export function FeatureGrid() {
  const counts = getServiceCountsByCategory();
  const categories = Object.entries(CATEGORY_LABELS);

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">What We Move</h2>
        <p className="text-gray-500 mt-2 text-[15px]">
          Across 11 categories, we offer end-to-end logistics solutions
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {categories.map(([key, label]) => (
          <motion.div key={key} variants={item}>
            <FeatureCard
              categoryKey={key}
              categoryLabel={label}
              serviceCount={counts[key] || 0}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
