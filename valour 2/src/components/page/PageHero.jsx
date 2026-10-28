/** Full-screen opening section for inner pages: photo, chapter label, split title and an aside with actions. */
export default function PageHero({ image, imageAlt, width, height, eyebrow, title, intro, children, foot }) {
  return (
    <section className="phero" id="top">
      <div className="phero__media">
        <img src={image} alt={imageAlt} width={width} height={height} fetchPriority="high" data-parallax="8" />
      </div>
      <div className="phero__shade" aria-hidden="true" />

      <div className="phero__inner">
        <p className="eyebrow" data-reveal><span className="rule" />{eyebrow}</p>
        <h1 className="display phero__title" data-split>{title}</h1>
        <div className="phero__aside" data-reveal>
          <p>{intro}</p>
          {children && <div className="phero__actions">{children}</div>}
        </div>
      </div>

      {foot && <div className="phero__foot">{foot}</div>}
    </section>
  );
}
