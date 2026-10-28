'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { motionOK } from '@/lib/motion';
import sequence from '@/data/sequence.json'; // written by scripts/extract-frames.mjs

// Frames come from assets/videos/scroll-video.mp4 (see scripts/extract-frames.mjs).
const FRAME_COUNT = sequence.count;
const frameSrc = (i) => `/media/sequence/${String(i + 1).padStart(4, '0')}.webp`;
const RESTING_FRAME = Math.round(FRAME_COUNT * 0.67); // shown when motion is reduced

// `from`/`to` are positions in the scroll (0-1), lined up with the cuts in the footage.
const CHAPTERS = [
  { from: 0, to: 0.19, title: 'Profile', body: '11.2mm of Grade 5 titanium, shaped to sit low and light on the wrist.' },
  { from: 0.19, to: 0.295, title: 'The Heart', body: 'An automatic movement with a 72-hour power reserve, wound by a rotor cut in the shape of our wings.' },
  { from: 0.295, to: 0.63, title: 'The Dial', body: 'Sunburst rays beneath stepped rings. A dial built in layers, so it changes with every angle of light.' },
  { from: 0.63, to: 0.8, title: 'Presence', body: '40mm across, under sapphire crystal. Made to be noticed from across the room.' },
  { from: 0.8, to: 1, title: 'Every Day', body: '100 metres of water resistance, and an exhibition caseback that shows the work.' },
];

export default function Sequence() {
  const root = useRef(null);
  const canvasRef = useRef(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const small = window.matchMedia('(max-width: 760px)').matches;
    const STEP = small ? 2 : 1;          // phones use every other frame; blending fills the gap
    const REACH = (small ? 12 : 20) * STEP; // frames kept decoded on each side of the playhead
    const ANCHOR = 16;                   // every 16th frame stays decoded, as a fallback for very fast scrolls

    // All compressed frames live in memory (a few MB). Only the frames near the playhead are
    // decoded into bitmaps, so drawing never waits on a decode and memory stays bounded.
    const blobs = new Array(FRAME_COUNT);
    const bitmaps = new Array(FRAME_COUNT);
    const making = new Set();
    const state = { frame: 0 };
    let alive = true;
    let lastPos = -1;
    let lastWhole = 0;
    let dir = 1;

    const keep = (i, center) => i % ANCHOR === 0 || i === FRAME_COUNT - 1 || Math.abs(i - center) <= REACH;

    const makeBitmap = (i) => {
      making.add(i);
      const options = small ? { resizeWidth: 800, resizeHeight: 450, resizeQuality: 'medium' } : undefined;
      createImageBitmap(blobs[i], options).then((bmp) => {
        making.delete(i);
        if (!alive || !keep(i, lastWhole)) { bmp.close(); return; }
        bitmaps[i] = bmp;
        if (Math.abs(i - state.frame) <= 3 * STEP) draw(true);
      }, () => making.delete(i));
    };

    // Free bitmaps that fell out of range, then decode the ones coming up: nearest first,
    // starting in the direction of travel.
    const sync = (center) => {
      for (let i = 0; i < FRAME_COUNT; i++) {
        if (bitmaps[i] && !keep(i, center)) { bitmaps[i].close(); bitmaps[i] = undefined; }
      }
      for (let d = 0; d <= REACH; d++) {
        for (const i of [center + dir * d, center - dir * d]) {
          if (i >= 0 && i < FRAME_COUNT && blobs[i] && !bitmaps[i] && !making.has(i)) makeBitmap(i);
        }
      }
    };

    const nearest = (i) => {
      for (let d = 0; d < FRAME_COUNT; d++) {
        if (i - d >= 0 && bitmaps[i - d]) return bitmaps[i - d];
        if (i + d < FRAME_COUNT && bitmaps[i + d]) return bitmaps[i + d];
      }
      return null;
    };
    const cover = (img, alpha) => {
      const { width: w, height: h } = canvas;
      const scale = Math.max(w / img.width, h / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };

    // The film position is fractional (the scrub eases between whole frames). Drawing the
    // frame below and fading the frame above over it turns 15 pictures a second into
    // continuous motion, and softens the cuts between shots.
    const draw = (force = false) => {
      const pos = Math.min(Math.max(state.frame, 0), FRAME_COUNT - 1);
      if (!force && Math.abs(pos - lastPos) < 0.004) return;
      lastPos = pos;
      const whole = Math.floor(pos);
      if (whole !== lastWhole) {
        dir = whole > lastWhole ? 1 : -1;
        lastWhole = whole;
        sync(whole);
      }
      const base = nearest(whole);
      if (!base) return;
      cover(base, 1);
      const frac = pos - whole;
      if (frac > 0.01 && whole + 1 < FRAME_COUNT) {
        const next = nearest(whole + 1);
        if (next && next !== base) cover(next, frac);
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, small ? 1 : 1.5);
      const w = Math.min(Math.round(canvas.clientWidth * dpr), 1920); // frames are 1280 wide; more is wasted
      canvas.width = w;
      canvas.height = Math.round((w * canvas.clientHeight) / canvas.clientWidth);
      draw(true);
    };

    // Fetch coarse to fine: every 16th frame first, then 8th, 4th... so there is always a
    // nearby frame to show, even if you scroll before everything has arrived.
    const order = [0, FRAME_COUNT - 1];
    const queued = new Set(order);
    for (const step of [16, 8, 4, 2, 1]) {
      if (step < STEP) continue;
      for (let i = 0; i < FRAME_COUNT; i += step) {
        if (i % STEP === 0 && !queued.has(i)) { queued.add(i); order.push(i); }
      }
    }
    const idle = () => new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(r, { timeout: 250 }) : setTimeout(r, 30)));
    const loadFrame = async (i) => {
      try {
        const res = await fetch(frameSrc(i));
        const blob = await res.blob();
        if (!alive) return;
        blobs[i] = blob;
        if (!bitmaps[i] && !making.has(i) && keep(i, lastWhole)) makeBitmap(i);
      } catch { /* a missing frame is covered by its neighbours */ }
    };
    (async () => {
      await loadFrame(order[0]);
      let cursor = 1;
      const worker = async () => {
        while (alive) {
          await idle(); // yields to the hero animation while it is playing
          if (cursor >= order.length) return; // checked after the wait: another loader may have taken the last one
          await loadFrame(order[cursor++]);
        }
      };
      await Promise.all(Array.from({ length: 6 }, worker));
    })();

    resize();
    window.addEventListener('resize', resize);
    const cleanup = () => {
      alive = false;
      window.removeEventListener('resize', resize);
      bitmaps.forEach((b) => b?.close());
    };

    const caps = q('.seq__cap');
    const rail = q('.seq__rail li');
    const setActive = (progress) => {
      const idx = CHAPTERS.findLastIndex((c) => progress >= c.from);
      rail.forEach((li, i) => li.classList.toggle('is-active', i === idx));
    };

    if (!motionOK()) {
      state.frame = RESTING_FRAME;
      draw(true);
      gsap.set(caps[3], { autoAlpha: 1 });
      setActive(0.65);
      return cleanup;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root.current, start: 'top top', end: '+=520%', scrub: 0.6, pin: true, anticipatePin: 1,
        onUpdate: (self) => setActive(self.progress),
      },
    });
    tl.to(state, { frame: FRAME_COUNT - 1, duration: 1, onUpdate: draw }, 0);
    tl.fromTo(q('.seq__bar'), { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
    CHAPTERS.forEach((c, i) => {
      tl.fromTo(caps[i], { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.035, ease: 'power2.out' }, c.from + 0.008);
      if (i < CHAPTERS.length - 1) tl.to(caps[i], { autoAlpha: 0, y: -50, duration: 0.03, ease: 'power2.in' }, c.to - 0.035);
    });
    setActive(0);

    return cleanup;
  }, { scope: root });

  return (
    <section className="seq" id="lucent" ref={root} aria-label="The Lucent, in detail">
      <canvas ref={canvasRef} className="seq__canvas" aria-hidden="true" />
      <div className="seq__shade" aria-hidden="true" />
      <p className="eyebrow seq__head"><span className="rule" />Chapter 01 — Anatomy of Lucent</p>

      {CHAPTERS.map((c, i) => (
        <div className="seq__cap" key={c.title}>
          <span className="seq__num">0{i + 1} / 0{CHAPTERS.length}</span>
          <h2 className="display">{c.title}</h2>
          <p>{c.body}</p>
        </div>
      ))}

      <ol className="seq__rail" aria-hidden="true">
        {CHAPTERS.map((c, i) => (
          <li key={c.title}><span>0{i + 1}</span><i /></li>
        ))}
      </ol>
      <span className="seq__bar" aria-hidden="true" />
    </section>
  );
}
