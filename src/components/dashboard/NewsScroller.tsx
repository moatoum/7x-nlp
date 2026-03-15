'use client';

import { motion, type Variants } from 'framer-motion';

const NEWS_DATA = [
  {
    title: 'UAE Launches Smart Logistics Corridor Connecting Three Emirates',
    excerpt:
      'New AI-powered logistics infrastructure connecting Dubai, Abu Dhabi, and Sharjah promises 40% faster delivery times for cross-emirate shipments.',
    date: 'Mar 10',
    category: 'Infrastructure',
    gradient: 'from-blue-600 via-blue-500 to-cyan-400',
    icon: '🏗️',
  },
  {
    title: 'E-Commerce Boom Drives Record Cold Chain Investment in GCC',
    excerpt:
      'Cold chain logistics market projected to reach $8.5B by 2027, driven by online grocery and pharmaceutical delivery expansion across the region.',
    date: 'Mar 6',
    category: 'Market Trends',
    gradient: 'from-emerald-600 via-emerald-500 to-teal-400',
    icon: '📦',
  },
  {
    title: "Saudi Arabia's NEOM Reveals Autonomous Logistics Zone Plans",
    excerpt:
      'The $500B megacity project unveils plans for a fully autonomous logistics zone with drone delivery networks and AI-powered warehousing.',
    date: 'Feb 28',
    category: 'Innovation',
    gradient: 'from-violet-600 via-purple-500 to-fuchsia-400',
    icon: '🤖',
  },
  {
    title: 'Oman Announces Three New Free Trade Zones for Cross-Border Logistics',
    excerpt:
      'Strategic free zones in Duqm, Sohar, and Salalah aim to position Oman as a key trade corridor between Asia and Africa.',
    date: 'Feb 20',
    category: 'Trade Policy',
    gradient: 'from-amber-600 via-orange-500 to-yellow-400',
    icon: '🌍',
  },
  {
    title: 'Qatar Hamad International Posts Record Air Cargo Throughput',
    excerpt:
      'Doha hub processed 2.8M tonnes in 2025, cementing its position as the fastest-growing air cargo gateway in the Middle East.',
    date: 'Feb 14',
    category: 'Air Cargo',
    gradient: 'from-rose-600 via-pink-500 to-red-400',
    icon: '✈️',
  },
];

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, delay: 0.4 } },
};

export function NewsScroller() {
  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={fadeIn}
      className="pb-4"
    >
      <div className="px-6 md:px-8 mb-5 flex items-center justify-between">
        <h2 className="text-[13px] font-medium text-gray-400 uppercase tracking-widest">
          Latest in GCC Logistics
        </h2>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-5 px-6 md:px-8 pb-3 min-w-min">
          {NEWS_DATA.map((news) => (
            <article
              key={news.title}
              className="w-[320px] shrink-0 bg-white rounded-2xl border border-gray-100/80 overflow-hidden hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-300 cursor-default group"
            >
              {/* Thumbnail */}
              <div
                className={`h-[140px] bg-gradient-to-br ${news.gradient} relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/5" />
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 right-4 w-24 h-24 rounded-full border-2 border-white/30" />
                  <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full border-2 border-white/20" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/10" />
                </div>
                {/* Icon */}
                <div className="absolute bottom-4 left-5 text-3xl drop-shadow-sm">
                  {news.icon}
                </div>
                {/* Category badge */}
                <div className="absolute top-4 left-5">
                  <span className="text-[11px] font-semibold text-white/90 uppercase tracking-wider">
                    {news.category}
                  </span>
                </div>
                {/* Date */}
                <div className="absolute top-4 right-5">
                  <span className="text-[11px] text-white/70 font-medium">
                    {news.date}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-[14px] font-semibold text-gray-900 tracking-tight leading-snug line-clamp-2 group-hover:text-gray-700 transition-colors">
                  {news.title}
                </h3>
                <p className="text-[13px] text-gray-400 mt-2.5 line-clamp-2 leading-relaxed">
                  {news.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
