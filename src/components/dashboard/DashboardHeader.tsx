'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, Cloudy } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

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

function useDubaiTime() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
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
  }, []);

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

export function DashboardHeader() {
  const time = useDubaiTime();
  const weather = useWeather();

  const date = new Date().toLocaleDateString('en-US', {
    timeZone: 'Asia/Dubai',
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="h-14 flex items-center justify-between px-5 md:px-8 shrink-0">
      {/* Left — Logo + brand */}
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-[10px] bg-black flex items-center justify-center">
          <Logo className="w-[20px] h-[12px]" color="white" />
        </div>
        <span className="text-[14px] font-semibold text-gray-900 tracking-tight">7X</span>
        <span className="hidden sm:inline text-[12px] text-gray-300 font-medium">Logistics</span>
      </Link>

      {/* Right — Date + Weather + Time */}
      <div className="flex items-center gap-3 text-[12px] text-gray-400">
        <span className="hidden md:inline">{date}</span>

        {weather && (
          <>
            <span className="hidden md:inline w-px h-3 bg-gray-200" />
            <div className="flex items-center gap-1.5">
              {getWeatherIcon(weather.code)}
              <span className="font-medium">{weather.temp}&#176;C</span>
            </div>
          </>
        )}

        {time && (
          <>
            <span className="w-px h-3 bg-gray-200" />
            <span className="font-mono text-gray-500 font-medium tabular-nums">{time}</span>
          </>
        )}

        <span className="text-[11px] text-gray-300 hidden sm:inline">Dubai</span>
      </div>
    </header>
  );
}
