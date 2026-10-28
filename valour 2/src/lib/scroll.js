// Shared handle to the Lenis instance created in SmoothScroll.
export const scroller = { lenis: null };

/** Smooth-scroll to a section by id (pinned sections are wrapped in a .pin-spacer). */
export function scrollToId(id, { immediate = false } = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  const target = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el;
  if (scroller.lenis) scroller.lenis.scrollTo(target, immediate ? { immediate: true, force: true } : { duration: 1.8 });
  else target.scrollIntoView({ behavior: immediate ? 'instant' : 'smooth' });
}
