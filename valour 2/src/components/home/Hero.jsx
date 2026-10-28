'use client';
import { useEffect, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { motionOK } from '@/lib/motion';
import { scrollToId } from '@/lib/scroll';
import SplitChars from '@/components/ui/SplitChars';
import Dust from '@/components/ui/Dust';
import { ArrowIcon } from '@/components/ui/Icons';

export default function Hero({ ready }) {
  const root = useRef(null);
  const intro = useRef(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);

    // Entrance, played once the preloader lifts. Inner elements are animated here and
    // their wrappers by the scroll timeline below, so the two never fight.
    intro.current = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
      .fromTo(q('.hero__video'), { opacity: 0, scale: 1.25 }, { opacity: 0.3, scale: 1, duration: 2.6, ease: 'power2.out' }, 0)
      .fromTo(q('.hero__beam'), { opacity: 0 }, { opacity: 1, duration: 2.4, ease: 'power2.out' }, 0.2)
      .from(q('.hero__line--back .split__char'), { yPercent: 115, duration: 1.5, stagger: 0.05 }, 0.15)
      // Swings in from the top-right corner and settles into the CSS resting tilt.
      .from(q('.hero__watch-inner'), { xPercent: 60, yPercent: -90, opacity: 0, rotate: 36, scale: 0.9, duration: 2.2 }, 0.3)
      .from(q('.hero__line--front .split__char'), { yPercent: 115, duration: 1.5, stagger: 0.028 }, 0.6)
      .from(q('[data-hero-fade]'), { opacity: 0, y: 18, duration: 1.2, stagger: 0.08, ease: 'power3.out' }, 1.1);

    if (!motionOK()) return;
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.4 },
    })
      .to(q('.hero__watch'), { yPercent: -12, scale: 1.14, rotate: 7 }, 0)
      .to(q('.hero__line--back'), { xPercent: -14 }, 0)
      .to(q('.hero__line--front'), { xPercent: 9 }, 0)
      .to(q('.hero__fade'), { opacity: 0, y: -40 }, 0)
      .to(q('.hero__media'), { scale: 1.18 }, 0);
  }, { scope: root });

  useEffect(() => {
    if (ready) intro.current?.play();
  }, [ready]);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__media" aria-hidden="true">
        <video className="hero__video" src="/media/video/hero.mp4" autoPlay muted loop playsInline preload="auto" />
      </div>
      <div className="hero__beam" aria-hidden="true"><i /></div>
      <Dust className="hero__dust" />

      <h1 className="hero__title">
        <span className="hero__line hero__line--back"><SplitChars text="Light In" /></span>
        <span className="hero__line hero__line--front"><SplitChars text="Every Dimension." /></span>
      </h1>

      <div className="hero__watch-pos" aria-hidden="true">
        <div className="hero__watch">
          <div className="hero__watch-inner">
            <img src="/media/watch/astral-blue.webp" alt="" width="1100" height="1359" fetchPriority="high" />
          </div>
        </div>
      </div>

      <div className="hero__aside hero__fade">
        <p className="eyebrow" data-hero-fade><span className="rule" />Lucent Collection — 01</p>
        <p className="hero__sub" data-hero-fade>
          Inspired design that&rsquo;s within reach. Grade 5 titanium, an automatic heart and a dial built to catch the light.
        </p>
        <button type="button" className="btn" data-hero-fade onClick={() => scrollToId('lucent')}>
          Discover Lucent <ArrowIcon />
        </button>
      </div>

      {/* The entrance animates the children; scrolling fades the bar itself, so they never conflict. */}
      <div className="hero__foot hero__fade">
        <span data-hero-fade>Ref L-01 · Astral Blue</span>
        <span className="hero__scroll" data-hero-fade>Scroll to illuminate<i /></span>
        <span data-hero-fade>40mm · Automatic</span>
      </div>
    </section>
  );
}
