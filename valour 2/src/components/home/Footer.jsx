'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowIcon, Emblem, FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/ui/Icons';
import { BookButton } from '@/components/appointment/Appointment';

// [label, href]; '#' marks pages that don't exist yet. `book` opens the appointment modal.
const COLUMNS = [
  { title: 'Shop', links: [['Lucent Collection', '/#collection'], ['Straps', '#'], ['Configurator', '/#configure'], ['Gift Cards', '#']] },
  { title: 'Client Care', links: [['Book an Appointment', 'book'], ['Servicing', '/servicing'], ['Warranty', '#'], ['Purchase Policies', '#'], ['Contact', '#']] },
  { title: 'Company', links: [['About Valour', '/about'], ['Journal', '#'], ['Privacy Policy', '#'], ['Terms & Conditions', '#']] },
];

export default function Footer() {
  const [sent, setSent] = useState(false);

  // Not wired to a mailing service yet: this only confirms on screen.
  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__news">
          <h2 className="display">The <em>Dispatch.</em></h2>
          <p>New releases, workshop notes and first access to limited runs. Nothing else.</p>
          {sent ? (
            <p className="footer__thanks">Thank you. You&rsquo;re on the list.</p>
          ) : (
            <form className="footer__form" onSubmit={onSubmit}>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input id="email" type="email" required placeholder="name@domain.com" autoComplete="email" />
              <button type="submit">Subscribe <ArrowIcon /></button>
            </form>
          )}
        </div>

        {COLUMNS.map((col) => (
          <div className="footer__col" key={col.title}>
            <h3 className="eyebrow">{col.title}</h3>
            <ul>
              {col.links.map(([label, href]) => (
                <li key={label}>
                  {href === 'book' ? <BookButton className="footer__book">{label}</BookButton>
                    : href === '#' ? <a href="#">{label}</a> : <Link href={href}>{label}</Link>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer__social">
        <a href="#" aria-label="Instagram"><InstagramIcon /></a>
        <a href="#" aria-label="YouTube"><YoutubeIcon /></a>
        <a href="#" aria-label="Facebook"><FacebookIcon /></a>
      </div>

      <div className="footer__giant" aria-hidden="true">
        <span className="footer__giant-word">VALOUR</span>
        <Emblem className="footer__giant-emblem" />
      </div>

      <div className="footer__bottom">
        <span>© 2026 Valour Watches. All rights reserved.</span>
        <span>Lucent · Grade 5 Titanium · Automatic</span>
      </div>
    </footer>
  );
}
