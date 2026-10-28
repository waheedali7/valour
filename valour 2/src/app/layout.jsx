import { Forum, Inter_Tight, Tinos } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
import { AppointmentProvider } from '@/components/appointment/Appointment';
import './globals.css';
import './home.css';
import './pages.css';
import '@/components/appointment/appointment.css';

// Headings.
const display = Forum({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

// Paragraphs / body copy.
const body = Inter_Tight({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
});

// Classic Times-style serif matching the lettering of the Valour logo lockup.
const logo = Tinos({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-logo',
  display: 'swap',
});

export const metadata = {
  title: 'Valour — Lucent Collection',
  description:
    'Inspired design within reach. The Valour Lucent: Grade 5 titanium, an automatic movement and a dial built from light, in six colours.',
};

export const viewport = { themeColor: '#060607' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${logo.variable} is-loading`} suppressHydrationWarning>
      <body>
        <SmoothScroll>
          <AppointmentProvider>{children}</AppointmentProvider>
        </SmoothScroll>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
