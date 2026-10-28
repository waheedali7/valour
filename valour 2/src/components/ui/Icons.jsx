import SplitChars from './SplitChars';

/** The Valour winged emblem, traced from the brand logo (assets/images/logo.png). */
export function Emblem(props) {
  return (
    <svg viewBox="0 0 195 66" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M2 1L87.5 2.6C88 10 92 15.5 97.5 19.5C103 15.5 107 10 107.5 2.6L193 1C161 4.5 127.5 14 97.5 28C67.5 14 34 4.5 2 1Z" />
      <path fill="currentColor" d="M2 1C34 6 67.5 18 97.5 33C127.5 18 161 6 193 1C155 8 115 30 97.5 65.5C80 30 40 8 2 1Z" />
    </svg>
  );
}

/**
 * Official stacked lockup: spaced "VALOUR" wordmark above the emblem.
 * Size it with the --logo-w CSS variable; `split` wraps letters for animation.
 */
export function Logo({ className = '', split = false }) {
  return (
    <span className={`logo ${className}`} role="img" aria-label="Valour">
      <span className="logo__word" aria-hidden="true">
        {split ? <SplitChars text="VALOUR" /> : 'VALOUR'}
      </span>
      <Emblem className="logo__emblem" />
    </span>
  );
}

export function ArrowIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" {...props}>
      <path d="M14 8h2.5V4.5H14A3.5 3.5 0 0 0 10.5 8v2.5H8V14h2.5v6H14v-6h2.5l.5-3.5h-3V8.6c0-.3.3-.6.6-.6z" />
    </svg>
  );
}

// Line icons for form fields, drawn on a 24px grid to match the social icons.
const line = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export function CloseIcon(props) {
  return <svg {...line} {...props}><path d="M6 6l12 12M18 6L6 18" /></svg>;
}

export function MailIcon(props) {
  return <svg {...line} {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 6.5L12 13l8.5-6.5" /></svg>;
}

export function PhoneIcon(props) {
  return (
    <svg {...line} {...props}>
      <path d="M5 3.5h3.2l1.6 4.2-2.1 1.3a11 11 0 0 0 5.3 5.3l1.3-2.1 4.2 1.6V17a2.5 2.5 0 0 1-2.7 2.5A16 16 0 0 1 2.5 6.2 2.5 2.5 0 0 1 5 3.5z" />
    </svg>
  );
}

export function CalendarIcon(props) {
  return <svg {...line} {...props}><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>;
}

export function ClockIcon(props) {
  return <svg {...line} {...props}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>;
}

export function PinIcon(props) {
  return <svg {...line} {...props}><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></svg>;
}

export function ChatIcon(props) {
  return <svg {...line} {...props}><path d="M4 5h16v11H9l-5 4z" /></svg>;
}

export function ChevronIcon(props) {
  return <svg {...line} {...props}><path d="M6 9l6 6 6-6" /></svg>;
}
