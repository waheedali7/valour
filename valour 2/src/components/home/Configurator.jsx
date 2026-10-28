'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { motionOK } from '@/lib/motion';
import { CASES, DIALS, STRAPS, PRICE, STRAP_PRICE } from '@/data/watches';
import SplitChars from '@/components/ui/SplitChars';
import { ArrowIcon } from '@/components/ui/Icons';
import { BookButton } from '@/components/appointment/Appointment';

// Rendered layers share one canvas and stack strap → case → dial.
const layerSrc = (kind, id) => `/media/config/${kind}/${id}.webp`;
const LAYERS = [['strap', STRAPS], ['case', CASES], ['dial', DIALS]];
const INITIAL = { case: 'silver', dial: 'red', strap: 'grey-red' };

// Played while the section is pinned: one part changes per step, showing what can be configured.
const DEMO = [['case', 'black'], ['dial', 'mint'], ['strap', 'black-silver'], ['case', 'gold']];
const DEMO_STEPS = DEMO.reduce((steps, [kind, id]) => [...steps, { ...steps.at(-1), [kind]: id }], [INITIAL]);

// How each part arrives and leaves. Straps slide down through the lugs, cases glide in
// from the side, and dials drop in from the camera, spinning onto the front view.
const FX = {
  strap: { from: { yPercent: -16, scale: 1.05 }, exit: { yPercent: 14, scale: 0.97 } },
  case: { from: { xPercent: 20, rotate: 6, scale: 1.06 }, exit: { xPercent: -16, rotate: -4, scale: 0.96 } },
  dial: { from: { scale: 1.8, rotate: -24 }, exit: { scale: 0.6, rotate: 20 }, origin: '25% 45%' },
};

function Group({ label, value, demo, children }) {
  return (
    <div className={`cfg__group${demo ? ' is-demo' : ''}`} data-reveal>
      <div className="cfg__label"><span>{label}</span><span>{value}</span></div>
      <div className="cfg__chips" role="group" aria-label={`${label} colour`}>{children}</div>
    </div>
  );
}

export default function Configurator() {
  const root = useRef(null);
  const [pick, setPick] = useState(INITIAL);
  // Mirrors `pick` so the scroll demo (created once) always sees the current selection.
  const pickRef = useRef(INITIAL);
  // Once the visitor picks something themselves, the scroll demo stops changing the watch.
  const touched = useRef(false);
  const [demoKind, setDemoKind] = useState(null);
  // Every image currently on screen per layer: the settled part plus any still detaching.
  const [shown, setShown] = useState(() => Object.fromEntries(LAYERS.map(([kind]) => [kind, [{ id: INITIAL[kind], uid: kind }]])));
  const seq = useRef(0);
  const pending = useRef([]);
  const leaving = useRef(new Set());
  const housing = CASES.find((c) => c.id === pick.case);
  const dial = DIALS.find((d) => d.id === pick.dial);
  const strap = STRAPS.find((s) => s.id === pick.strap);

  const drop = (kind, uid) => {
    leaving.current.delete(uid);
    setShown((s) => ({ ...s, [kind]: s[kind].filter((e) => e.uid !== uid) }));
  };

  const choose = (kind, id) => {
    if (pickRef.current[kind] === id) return;
    pickRef.current = { ...pickRef.current, [kind]: id };
    setPick(pickRef.current);
    const entry = { id, uid: `${kind}-${++seq.current}` };
    if (!motionOK()) { setShown((s) => ({ ...s, [kind]: [entry] })); return; }
    pending.current.push({ kind, uid: entry.uid });
    setShown((s) => ({ ...s, [kind]: [...s[kind], entry] }));
  };

  const pickByHand = (kind, id) => {
    touched.current = true;
    setDemoKind(null);
    choose(kind, id);
  };

  // Cinematic swap: the old part detaches, the new one flies in, and the watch reacts as it locks on.
  useGSAP((_, contextSafe) => {
    const jobs = pending.current.splice(0);
    const q = gsap.utils.selector(root);
    jobs.forEach(({ kind, uid }) => {
      const incoming = q(`[data-uid="${uid}"]`)[0];
      if (!incoming) return;
      const slot = incoming.parentElement;
      const glint = slot.querySelector('.cfg__glint');
      const fx = FX[kind];
      const origin = fx.origin || '50% 50%';
      gsap.set(incoming, { opacity: 0 });

      const run = contextSafe(() => {
        // A newer pick may already have replaced this one while it was decoding.
        if (leaving.current.has(uid) || !incoming.isConnected) return;
        slot.querySelectorAll('.cfg__layer').forEach((el) => {
          const old = el.dataset.uid;
          if (el === incoming || leaving.current.has(old)) return;
          leaving.current.add(old);
          gsap.killTweensOf(el);
          gsap.to(el, {
            ...fx.exit, opacity: 0, filter: 'blur(10px)', transformOrigin: origin,
            duration: 0.6, ease: 'power2.in', onComplete: () => drop(kind, old),
          });
        });

        gsap.timeline({ delay: 0.15 })
          .fromTo(incoming,
            { ...fx.from, opacity: 0, filter: 'blur(18px) brightness(1.8)', transformOrigin: origin },
            { xPercent: 0, yPercent: 0, scale: 1, rotate: 0, opacity: 1, filter: 'blur(0px) brightness(1)',
              duration: 1.1, ease: 'expo.out', clearProps: 'transform,filter' }, 0)
          // The moment it locks on: a small jolt through the whole watch, a halo flare and a glint.
          .fromTo(q('.cfg__stack'), { scale: 0.975 },
            { scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.35)', immediateRender: false, overwrite: true }, 0.38)
          .fromTo(q('.cfg__halo'), { scale: 1.2 },
            { scale: 1, duration: 1.2, ease: 'power3.out', immediateRender: false, overwrite: true }, 0.38)
          .fromTo(glint, { opacity: 1, backgroundPosition: '100% 0' },
            { backgroundPosition: '0% 0', duration: 1, ease: 'power2.inOut', immediateRender: false, overwrite: true }, 0.3)
          .to(glint, { opacity: 0, duration: 0.3 }, '>-0.25');
      });

      // Wait until the new render is decoded so it never pops in mid-flight.
      if (incoming.decode) incoming.decode().then(run, run); else run();
    });
  }, { dependencies: [shown], scope: root });

  // Desktop: hold the section in place for one screen of scrolling, so picking parts
  // isn't interrupted by the page moving on. While held, scrolling swaps parts one at a
  // time (and back again when scrolling up) to show what can be configured.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      let step = 0;
      ScrollTrigger.create({
        trigger: root.current,
        // On very short screens the section can't fit; pin once the controls at the bottom are in view.
        start: () => (root.current.offsetHeight > window.innerHeight ? 'bottom bottom' : 'top top'),
        end: '+=100%',
        pin: true, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (touched.current) return;
          const next = Math.min(DEMO_STEPS.length - 1, Math.floor(self.progress * DEMO_STEPS.length));
          if (next === step) return;
          step = next;
          LAYERS.forEach(([kind]) => choose(kind, DEMO_STEPS[next][kind]));
          setDemoKind(next > 0 ? DEMO[next - 1][0] : null);
        },
        onToggle: (self) => { if (!self.isActive) setDemoKind(null); },
      });
    });
  }, { scope: root });

  // Warm the cache for every layer once the section is close, so each switch is instant.
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      LAYERS.forEach(([kind, options]) => options.forEach((o) => { const img = new Image(); img.src = layerSrc(kind, o.id); }));
    }, { rootMargin: '100% 0px' });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className="cfg" id="configure" ref={root} style={{ '--c-glow': dial.glow }}>
      <div className="cfg__visual">
        <div className="cfg__halo" aria-hidden="true" />
        <div className="cfg__stack" role="img"
          aria-label={`${dial.name} dial in a ${housing.name.toLowerCase()} case on a ${strap.name.toLowerCase()} strap, front and back`}>
          {LAYERS.map(([kind]) => (
            <div key={kind} className="cfg__slot">
              {shown[kind].map((e) => (
                <img key={e.uid} data-uid={e.uid} className="cfg__layer" src={layerSrc(kind, e.id)} alt=""
                  width="900" height="1311" loading="lazy" />
              ))}
              <span className="cfg__glint" aria-hidden="true" style={{ '--m': `url(${layerSrc(kind, pick[kind])})` }} />
            </div>
          ))}
        </div>
      </div>

      <div className="cfg__panel">
        <p className="eyebrow" data-reveal><span className="rule" />Chapter 06 — Make It Yours</p>
        <h2 className="display cfg__title" data-split>
          <SplitChars text="Case. Dial." />{' '}<em><SplitChars text="Strap." /></em>
        </h2>
        <p className="cfg__body" data-reveal>
          Three cases, ten dials and thirteen straps: 390 combinations. Build it layer by layer and see it front and back.
        </p>

        <Group label="Case" value={housing.name} demo={demoKind === 'case'}>
          {CASES.map((c) => (
            <button key={c.id} type="button" className="chip chip--lg chip--case" aria-pressed={pick.case === c.id}
              aria-label={`${c.name} case`} title={c.name} onClick={() => pickByHand('case', c.id)} style={{ '--sw': c.swatch }}>
              <span />
            </button>
          ))}
        </Group>

        <Group label="Dial" value={dial.name} demo={demoKind === 'dial'}>
          {DIALS.map((d) => (
            <button key={d.id} type="button" className="chip chip--lg" aria-pressed={pick.dial === d.id}
              aria-label={`${d.name} dial`} title={d.name} onClick={() => pickByHand('dial', d.id)} style={{ '--sw': d.swatch }}>
              <span />
            </button>
          ))}
        </Group>

        <Group label="Strap" value={`${strap.name} · ${strap.trim} trim`} demo={demoKind === 'strap'}>
          {STRAPS.map((s) => (
            <button key={s.id} type="button" className="chip chip--lg chip--strap" aria-pressed={pick.strap === s.id}
              aria-label={`${s.name} strap, ${s.trim.toLowerCase()} trim`} title={`${s.name} · ${s.trim} trim`}
              onClick={() => pickByHand('strap', s.id)} style={{ '--sw': `linear-gradient(${s.swatch} 0 64%, ${s.base} 64% 100%)` }}>
              <span />
            </button>
          ))}
        </Group>

        <div className="cfg__summary" data-reveal>
          <div>
            <p className="cfg__choice">{dial.name} <em>in {housing.name.toLowerCase()} on {strap.name.toLowerCase()}</em></p>
            <p className="cfg__price">Watch {PRICE} · Extra straps {STRAP_PRICE}</p>
          </div>
          <div className="cfg__actions">
            <BookButton service="Private Viewing">Book a Viewing</BookButton>
            <a href="#" className="btn btn--solid">Shop This Look <ArrowIcon /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
