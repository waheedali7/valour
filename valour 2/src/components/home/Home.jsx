'use client';
import { useCallback, useRef, useState } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { useReveals } from '@/lib/reveals';
import { scrollToId } from '@/lib/scroll';
import Preloader from './Preloader';
import Nav from './Nav';
import Hero from './Hero';
import Sequence from './Sequence';
import Statement from './Statement';
import Titanium from './Titanium';
import Luminosity from './Luminosity';
import Collection from './Collection';
import Configurator from './Configurator';
import Gallery from './Gallery';
import Film from './Film';
import Founders from './Founders';
import FinalCta from './FinalCta';
import Footer from './Footer';

export default function Home() {
  const root = useRef(null);
  const [ready, setReady] = useState(false);

  const handleLoaded = useCallback(() => {
    setReady(true);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      // Arriving from another page via a section link such as /#configure.
      const id = window.location.hash.slice(1);
      if (id) scrollToId(id, { immediate: true });
    });
  }, []);

  useReveals(root);

  return (
    <>
      <Preloader onDone={handleLoaded} />
      <Nav ready={ready} />
      <main ref={root}>
        <Hero ready={ready} />
        <Sequence />
        <Statement />
        <Titanium />
        <Luminosity />
        <Collection />
        <Configurator />
        <Gallery />
        <Film />
        <Founders />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
