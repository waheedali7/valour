'use client';
import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { motionOK } from '@/lib/motion';
import { scroller } from '@/lib/scroll';
import { Logo } from '@/components/ui/Icons';

const CRITICAL = ['/media/watch/astral-blue.webp', '/media/sequence/0001.webp'];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const loadImage = (src) => new Promise((r) => { const img = new Image(); img.onload = img.onerror = r; img.src = src; });

// The intro plays once per visit; coming back to the home page from another page skips it.
let played = false;

export default function Preloader({ onDone }) {
  const root = useRef(null);
  const [gone, setGone] = useState(played);

  useGSAP(() => {
    if (played) { onDone(); return; }
    // Lock the page again in case the visit started on another page.
    document.documentElement.classList.add('is-loading');
    scroller.lenis?.stop();

    const q = gsap.utils.selector(root);
    const num = q('.loader__num')[0];
    const count = { v: 0 };
    const render = () => { num.textContent = String(Math.round(count.v)).padStart(3, '0'); };
    let cancelled = false;

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    gsap.from(q('.logo__word .split__char'), { yPercent: 115, duration: 1.2, stagger: 0.06, ease: 'expo.out' });
    gsap.from(q('.logo__emblem'), { clipPath: 'inset(0% 50% 0% 50%)', opacity: 0, duration: 1.6, ease: 'expo.out', delay: 0.25 });
    const fill = gsap.to(count, { v: 88, duration: 2.6, ease: 'power2.out', onUpdate: render });

    const assets = Promise.all([document.fonts?.ready, ...CRITICAL.map(loadImage)]);
    Promise.all([Promise.race([assets, wait(5000)]), wait(motionOK() ? 1500 : 0)]).then(() => {
      if (cancelled) return;
      fill.kill();
      gsap.timeline({ onComplete: () => setGone(true) })
        .to(count, { v: 100, duration: 0.5, ease: 'power2.inOut', onUpdate: render })
        .to(q('.logo__word .split__char, .logo__emblem, .loader__num, .loader__meta'), {
          yPercent: -110, opacity: 0, duration: 0.7, stagger: 0.02, ease: 'expo.in',
        }, '+=0.1')
        .add(() => {
          played = true;
          document.documentElement.classList.remove('is-loading');
          scroller.lenis?.start();
          onDone();
        }, '-=0.15')
        .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.2, ease: 'expo.inOut' }, '<');
    });

    return () => { cancelled = true; };
  }, { scope: root });

  if (gone) return null;
  return (
    <div className="loader" ref={root} aria-hidden="true">
      <Logo className="loader__logo logo--brand" split />
      <p className="eyebrow loader__meta">Lucent Collection — Loading</p>
      <span className="loader__num">000</span>
    </div>
  );
}
