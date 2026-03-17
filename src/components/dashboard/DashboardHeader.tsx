'use client';

import { useEffect, useState, useRef } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, Cloudy, ChevronDown, UserPlus } from 'lucide-react';
import { AlternatingLogo } from '@/components/ui/AlternatingLogo';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { LocaleLink } from '@/components/ui/LocaleLink';
import { useTranslation } from '@/i18n/LocaleProvider';

interface WeatherData {
  temp: number;
  code: number;
}

function getWeatherIcon(code: number) {
  if (code === 0 || code === 1) return <Sun className="w-[14px] h-[14px] text-amber-400" />;
  if (code === 2) return <Cloud className="w-[14px] h-[14px] text-gray-400" />;
  if (code === 3) return <Cloudy className="w-[14px] h-[14px] text-gray-400" />;
  if (code >= 51 && code <= 55) return <CloudDrizzle className="w-[14px] h-[14px] text-blue-400" />;
  if (code >= 61 && code <= 67) return <CloudRain className="w-[14px] h-[14px] text-blue-500" />;
  if (code >= 71 && code <= 77) return <CloudSnow className="w-[14px] h-[14px] text-blue-200" />;
  if (code >= 95) return <CloudLightning className="w-[14px] h-[14px] text-yellow-500" />;
  return <Sun className="w-[14px] h-[14px] text-amber-400" />;
}

function useDubaiTime(locale: string) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString(locale === 'ar' ? 'ar-AE' : 'en-US', {
          timeZone: 'Asia/Dubai',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [locale]);

  return time;
}

function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=25.2048&longitude=55.2708&current=temperature_2m,weather_code&timezone=Asia%2FDubai'
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            code: data.current.weather_code,
          });
        }
      })
      .catch(() => {});
  }, []);

  return weather;
}

function QuickLinks() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-gray-50 transition-colors"
      >
        {t('dashboard.quickLinks')}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute start-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-200/50 py-1.5 z-50">
          <LocaleLink
            href="/connect"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-900 font-medium hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            {t('dashboard.connectExpert')}
          </LocaleLink>
          <div className="mx-3 my-1 border-t border-gray-100" />
          <a
            href="https://7x.ae"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            {t('dashboard.about7x')}
          </a>
          <LocaleLink
            href="/services"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            {t('dashboard.availableServices')}
          </LocaleLink>
        </div>
      )}
    </div>
  );
}

export function DashboardHeader() {
  const { locale } = useTranslation();
  const time = useDubaiTime(locale);
  const weather = useWeather();

  return (
    <header className="h-14 flex items-center justify-between px-5 md:px-8 shrink-0">
      {/* Left — Quick Links */}
      <div className="w-[200px] flex items-center gap-2">
        <QuickLinks />
        <LanguageSwitcher />
      </div>

      {/* Center — Alternating Logo */}
      <AlternatingLogo />

      {/* Right — Weather + Time */}
      <div className="flex items-center justify-end gap-3 text-[12px] text-gray-400 w-[200px]">
        {weather && (
          <div className="flex items-center gap-1.5">
            {getWeatherIcon(weather.code)}
            <span className="font-medium">{weather.temp}&#176;C</span>
          </div>
        )}

        {time && (
          <>
            <span className="w-px h-3 bg-gray-200" />
            <span className="font-mono text-gray-500 font-medium tabular-nums">{time}</span>
          </>
        )}
      </div>
    </header>
  );
}
