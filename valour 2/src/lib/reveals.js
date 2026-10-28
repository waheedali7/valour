'use client';
import { gsap, useGSAP } from '@/lib/gsap';
import { motionOK } from '@/lib/motion';

/**
 * Shared scroll reveals for every page. Call it after the page's sections have set up
 * their own pins, so trigger positions already include the pinned spacing.
 *   data-split    heading characters rise into place
 *   data-reveal   fade up
 *   data-clip     image frame opens and the photo settles
 *   data-parallax image drifts inside its frame (value = travel in %)
 */
export function useReveals(scope) {
  useGSAP(() => {
    if (!motionOK()) return;
    gsap.utils.toArray('[data-split]').forEach((el) => {
      gsap.from(el.querySelectorAll('.split__char'), {
        yPercent: 115, duration: 1.4, ease: 'expo.out', stagger: 0.022,
        scrollTrigger: { trigger: el, start: 'top 86%' },
      });
    });
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      gsap.from(el, { y: 36, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
    });
    gsap.utils.toArray('[data-clip]').forEach((el) => {
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%' } })
        .fromTo(el, { clipPath: 'inset(16% 12% 16% 12%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'expo.inOut' })
        .from(el.querySelector('img'), { scale: 1.3, duration: 2.2, ease: 'expo.out' }, 0);
    });
    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      const travel = parseFloat(el.dataset.parallax) || 8;
      gsap.fromTo(el, { yPercent: -travel }, {
        yPercent: travel, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }, { scope });
}
