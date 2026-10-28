import Link from 'next/link';
import { WATCHES } from '@/data/watches';
import SplitChars from '@/components/ui/SplitChars';
import { ArrowIcon } from '@/components/ui/Icons';
import { BookButton } from '@/components/appointment/Appointment';
import PageShell from '@/components/page/PageShell';
import PageHero from '@/components/page/PageHero';
import PageCta from '@/components/page/PageCta';
import Founders from '@/components/home/Founders';

const PILLARS = [
  { title: 'Dimensionality', body: 'Dials built in layers, so light always has somewhere to go.' },
  { title: 'Execution', body: 'Grade 5 titanium, sapphire crystal and an automatic movement.' },
  { title: 'Presence', body: 'Colour and form you notice from across the room.' },
];

const SPECS = [
  ['Case', 'Grade 5 titanium'],
  ['Crystal', 'Sapphire'],
  ['Movement', 'Automatic'],
  ['Diameter', '40 mm'],
  ['Thickness', '11.2 mm'],
  ['Weight', '78 g'],
];

export default function About() {
  return (
    <PageShell>
      <PageHero
        image="/media/editorial/streak-cool.webp" width="2400" height="1066"
        imageAlt="Astral Blue and Aurora Mint watches caught in streaks of coloured light"
        eyebrow="About Valour"
        title={<><SplitChars text="Inspired Design," /><br /><em><SplitChars text="Within Reach." /></em></>}
        intro="Valour brings high-concept, beautifully constructed mechanical watches to collectors and enthusiasts, at a price that doesn’t compromise on vision or quality."
        foot={<><span>Lucent — Collection 01</span><span className="hero__scroll">Scroll <i /></span></>}
      >
        <BookButton className="btn btn--solid" service="Private Viewing">Book a Private Viewing <ArrowIcon /></BookButton>
        <Link href="/#collection" className="btn">Explore Lucent</Link>
      </PageHero>

      <section className="vision">
        <img className="vision__float" src="/media/editorial/red-caseback-cutout.webp" alt="" width="1000" height="1328" loading="lazy" />
        <p className="eyebrow" data-reveal><span className="rule" />01 — Our Vision</p>
        <p className="vision__text" data-reveal>
          Valour&rsquo;s goal is to bring inspired designs within reach for all collectors and enthusiasts.
          With Lucent, we focused on <em>dimensionality</em>, <em>execution</em> and <em>presence</em>.
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

      <Founders label="02 — The Founders" />

      <section className="craft">
        <div className="craft__media">
          <figure className="craft__fig craft__fig--tall">
            <div className="craft__frame" data-clip>
              <img src="/media/editorial/frost-titanium.webp" alt="Frost Silver in its Grade 5 titanium case"
                width="1080" height="1350" loading="lazy" data-parallax="5" />
            </div>
            <figcaption className="eyebrow">Frost Silver — Titanium</figcaption>
          </figure>
          <figure className="craft__fig craft__fig--wide">
            <div className="craft__frame" data-clip>
              <img src="/media/editorial/mint-dial-macro.webp" alt="Macro of the layered Aurora Mint dial"
                width="1600" height="891" loading="lazy" data-parallax="6" />
            </div>
            <figcaption className="eyebrow">Aurora Mint — Dial</figcaption>
          </figure>
        </div>

        <div className="craft__text">
          <p className="eyebrow" data-reveal><span className="rule" />03 — The Lucent</p>
          <h2 className="display craft__title" data-split>
            <SplitChars text="Light In" /><br /><em><SplitChars text="Every Dimension." /></em>
          </h2>
          <p data-reveal>
            Lucent is our first collection: six colours drawn from natural light, each in a Grade 5 titanium case
            with sapphire crystal and an automatic movement.
          </p>
          <p data-reveal>
            Its dial is built in layers and its lume glows in more than one dimension, so the watch changes with every
            angle and every hour.
          </p>
          <dl className="craft__specs" data-reveal>
            {SPECS.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section className="lineup">
        <div className="lineup__head">
          <div>
            <p className="eyebrow" data-reveal><span className="rule" />04 — The Collection</p>
            <h2 className="display lineup__title" data-split>
              <SplitChars text="Six Colours," /><br /><em><SplitChars text="Drawn From Light." /></em>
            </h2>
          </div>
          <p className="lineup__intro" data-reveal>
            From blue hour to the last of the sun. Choose your colour, then make it yours with three cases and thirteen straps.
          </p>
        </div>

        <ul className="lineup__grid">
          {WATCHES.map((w) => (
            <li className="lineup__item" key={w.slug} style={{ '--c-glow': w.glow, '--c-accent': w.accent }} data-reveal>
              <div className="lineup__glow" aria-hidden="true" />
              <img src={`/media/watch/${w.slug}.webp`} alt={`Valour Lucent in ${w.name}`} width="1100" height="1359" loading="lazy" />
              <h3 className="display">{w.name}</h3>
              <p>{w.note}</p>
            </li>
          ))}
        </ul>

        <div className="lineup__foot" data-reveal>
          <Link href="/#configure" className="btn">Build Yours <ArrowIcon /></Link>
        </div>
      </section>

      <PageCta
        image="/media/editorial/frost-hand.webp" width="2200" height="1059"
        eyebrow="Visit Valour"
        title={<><SplitChars text="See It" /><br /><em><SplitChars text="In Person." /></em></>}
        body="Book a private viewing and our specialists will take you through every colour, case and strap."
      >
        <BookButton className="btn btn--solid" service="Private Viewing">Book a Private Viewing <ArrowIcon /></BookButton>
        <Link href="/servicing" className="btn">Servicing &amp; Care</Link>
      </PageCta>
    </PageShell>
  );
}
