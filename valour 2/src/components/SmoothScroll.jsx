'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { motionOK } from '@/lib/motion';
import { scroller } from '@/lib/scroll';

export default function SmoothScroll({ children }) {
  useEffect(() => {
    if (!motionOK()) return;
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    scroller.lenis = lenis;
    // The preloader keeps the page locked until the first screen is ready.
    if (document.documentElement.classList.contains('is-loading')) lenis.stop();

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      scroller.lenis = null;
    };
  }, []);

  return children;
}
