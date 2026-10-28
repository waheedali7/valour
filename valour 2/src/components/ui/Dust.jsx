'use client';
import { useEffect, useRef } from 'react';

// Slow-drifting specks of light. Pauses when off screen; static when motion is reduced.
export default function Dust({ count = 70, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const motes = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.00025 + 0.00005,
      alpha: Math.random() * 0.55 + 0.1,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        if (!still) {
          m.y -= m.speed;
          m.phase += 0.02;
          if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); }
        }
        ctx.beginPath();
        ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(205, 222, 255, ${m.alpha * (0.6 + 0.4 * Math.sin(m.phase))})`;
        ctx.fill();
      }
      if (visible && !still) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(frame);
    });

    resize();
    frame();
    io.observe(canvas);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
