/** Closing call to action for inner pages, styled like the home page finale. */
export default function PageCta({ image, width, height, eyebrow, title, body, children }) {
  return (
    <section className="cta">
      <div className="cta__bg" aria-hidden="true">
        <img src={image} alt="" width={width} height={height} loading="lazy" data-parallax="10" />
      </div>
      <div className="cta__inner">
        <p className="eyebrow" data-reveal>{eyebrow}</p>
        <h2 className="display cta__title" data-split>{title}</h2>
        <p className="cta__body" data-reveal>{body}</p>
        <div className="cta__actions" data-reveal>{children}</div>
      </div>
    </section>
  );
}
