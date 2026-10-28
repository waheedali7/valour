'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { scroller } from '@/lib/scroll';
import { TIMES, LOCATIONS, SERVICES } from '@/data/appointments';
import { CalendarIcon, ChatIcon, ChevronIcon, ClockIcon, CloseIcon, MailIcon, PhoneIcon, PinIcon } from '@/components/ui/Icons';

const EMPTY = { firstName: '', lastName: '', email: '', phone: '', date: '', time: '', location: '', service: '', message: '' };

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

// Local date as yyyy-mm-dd, so the earliest bookable day is today in the visitor's timezone.
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const longDate = (value) =>
  new Date(`${value}T00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

function Field({ id, label, icon: Icon, trail: Trail, wide, children }) {
  return (
    <div className={`appt__field${wide ? ' is-wide' : ''}`}>
      <label className="appt__label" htmlFor={id}>{label}</label>
      <div className="appt__control">
        {Icon && <Icon className="appt__icon" />}
        {children}
        {Trail && <Trail className="appt__trail" />}
      </div>
    </div>
  );
}

function Choice({ id, name, value, onChange, placeholder, options }) {
  return (
    <select id={id} name={name} className="appt__input appt__select" required value={value} onChange={onChange}>
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export default function AppointmentModal({ isOpen, service, trigger, onClose }) {
  const uid = useId();
  const dialogRef = useRef(null);
  const [form, setForm] = useState(EMPTY);
  const [sent, setSent] = useState(false);
  const [minDate, setMinDate] = useState('');
  const [wasOpen, setWasOpen] = useState(isOpen);

  // On opening: start fresh after a confirmed booking and apply the preselected service.
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setMinDate(today());
      setSent(false);
      setForm((f) => ({ ...(sent ? EMPTY : f), service: service || (sent ? '' : f.service) }));
    }
  }

  // While open: lock the page and move focus into the dialog; on close, hand focus back.
  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    html.classList.add('has-modal');
    scroller.lenis?.stop();
    const focusTimer = setTimeout(() => dialogRef.current?.querySelector('input, select, textarea, button')?.focus(), 80);

    return () => {
      clearTimeout(focusTimer);
      html.classList.remove('has-modal');
      scroller.lenis?.start();
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
    // Only re-run when the modal opens or closes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Escape closes; Tab stays inside the dialog.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Not wired to a booking service yet: this only confirms on screen.
  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    requestAnimationFrame(() => dialogRef.current?.querySelector('.appt__done button')?.focus());
  };

  const id = (name) => `${uid}-${name}`;

  return (
    <div className={`appt${isOpen ? ' is-open' : ''}`} inert={!isOpen}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="appt__dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={id('title')} data-lenis-prevent>
        <button type="button" className="appt__close" aria-label="Close" onClick={onClose}><CloseIcon /></button>

        {sent ? (
          <div className="appt__done" aria-live="polite">
            <p className="eyebrow"><span className="rule" />Request received</p>
            <h2 id={id('title')} className="display appt__thanks">Thank you, <em>{form.firstName}.</em></h2>
            <p>
              We&rsquo;ve noted your {form.service.toLowerCase()} request for {longDate(form.date)} at {form.time},{' '}
              {form.location}. Our team will be in touch at {form.email} to confirm.
            </p>
            <button type="button" className="appt__submit" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <header className="appt__head">
              <h2 id={id('title')} className="appt__title">Book an Appointment</h2>
              <p className="appt__sub">Schedule a private consultation with our specialists at your preferred location.</p>
            </header>

            <form className="appt__form" onSubmit={submit}>
              <Field id={id('first')} label="First Name">
                <input id={id('first')} name="firstName" className="appt__input" placeholder="Enter first name"
                  autoComplete="given-name" required value={form.firstName} onChange={change} />
              </Field>
              <Field id={id('last')} label="Last Name">
                <input id={id('last')} name="lastName" className="appt__input" placeholder="Enter last name"
                  autoComplete="family-name" required value={form.lastName} onChange={change} />
              </Field>

              <Field id={id('email')} label="Email" icon={MailIcon}>
                <input id={id('email')} name="email" type="email" className="appt__input" placeholder="your@email.com"
                  autoComplete="email" required value={form.email} onChange={change} />
              </Field>
              <Field id={id('phone')} label="Phone" icon={PhoneIcon}>
                <input id={id('phone')} name="phone" type="tel" className="appt__input" placeholder="+1 (555) 000-0000"
                  autoComplete="tel" value={form.phone} onChange={change} />
              </Field>

              <Field id={id('date')} label="Preferred Date" icon={CalendarIcon}>
                <input id={id('date')} name="date" type="date" className="appt__input appt__date" min={minDate}
                  required value={form.date} onChange={change} />
              </Field>
              <Field id={id('time')} label="Preferred Time" trail={ClockIcon}>
                <Choice id={id('time')} name="time" value={form.time} onChange={change} placeholder="Select time" options={TIMES} />
              </Field>

              <Field id={id('location')} label="Location" trail={PinIcon}>
                <Choice id={id('location')} name="location" value={form.location} onChange={change} placeholder="Select location" options={LOCATIONS} />
              </Field>
              <Field id={id('service')} label="Service Type" trail={ChevronIcon}>
                <Choice id={id('service')} name="service" value={form.service} onChange={change} placeholder="Select service" options={SERVICES} />
              </Field>

              <Field id={id('message')} label="Additional Notes" icon={ChatIcon} wide>
                <textarea id={id('message')} name="message" className="appt__input appt__textarea" rows={4}
                  placeholder="Tell us about your interests or any specific requirements..." value={form.message} onChange={change} />
              </Field>

              <button type="submit" className="appt__submit is-wide">Confirm Appointment</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
