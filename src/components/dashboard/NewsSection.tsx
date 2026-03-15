'use client';

import { motion, type Variants } from 'framer-motion';
import { NewsCard } from './NewsCard';

const NEWS_DATA = [
  {
    title: 'UAE Launches Smart Logistics Corridor',
    excerpt:
      'New AI-powered logistics infrastructure connecting Dubai, Abu Dhabi, and Sharjah promises 40% faster delivery times for cross-emirate shipments.',
    date: 'Mar 10, 2026',
    category: 'Infrastructure',
  },
  {
    title: 'E-Commerce Growth Drives Cold Chain Demand',
    excerpt:
      'GCC cold chain logistics market projected to reach $8.5B by 2027, driven by online grocery and pharmaceutical delivery expansion.',
    date: 'Mar 6, 2026',
    category: 'Market Trends',
  },
  {
    title: "Saudi Arabia's NEOM Logistics Hub Takes Shape",
    excerpt:
      'The $500B megacity project reveals plans for an autonomous logistics zone with drone delivery and AI-powered warehousing.',
    date: 'Feb 28, 2026',
    category: 'Innovation',
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function NewsSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
          GCC Logistics Insights
        </h2>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {NEWS_DATA.map((news) => (
          <motion.div key={news.title} variants={item}>
            <NewsCard
              title={news.title}
              excerpt={news.excerpt}
              date={news.date}
              category={news.category}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
