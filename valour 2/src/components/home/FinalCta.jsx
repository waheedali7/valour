'use client';
import { scrollToId } from '@/lib/scroll';
import { PRICE } from '@/data/watches';
import SplitChars from '@/components/ui/SplitChars';
import { ArrowIcon } from '@/components/ui/Icons';
import { BookButton } from '@/components/appointment/Appointment';

export default function FinalCta() {
  const go = (id) => (e) => { e.preventDefault(); scrollToId(id); };
  return (
    <section className="cta">
      <div className="cta__bg" aria-hidden="true">
        <img src="/media/editorial/streak-warm.webp" alt="" width="2400" height="1066" loading="lazy" data-parallax="10" />
      </div>
      <div className="cta__inner">
        <p className="eyebrow" data-reveal>Lucent — Collection 01</p>
        <h2 className="display cta__title" data-split>
          <SplitChars text="Inspired Design," /><br /><em><SplitChars text="Within Reach." /></em>
        </h2>
        <p className="cta__body" data-reveal>Six colours. Grade 5 titanium. An automatic heart. From {PRICE}.</p>
        <div className="cta__actions" data-reveal>
          <a href="#collection" className="btn btn--solid" onClick={go('collection')}>Shop The Collection <ArrowIcon /></a>
          <a href="#configure" className="btn" onClick={go('configure')}>Build Yours</a>
          <BookButton service="Private Viewing">Book a Private Viewing</BookButton>
        </div>
      </div>
    </section>
  );
}
