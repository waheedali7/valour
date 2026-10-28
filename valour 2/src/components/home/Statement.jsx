'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { motionOK } from '@/lib/motion';

const STATEMENT =
  'Valour’s goal is to bring inspired designs within reach for all collectors and enthusiasts. Our focus is dimensionality, execution, and presence.';

const PILLARS = [
  { title: 'Dimensionality', body: 'Dials built in layers, so light always has somewhere to go.' },
  { title: 'Execution', body: 'Grade 5 titanium, sapphire crystal and an automatic movement.' },
  { title: 'Presence', body: 'Colour and form you notice from across the room.' },
];

export default function Statement() {
  const root = useRef(null);

  useGSAP(() => {
    if (!motionOK()) return;
    const q = gsap.utils.selector(root);
    gsap.fromTo(q('.statement__word'), { opacity: 0.12 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: q('.statement__text')[0], start: 'top 80%', end: 'bottom 45%', scrub: true },
    });
    gsap.fromTo(q('.statement__float'), { yPercent: 18, rotate: -9 }, {
      yPercent: -22, rotate: 5, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }, { scope: root });

  return (
    <section className="statement" id="our-watches" ref={root}>
      <img className="statement__float" src="/media/editorial/red-lume-cutout.webp" alt="" width="900" height="1600" loading="lazy" />
      <p className="eyebrow" data-reveal><span className="rule" />Chapter 02 — Our Watches</p>
      <p className="statement__text">
        {STATEMENT.split(' ').map((w, i) => (
          <span className="statement__word" key={i}>{w} </span>
        ))}
      </p>
      <div className="statement__pillars">
        {PILLARS.map((p, i) => (
          <div className="pillar" key={p.title} data-reveal>
            <span className="pillar__num">0{i + 1}</span>
            <h3 className="display">{p.title}</h3>
            <p>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
