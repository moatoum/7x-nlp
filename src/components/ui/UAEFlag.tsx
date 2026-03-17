'use client';

import { useEffect, useRef } from 'react';

/**
 * Canvas-based animated waving UAE flag.
 * Draws the flag column-by-column with sine-wave deformation and
 * brightness modulation for a realistic cloth / ripple look.
 * Zero external dependencies.
 */
export function UAEFlag({ width = 260, height = 140 }: { width?: number; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = (height + 20) * dpr; // extra room for wave displacement
    ctx.scale(dpr, dpr);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId: number;
    let time = 0;

    /* ── UAE official colours ── */
    const RED   = [206, 17, 38]  as const; // #CE1126
    const GREEN = [0, 150, 57]   as const; // #009639
    const WHITE = [255, 255, 255] as const;
    const BLACK = [0, 0, 0]      as const;

    /* ── flag geometry ── */
    const redBandW    = width * 0.25;
    const stripeH     = height / 3;
    const colStep     = 1.5;           // px per column — smaller = smoother

    /* ── wave parameters ── */
    const speed1  = reduced ? 0.4 : 1.5;
    const speed2  = reduced ? 0.25 : 1.1;
    const amp1    = reduced ? 2 : 7;
    const amp2    = reduced ? 1 : 4;
    const freq1   = 0.035;
    const freq2   = 0.018;

    /* smooth 0→1 ramp so the hoist edge stays fixed */
    const attach = (x: number) => {
      const t = Math.min(1, x / (width * 0.12));
      return t * t * (3 - 2 * t); // smoothstep
    };

    const rgbStr = (r: number, g: number, b: number) => `rgb(${r},${g},${b})`;

    const shade = (base: readonly [number, number, number], factor: number): string => {
      const r = Math.min(255, Math.max(0, Math.round(base[0] * factor)));
      const g = Math.min(255, Math.max(0, Math.round(base[1] * factor)));
      const b = Math.min(255, Math.max(0, Math.round(base[2] * factor)));
      return rgbStr(r, g, b);
    };

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height + 20);

      const yPad = 10; // vertical padding so wave doesn't clip

      for (let x = 0; x < width; x += colStep) {
        const a = attach(x);

        /* combined wave displacement */
        const wave = a * (
          amp1 * Math.sin(x * freq1 - time * speed1) +
          amp2 * Math.sin(x * freq2 - time * speed2 + 1.8)
        );

        /* height scaling (foreshortening at wave peaks) */
        const hScale = 1 - a * 0.04 * Math.abs(Math.cos(x * freq1 - time * speed1));

        /* brightness from wave slope — peaks lighter, troughs darker */
        const slope = a * (
          amp1 * freq1 * Math.cos(x * freq1 - time * speed1) +
          amp2 * freq2 * Math.cos(x * freq2 - time * speed2 + 1.8)
        );
        const brightness = 1 + slope * 0.035;

        const top = yPad + wave;
        const sH  = stripeH * hScale;
        const cw  = colStep + 0.5; // slight overlap to avoid gaps

        if (x < redBandW) {
          ctx.fillStyle = shade(RED, brightness);
          ctx.fillRect(x, top, cw, height * hScale);
        } else {
          ctx.fillStyle = shade(GREEN, brightness);
          ctx.fillRect(x, top, cw, sH);

          ctx.fillStyle = shade(WHITE, brightness);
          ctx.fillRect(x, top + sH, cw, sH);

          ctx.fillStyle = shade(BLACK, Math.max(0.15, brightness));
          ctx.fillRect(x, top + sH * 2, cw, sH);
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height: height + 20 }}
      className="drop-shadow-xl"
      aria-label="Animated United Arab Emirates flag"
      role="img"
    />
  );
}
