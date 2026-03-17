'use client';

import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface WaveConfig {
  offset: number;
  amplitude: number;
  frequency: number;
  color: string;
  opacity: number;
}

/**
 * Transparent canvas overlay that renders animated glowing wave lines.
 * Designed to sit on top of the existing AuroraBackground, aligned towards
 * the bottom of the container.  Uses the 7X brand palette.
 */
export function WiresCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const targetMouseRef = useRef<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let animationId: number;
    let time = 0;

    // Brand-aligned wave palette — muted blues, grays, and a hint of indigo
    const wavePalette: WaveConfig[] = [
      { offset: 0,              amplitude: 50, frequency: 0.003,  color: 'rgba(0, 32, 245, 0.15)',   opacity: 0.18 }, // brand-blue
      { offset: Math.PI / 2,    amplitude: 65, frequency: 0.0026, color: 'rgba(99, 102, 241, 0.12)', opacity: 0.14 }, // indigo-500
      { offset: Math.PI,        amplitude: 40, frequency: 0.0034, color: 'rgba(148, 163, 184, 0.10)', opacity: 0.12 }, // slate-400
      { offset: Math.PI * 1.5,  amplitude: 55, frequency: 0.0022, color: 'rgba(0, 32, 245, 0.08)',   opacity: 0.10 }, // brand-blue lighter
      { offset: Math.PI * 2,    amplitude: 35, frequency: 0.004,  color: 'rgba(100, 116, 139, 0.07)', opacity: 0.08 }, // slate-500
    ];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouseInfluence  = prefersReducedMotion ? 8  : 50;
    const influenceRadius = prefersReducedMotion ? 140 : 280;
    const smoothing       = prefersReducedMotion ? 0.04 : 0.08;

    const resizeCanvas = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const recenterMouse = () => {
      const p: Point = { x: canvas.width / 2, y: canvas.height / 2 };
      mouseRef.current = p;
      targetMouseRef.current = p;
    };

    const handleResize = () => { resizeCanvas(); recenterMouse(); };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseLeave = () => recenterMouse();

    resizeCanvas();
    recenterMouse();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // The vertical center of the waves — pushed towards the end of the page
    const getWaveCenter = () => canvas.height * 0.82;

    const drawWave = (wave: WaveConfig) => {
      const waveCenter = getWaveCenter();
      ctx.save();
      ctx.beginPath();

      for (let x = 0; x <= canvas.width; x += 4) {
        const dx = x - mouseRef.current.x;
        const dy = waveCenter - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / influenceRadius);
        const mouseEffect = influence * mouseInfluence * Math.sin(time * 0.001 + x * 0.01 + wave.offset);

        const y =
          waveCenter +
          Math.sin(x * wave.frequency + time * 0.002 + wave.offset) * wave.amplitude +
          Math.sin(x * wave.frequency * 0.4 + time * 0.003) * (wave.amplitude * 0.45) +
          mouseEffect;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.lineWidth = 2;
      ctx.strokeStyle = wave.color;
      ctx.globalAlpha = wave.opacity;
      ctx.shadowBlur = 14;
      ctx.shadowColor = wave.color;
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      time += 1;

      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * smoothing;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * smoothing;

      // Clear to transparent (no background fill — let the page bg show through)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      wavePalette.forEach(drawWave);

      animationId = window.requestAnimationFrame(animate);
    };

    animationId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
