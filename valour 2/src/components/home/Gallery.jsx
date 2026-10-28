import SplitChars from '@/components/ui/SplitChars';

const COLUMNS = [
  [
    { src: 'hand-red', w: 1080, h: 1350, alt: 'Nova Red held between two fingers', caption: 'Nova Red — In Hand' },
    { src: 'red-dial-macro', w: 1600, h: 891, alt: 'Macro of the Nova Red sunburst dial', caption: 'Nova Red — Dial', wide: true },
    { src: 'hand-blue', w: 1080, h: 1350, alt: 'Astral Blue on its blue strap', caption: 'Astral Blue', narrow: true },
  ],
  [
    { src: 'blue-dial-macro', w: 1600, h: 891, alt: 'Macro of the Astral Blue dial', caption: 'Astral Blue — Dial', wide: true },
    { src: 'hand-mint', w: 1080, h: 1350, alt: 'Aurora Mint held up to the light', caption: 'Aurora Mint', narrow: true },
    { src: 'eclipse-dark', w: 1080, h: 1350, alt: 'Eclipse Black with its lume glowing', caption: 'Eclipse Black — Lume' },
  ],
];

export default function Gallery() {
  return (
    <section className="gal" id="gallery">
      <div className="gal__head">
        <div>
          <p className="eyebrow" data-reveal><span className="rule" />Chapter 07 — Up Close</p>
          <h2 className="display gal__title" data-split>
            <SplitChars text="Seen" /> <em><SplitChars text="Closely." /></em>
          </h2>
        </div>
        <p className="gal__intro" data-reveal>Every colour, photographed up close: the way you&rsquo;ll see it on your wrist.</p>
      </div>

      <div className="gal__cols">
        {COLUMNS.map((col, ci) => (
          <div className="gal__col" key={ci}>
            {col.map((shot) => (
              <figure key={shot.src} className={`gal__item${shot.wide ? ' is-wide' : ''}${shot.narrow ? ' is-narrow' : ''}`}>
                <div className="gal__frame" data-clip>
                  <img src={`/media/editorial/${shot.src}.webp`} alt={shot.alt} width={shot.w} height={shot.h} loading="lazy" data-parallax="6" />
                </div>
                <figcaption>{shot.caption}</figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
