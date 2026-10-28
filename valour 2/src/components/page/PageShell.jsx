'use client';
import { useEffect, useRef, useState } from 'react';
import { useReveals } from '@/lib/reveals';
import { scroller } from '@/lib/scroll';
import Nav from '@/components/home/Nav';
import Footer from '@/components/home/Footer';

/** Frame for pages other than home: nav, footer, shared reveals and a short curtain instead of the preloader. */
export default function PageShell({ children }) {
  const root = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // The root layout starts every visit locked for the home preloader; other pages open straight away.
    document.documentElement.classList.remove('is-loading');
    scroller.lenis?.start();
    scroller.lenis?.scrollTo(0, { immediate: true, force: true });
    // Lift the curtain a frame later, once the reveal start states are applied.
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useReveals(root);

  return (
    <>
      <div className={`curtain${ready ? ' is-lifted' : ''}`} aria-hidden="true" />
      <noscript><style>{'.curtain { display: none; }'}</style></noscript>
      <Nav ready={ready} />
      <main ref={root}>{children}</main>
      <Footer />
    </>
  );
}
