import SplitChars from '@/components/ui/SplitChars';

const SPECS = [
  ['Case', 'Grade 5 titanium'],
  ['Diameter', '40 mm'],
  ['Thickness', '11.2 mm'],
  ['Weight', '78 g'],
];

export default function Titanium() {
  return (
    <section className="ti" id="titanium">
      <div className="ti__media" data-clip>
        <img src="/media/editorial/frost-dial-macro.webp" alt="Close-up of the Frost Silver dial and titanium case"
          width="2200" height="1225" loading="lazy" data-parallax="7" />
      </div>
      <div className="ti__shade" aria-hidden="true" />

      <div className="ti__content">
        <p className="eyebrow" data-reveal><span className="rule" />Chapter 03 — Material</p>
        <h2 className="display ti__title" data-split>
          <SplitChars text="Light In" /><br />
          <em><SplitChars text="Feel And Sight." /></em>
        </h2>
        <p className="ti__body" data-reveal>
          Experience Grade 5 titanium at its most vibrant form: lighter on the wrist than steel,
          and finished to throw the light straight back at you.
        </p>
        <dl className="spec-card" data-reveal>
          {SPECS.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </div>
    </section>
  );
}
