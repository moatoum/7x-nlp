'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { NewsItem } from '@/app/api/news/route';

function timeAgoShort(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  if (isNaN(then)) return '';
  const diffH = Math.floor((now - then) / 3600000);
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return 'Yesterday';
  if (diffD < 7) return `${diffD}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/news')
      .then((res) => res.json())
      .then((data) => {
        // Only keep items with images
        const withImages = (data.items || []).filter((item: NewsItem) => item.image);
        setNews(withImages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Auto-scroll animation
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || news.length === 0) return;

    let animationId: number;
    let speed = 0.5; // px per frame

    const step = () => {
      if (!paused && el) {
        el.scrollLeft += speed;
        // Loop back when reaching the end of the first set
        const halfWidth = el.scrollWidth / 2;
        if (el.scrollLeft >= halfWidth) {
          el.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [news, paused]);

  if (loading) {
    return (
      <div className="px-6 md:px-8 py-8">
        <div className="h-3 w-28 bg-gray-200 rounded animate-pulse mb-5" />
        <div className="flex gap-4 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-[280px] shrink-0 rounded-xl bg-white border border-gray-100 overflow-hidden">
              <div className="h-[140px] bg-gray-100 animate-pulse" />
              <div className="p-4">
                <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-1/3 bg-gray-50 rounded animate-pulse mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (news.length === 0) return null;

  // Duplicate items for seamless infinite scroll
  const displayItems = [...news, ...news];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="py-6"
    >
      <div className="px-6 md:px-8 mb-4">
        <h2 className="text-[12px] font-medium text-gray-400 uppercase tracking-[0.08em]">
          Logistics News
        </h2>
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="flex gap-3.5 px-6 md:px-8 pb-2 w-max">
          {displayItems.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[280px] shrink-0 bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-md hover:shadow-black/[0.04] transition-all group"
            >
              {/* Thumbnail */}
              <div className="h-[140px] bg-gray-50 overflow-hidden">
                <img
                  src={item.image!}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-3.5 pb-4">
                <h3 className="text-[13px] font-semibold text-gray-800 leading-[1.45] line-clamp-2 group-hover:text-gray-900 transition-colors">
                  {item.title}
                </h3>

                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium truncate max-w-[160px]">
                    {item.source}
                  </span>
                  <span className="text-[11px] text-gray-300 shrink-0">
                    {timeAgoShort(item.pubDate)}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
