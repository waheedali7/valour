import SplitChars from '@/components/ui/SplitChars';

export default function Founders({ label = 'Chapter 08 — The Founders' }) {
  return (
    <section className="founders" id="founders">
      <figure className="founders__photo">
        <div className="founders__frame" data-clip>
          <img src="/media/editorial/founders.webp" alt="Albert Lai and Jayson De Castro, co-founders of Valour"
            width="1300" height="1733" loading="lazy" data-parallax="5" />
        </div>
        <figcaption className="eyebrow">Albert Lai &amp; Jayson De Castro</figcaption>
      </figure>

      <div className="founders__text">
        <p className="eyebrow" data-reveal><span className="rule" />{label}</p>
        <h2 className="display founders__title" data-split>
          <SplitChars text="Two Enthusiasts." /><br /><em><SplitChars text="One Vision." /></em>
        </h2>
        <p data-reveal>
          We&rsquo;re Albert Lai and Jayson De Castro, two lifelong watch enthusiasts turned creators.
          Albert is a physician and entrepreneur with a deep passion for design and engineering precision.
          Jayson is a designer and watch reviewer who has spent years studying the details that make a timepiece truly memorable.
        </p>
        <p data-reveal>
          Together, we co-founded Valour Watches to bring high-concept, beautifully constructed mechanical watches to life,
          at a price that doesn&rsquo;t compromise on vision or quality.
        </p>
        <dl className="founders__people" data-reveal>
          <div><dt>Albert Lai</dt><dd>Co-founder · Physician &amp; entrepreneur</dd></div>
          <div><dt>Jayson De Castro</dt><dd>Co-founder · Designer &amp; watch reviewer</dd></div>
        </dl>
      </div>
    </section>
  );
}
