import Link from 'next/link';
import SplitChars from '@/components/ui/SplitChars';
import { ArrowIcon } from '@/components/ui/Icons';
import { BookButton } from '@/components/appointment/Appointment';
import PageShell from '@/components/page/PageShell';
import PageHero from '@/components/page/PageHero';
import PageCta from '@/components/page/PageCta';

const PROMISES = [
  { title: 'Free Assessment', body: 'Every service starts with a free assessment and a quote, provided upfront.' },
  { title: 'Genuine Parts', body: 'Genuine Valour parts only, so your watch keeps its original character and integrity.' },
  { title: '12-Month Warranty', body: 'All service and repair work is covered for twelve months, with a post-repair report.' },
];

const SERVICES = [
  {
    id: 'routine',
    label: '02 — Maintenance',
    title: ['Routine', 'Service.'],
    service: 'Routine Service',
    image: { src: 'servicing-bench', w: 1200, h: 1200, alt: 'A watchmaker working on an open movement' },
    body: [
      'A mechanical watch is a living instrument. Regular servicing keeps your Valour running at peak precision, preserving both its performance and its value over time.',
      'Our watchmakers disassemble, clean, lubricate and reassemble every movement by hand. A full service is recommended every 3 to 5 years, depending on usage.',
    ],
    list: [
      'Complete movement disassembly and ultrasonic cleaning',
      'Lubrication of all gear trains and escapements',
      'Timing regulation and chronometric calibration',
      'Gasket replacement and water resistance testing',
    ],
  },
  {
    id: 'restoration',
    label: '03 — Restoration',
    title: ['Repair &', 'Restoration.'],
    service: 'Repair & Restoration',
    image: { src: 'servicing-loupe', w: 700, h: 600, alt: 'A watchmaker inspecting a movement through a loupe' },
    body: [
      'From a damaged crystal to a worn crown, every component of your Valour deserves the same craftsmanship it was built with. We restore with precision, nothing less.',
      'We handle everything from minor repairs to full mechanical overhauls, using genuine Valour parts exclusively.',
    ],
    list: [
      'Crystal replacement and case refinishing',
      'Crown, pusher and stem repair',
      'Strap, bracelet and clasp restoration',
      'Movement parts replacement with genuine components',
    ],
  },
];

const STEPS = [
  { title: 'Book', body: 'Request an appointment online at any time, at a location near you or as a virtual consultation.' },
  { title: 'Send Or Visit', body: 'Ship your timepiece to us, or visit an authorized service partner in your region.' },
  { title: 'Assess', body: 'We inspect your watch and send a free quote before any work begins.' },
  { title: 'Return', body: 'Your watch comes home with a post-repair report and a 12-month service warranty.' },
];

const TIMES = [
  ['Service interval', 'Every 3 – 5 years'],
  ['Routine calibration', '5 – 7 business days'],
  ['Full overhaul', '3 – 6 weeks'],
  ['Service warranty', '12 months'],
];

export default function Servicing() {
  return (
    <PageShell>
      <PageHero
        image="/media/editorial/workbench.webp" width="2400" height="1066"
        imageAlt="An Astral Blue watch on a watchmaker’s bench among tools"
        eyebrow="Client Care — Servicing"
        title={<><SplitChars text="Timepiece" /><br /><em><SplitChars text="Servicing." /></em></>}
        intro="Every Valour deserves exceptional care. Our servicing preserves the precision, performance and longevity of your watch, with a seamless, trusted experience throughout its lifetime."
        foot={<><span>Free assessment · Genuine parts · 12-month warranty</span><span className="hero__scroll">Scroll <i /></span></>}
      >
        <BookButton className="btn btn--solid" service="Servicing Consultation">Book a Service <ArrowIcon /></BookButton>
        <a href="#services" className="btn">Our Services</a>
      </PageHero>

      <section className="vision">
        <p className="eyebrow" data-reveal><span className="rule" />01 — Our Promise</p>
        <p className="vision__text" data-reveal>
          A mechanical watch is a living instrument. We care for it that way: <em>precisely</em>, <em>openly</em>
          {' '}and with the <em>same craftsmanship</em> it was built with.
        </p>
        <div className="statement__pillars">
          {PROMISES.map((p, i) => (
            <div className="pillar" key={p.title} data-reveal>
              <span className="pillar__num">0{i + 1}</span>
              <h3 className="display">{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div id="services">
        {SERVICES.map((s, i) => (
          <section className={`svc${i % 2 ? ' svc--flip' : ''}`} key={s.id}>
            <figure className="svc__media">
              <div className="svc__frame" data-clip>
                <img src={`/media/editorial/${s.image.src}.webp`} alt={s.image.alt} width={s.image.w} height={s.image.h}
                  loading="lazy" data-parallax="5" />
              </div>
            </figure>
            <div className="svc__text">
              <p className="eyebrow" data-reveal><span className="rule" />{s.label}</p>
              <h2 className="display svc__title" data-split>
                <SplitChars text={s.title[0]} /><br /><em><SplitChars text={s.title[1]} /></em>
              </h2>
              {s.body.map((p) => <p key={p} data-reveal>{p}</p>)}
              <ul className="svc__list" data-reveal>
                {s.list.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div data-reveal>
                <BookButton service={s.service}>Book {s.service} <ArrowIcon /></BookButton>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="steps">
        <div className="steps__head">
          <div>
            <p className="eyebrow" data-reveal><span className="rule" />04 — How It Works</p>
            <h2 className="display steps__title" data-split>
              <SplitChars text="Simple." /><br /><em><SplitChars text="Fully Supported." /></em>
            </h2>
          </div>
          <p className="steps__intro" data-reveal>
            Turnaround times vary by service type. Full overhauls and restorations depend on parts availability.
          </p>
        </div>

        <ol className="steps__list">
          {STEPS.map((step, i) => (
            <li className="pillar" key={step.title} data-reveal>
              <span className="pillar__num">0{i + 1}</span>
              <h3 className="display">{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>

        <dl className="steps__times" data-reveal>
          {TIMES.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </section>

      <PageCta
        image="/media/editorial/eclipse-dial-macro.webp" width="1600" height="891"
        eyebrow="Book Appointment"
        title={<><SplitChars text="Care," /><br /><em><SplitChars text="Made Simple." /></em></>}
        body="Tell us what your watch needs, and choose a time and place that suits you. We’ll take it from there."
      >
        <BookButton className="btn btn--solid" service="Servicing Consultation">Book a Service Appointment <ArrowIcon /></BookButton>
        <Link href="/about" className="btn">About Valour</Link>
      </PageCta>
    </PageShell>
  );
}
