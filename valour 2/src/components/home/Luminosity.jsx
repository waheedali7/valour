'use client';
import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { motionOK } from '@/lib/motion';
import { WATCHES } from '@/data/watches';

export default function Luminosity() {
  const root = useRef(null);
  const imgsRef = useRef(null);
  const [variant, setVariant] = useState('astral-blue');

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    if (!motionOK()) {
      gsap.set(q('.lume__img--dark'), { opacity: 1 });
      return;
    }
    gsap.from(q('.lume__content > *'), {
      y: 40, opacity: 0, duration: 1.3, stagger: 0.08, ease: 'expo.out',
      scrollTrigger: { trigger: root.current, start: 'top 60%' },
    });
    // Scrolling through the pinned section "turns the lights off".
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: root.current, start: 'top top', end: '+=220%', scrub: 0.6, pin: true, anticipatePin: 1 },
    })
      .fromTo(q('.lume__img--light'), { scale: 1.12, filter: 'brightness(1)' }, { scale: 1, filter: 'brightness(0.15)', duration: 1 }, 0)
      .fromTo(q('.lume__img--dark'), { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 0.6 }, 0.3)
      .fromTo(q('.lume__knob'), { left: '0%' }, { left: '100%', duration: 1 }, 0)
      .to(q('.lume__title em'), { color: '#62f3df', duration: 0.4 }, 0.4)
      .to(q('.lume__state--light'), { opacity: 0, duration: 0.15 }, 0.45)
      .fromTo(q('.lume__state--dark'), { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.55);
  }, { scope: root });

  const choose = (slug) => {
    if (slug === variant) return;
    gsap.to(imgsRef.current, { opacity: 0, duration: 0.25, onComplete: () => setVariant(slug) });
  };
  const shown = () => gsap.to(imgsRef.current, { opacity: 1, duration: 0.6 });
  const current = WATCHES.find((w) => w.slug === variant);

  return (
    <section className="lume" id="luminosity" ref={root}>
      <div className="lume__imgs" ref={imgsRef}>
        <img className="lume__img lume__img--light" src={`/media/lume/${variant}-light.webp`}
          alt={`${current.name} dial in daylight`} width="2000" height="1125" loading="lazy" />
        <img className="lume__img lume__img--dark" src={`/media/lume/${variant}-lume.webp`}
          alt={`${current.name} dial glowing in the dark`} width="2000" height="1125" loading="lazy" onLoad={shown} />
      </div>
      <div className="lume__shade" aria-hidden="true" />

      <div className="lume__content">
        <p className="eyebrow lume__states">
          <span className="rule" />Chapter 04 —&nbsp;
          <span className="lume__swap">
            <span className="lume__state lume__state--light">In The Light</span>
            <span className="lume__state lume__state--dark">In The Dark</span>
          </span>
        </p>
        <h2 className="display lume__title">Multi-Layered<br /><em>Luminosity.</em></h2>
        <p className="lume__body">Enjoy lume in every dimension. Hands, markers and rings glow on separate levels, so the dial keeps its depth long after the lights go out.</p>
      </div>

      <div className="lume__meter eyebrow" aria-hidden="true">
        <span>Light</span><span className="lume__track"><i className="lume__knob" /></span><span>Dark</span>
      </div>

      <div className="lume__chips" role="group" aria-label="Choose a dial colour">
        {WATCHES.map((w) => (
          <button key={w.slug} type="button" className="chip" aria-pressed={variant === w.slug}
            aria-label={w.name} title={w.name} onClick={() => choose(w.slug)} style={{ '--sw': w.accent }}>
            <span />
          </button>
        ))}
      </div>
    </section>
  );
}
