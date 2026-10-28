// Splits text into masked words and characters so headings can rise letter by letter.
// Screen readers get the plain text; the animated spans are hidden from them.
export default function SplitChars({ text, className = '' }) {
  const words = text.split(' ');
  return (
    <span className={`split ${className}`}>
      <span className="sr-only">{text}</span>
      {words.map((word, wi) => (
        <span key={wi}>
          <span className="split__word" aria-hidden="true">
            {[...word].map((ch, ci) => (
              <span className="split__char" key={ci}>{ch}</span>
            ))}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  );
}
