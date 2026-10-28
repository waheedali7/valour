'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { motionOK } from '@/lib/motion';

export default function Film() {
  const root = useRef(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const video = q('video')[0];
    // Only play while on screen.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.05 });
    io.observe(video);

    if (!motionOK()) {
      gsap.set(q('.film__frame'), { clipPath: 'inset(0% 0% 0% 0% round 0px)' });
      gsap.set(q('.film__caption'), { opacity: 1 });
      return () => io.disconnect();
    }
    // The film opens from a small window to full screen as you scroll.
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: root.current, start: 'top top', end: '+=170%', scrub: 0.6, pin: true, anticipatePin: 1 },
    })
      .fromTo(q('.film__frame'), { clipPath: 'inset(24% 30% 24% 30% round 18px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.6 }, 0)
      .fromTo(q('.film__title'), { scale: 1, opacity: 1 }, { scale: 1.3, opacity: 0, duration: 0.35 }, 0.35)
      .fromTo(q('.film__caption'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.2 }, 0.72);

    return () => io.disconnect();
  }, { scope: root });

  return (
    <section className="film" ref={root} aria-label="Valour film">
      <div className="film__frame">
        <video src="/media/video/film.mp4" muted loop playsInline preload="metadata" aria-hidden="true" />
      </div>
      <div className="film__title" aria-hidden="true">
        <h2 className="display">Bold<br /><em>For Everyone.</em></h2>
      </div>
      <p className="film__caption">
        Valour&rsquo;s vision for the modern enthusiast is to bring bold, inspired design to life at an accessible price.
      </p>
    </section>
  );
}
