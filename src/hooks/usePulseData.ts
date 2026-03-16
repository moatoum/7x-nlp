'use client';

import { useEffect, useCallback, useRef, useMemo } from 'react';
import { usePulseStore } from '@/store/pulseStore';
import { buildPulseEvents } from '@/lib/buildPulseEvents';
import type { PulseEvent } from '@/lib/pulse-types';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function usePulseData() {
  const store = usePulseStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMaritime = useCallback(async () => {
    store.setMaritime({ loading: true, error: null });
    try {
      const res = await fetch('/api/pulse/maritime');
      const data = await res.json();
      if (data.error && data.vessels.length === 0) {
        store.setMaritime({ data: [], loading: false, error: data.error });
      } else {
        store.setMaritime({ data: data.vessels || [], loading: false, error: null });
      }
    } catch {
      store.setMaritime({ data: [], loading: false, error: 'Failed to fetch maritime data' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAviation = useCallback(async () => {
    store.setAviation({ loading: true, error: null });
    try {
      const res = await fetch('/api/pulse/aviation');
      const data = await res.json();
      if (data.error && data.flights.length === 0) {
        store.setAviation({ data: [], loading: false, error: data.error });
      } else {
        store.setAviation({ data: data.flights || [], loading: false, error: null });
      }
    } catch {
      store.setAviation({ data: [], loading: false, error: 'Failed to fetch aviation data' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNews = useCallback(async () => {
    store.setNews({ loading: true, error: null });
    try {
      const res = await fetch('/api/pulse/news');
      const data = await res.json();
      if (data.error && data.articles.length === 0) {
        store.setNews({ data: [], loading: false, error: data.error });
      } else {
        store.setNews({ data: data.articles || [], loading: false, error: null });
      }
    } catch {
      store.setNews({ data: [], loading: false, error: 'Failed to fetch news' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = useCallback(async () => {
    await Promise.allSettled([fetchMaritime(), fetchAviation(), fetchNews()]);
    store.setLastRefreshed(Date.now());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchMaritime, fetchAviation, fetchNews]);

  useEffect(() => {
    refresh();

    intervalRef.current = setInterval(refresh, REFRESH_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refresh]);

  return { refresh };
}

/** Merged + filtered timeline events */
export function usePulseEvents(): { events: PulseEvent[]; loading: boolean } {
  const maritime = usePulseStore((s) => s.maritime);
  const aviation = usePulseStore((s) => s.aviation);
  const news = usePulseStore((s) => s.news);
  const activeFilter = usePulseStore((s) => s.activeFilter);

  const loading = maritime.loading && aviation.loading && news.loading;

  const events = useMemo(() => {
    const all = buildPulseEvents(maritime.data, aviation.data, news.data);

    if (activeFilter === 'all') return all;
    if (activeFilter === 'disruptions') return all.filter((e) => e.severity === 'warning' || e.severity === 'critical');
    if (activeFilter === 'flights') return all.filter((e) => e.category === 'Aviation');
    if (activeFilter === 'maritime') return all.filter((e) => e.category === 'Maritime');
    if (activeFilter === 'news') return all.filter((e) => e.category === 'Industry News');
    return all;
  }, [maritime.data, aviation.data, news.data, activeFilter]);

  return { events, loading };
}
