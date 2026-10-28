'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { WATCHES, PRICE } from '@/data/watches';
import { scrollToId } from '@/lib/scroll';
import SplitChars from '@/components/ui/SplitChars';
import { ArrowIcon } from '@/components/ui/Icons';

export default function Collection() {
  const root = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();
    // Desktop: the row of watches slides sideways while the section is pinned.
    // Phones keep a native swipeable row instead.
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const track = trackRef.current;
      const bar = q('.col__progress i')[0];
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const slide = gsap.to(track, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: {
          trigger: pinRef.current, start: 'top top', end: () => `+=${distance()}`,
          scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
        },
      });
      q('.col__card').forEach((card) => {
        gsap.fromTo(card.querySelector('.col__watch'), { rotate: -10, xPercent: 6 }, {
          rotate: 8, xPercent: -6, ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
        });
      });
    });
  }, { scope: root });

  return (
    <section className="col" id="collection" ref={root}>
      <div className="col__head">
        <div>
          <p className="eyebrow" data-reveal><span className="rule" />Chapter 05 — The Collection</p>
          <h2 className="display col__title" data-split>
            <SplitChars text="Vibrant Colors" /><br />
            <em><SplitChars text="Inspired By Light" /></em><br />
            <em><SplitChars text="And Nature." /></em>
          </h2>
        </div>
        <p className="col__intro" data-reveal>
          Six dials, one Grade 5 titanium case. Each colour is drawn from a moment of natural light,
          from blue hour to the last of the sun.
        </p>
      </div>

      <div className="col__pin" ref={pinRef}>
        <div className="col__track" ref={trackRef}>
          {WATCHES.map((w, i) => (
            <article className="col__card" key={w.slug} style={{ '--c-accent': w.accent, '--c-glow': w.glow }}>
              <div className="col__glow" aria-hidden="true" />
              <span className="col__num">0{i + 1} / 06</span>
              <div className="col__stage">
                <img className="col__watch" src={`/media/watch/${w.slug}.webp`} alt={`Valour Lucent in ${w.name}`}
                  width="1100" height="1359" loading="lazy" />
              </div>
              <div className="col__meta">
                <h3 className="display">{w.name}</h3>
                <p>{w.note}</p>
                <div className="col__row">
                  <span className="col__price">{PRICE}</span>
                  <a href="#configure" className="col__link" onClick={(e) => { e.preventDefault(); scrollToId('configure'); }}>
                    Configure <ArrowIcon />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="col__progress" aria-hidden="true"><i /></div>
      </div>
    </section>
  );
}
