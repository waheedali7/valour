'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import { scroller, scrollToId } from '@/lib/scroll';
import { Logo } from '@/components/ui/Icons';
import { BookButton } from '@/components/appointment/Appointment';

// Home page sections (scrolled to in place) and separate pages.
const LINKS = [
  { id: 'lucent', label: 'Lucent' },
  { id: 'titanium', label: 'Titanium' },
  { id: 'luminosity', label: 'Luminosity' },
  { id: 'collection', label: 'Collection' },
  { id: 'configure', label: 'Configure' },
  { id: 'founders', label: 'Founders' },
  { id: '/about', label: 'About', page: true },
  { id: '/servicing', label: 'Servicing', page: true },
  // The desktop bar reaches the shop through its button; the menu lists it.
  { id: '/shop', label: 'Shop', page: true, menuOnly: true },
];

export default function Nav({ ready }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [section, setSection] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const listRef = useRef(null);
  const indicatorRef = useRef(null);
  const active = isHome ? section : pathname;

  // Hide the bar while scrolling down, bring it back on any scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const delta = y - lastY;
      if (Math.abs(delta) < 6) return; // ignore tiny jitters; small moves accumulate
      setHidden(delta > 0 && y > 120);
      lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track which section is in the middle of the screen. Created once the page has
  // loaded so the pinned sections already have their final spacing.
  useGSAP(() => {
    if (!ready || !isHome) return;
    LINKS.forEach(({ id, page }) => {
      if (page) return;
      const el = document.getElementById(id);
      if (!el) return;
      const trigger = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el;
      ScrollTrigger.create({
        trigger, start: 'top 50%', end: 'bottom 50%',
        onToggle: (self) => setSection((current) => (self.isActive ? id : current === id ? null : current)),
      });
    });
  }, { dependencies: [ready, isHome] });

  useEffect(() => {
    const bar = indicatorRef.current;
    const link = active && listRef.current?.querySelector(`[data-id="${active}"]`);
    if (!bar) return;
    if (link) {
      bar.style.width = `${link.offsetWidth}px`;
      bar.style.transform = `translateX(${link.offsetLeft}px)`;
      bar.style.opacity = '1';
    } else {
      bar.style.opacity = '0';
    }
  }, [active]);

  useEffect(() => {
    if (document.documentElement.classList.contains('is-loading')) return;
    if (open) scroller.lenis?.stop();
    else scroller.lenis?.start();
  }, [open]);

  const hrefFor = (link) => (link.page ? link.id : isHome ? `#${link.id}` : `/#${link.id}`);

  // On the home page, sections scroll in place; everywhere else links navigate normally.
  const go = (event, link) => {
    setOpen(false);
    if (link.page || !isHome) return;
    event.preventDefault();
    scrollToId(link.id);
  };

  return (
    <header className={`nav${ready ? ' is-ready' : ''}${scrolled ? ' is-scrolled' : ''}${hidden && !open ? ' is-hidden' : ''}${open ? ' is-open' : ''}`}>
      <Link href={isHome ? '#top' : '/'} className="nav__brand" onClick={(e) => go(e, { id: 'top' })}
        aria-label={isHome ? 'Valour, back to top' : 'Valour home'}>
        <Logo className="nav__logo" />
      </Link>

      <nav aria-label="Main">
        <ul className="nav__links" ref={listRef}>
          {LINKS.filter((link) => !link.menuOnly).map((link) => (
            <li key={link.id}>
              <Link href={hrefFor(link)} data-id={link.id} onClick={(e) => go(e, link)}
                aria-current={link.page && pathname === link.id ? 'page' : undefined}
                className={`nav__link${active === link.id ? ' is-active' : ''}`}>
                {link.label}
              </Link>
            </li>
          ))}
          <li className="nav__indicator" ref={indicatorRef} aria-hidden="true" />
        </ul>
      </nav>

      <Link href="/shop" className="btn btn--sm nav__cta" aria-current={pathname === '/shop' ? 'page' : undefined}>
        Shop Lucent
      </Link>
      <button type="button" className="nav__menu" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
        {open ? 'Close' : 'Menu'}
      </button>

      <div className="menu" id="menu" hidden={!open} data-lenis-prevent>
        <ul>
          {LINKS.map((link, i) => (
            <li key={link.id}>
              <Link href={hrefFor(link)} onClick={(e) => go(e, link)}>
                <span>0{i + 1}</span>{link.label}
              </Link>
            </li>
          ))}
        </ul>
        <BookButton className="btn btn--solid menu__book" onClick={() => setOpen(false)} />
      </div>
    </header>
  );
}
