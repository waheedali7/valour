/** False when the visitor has asked the OS to reduce motion. */
export const motionOK = () =>
  typeof window === 'undefined' || !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
