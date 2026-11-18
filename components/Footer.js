import Link from 'next/link';
import { Heart } from 'lucide-react';
import { event, navLinks, contacts } from '@/lib/config';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-navy-950/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy-800 shadow-glow ring-1 ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.svg" alt="OnnoPoth logo" className="h-7 w-7" />
              </span>
              <span className="text-lg font-extrabold text-white">{event.organizer}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              {event.tagline}। {event.organizer} — একটি উন্মুক্ত লার্নিং কমিউনিটি।
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Quick Links</h3>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-400">
              {navLinks.map((link) => (
                <li key={link.label}>
                  {link.href === '/rulebook' ? (
                    <Link href={link.href} className="hover:text-indigo-300">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="hover:text-indigo-300">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Contact</h3>
            <ul className="mt-4 space-y-3">
              {contacts.map((person) => (
                <li key={person.phone} className="text-sm text-slate-400">
                  <span className="block font-semibold text-slate-200">{person.name}</span>
                  <span>{person.phone}</span>{' '}
                  <a
                    href={person.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 font-semibold text-indigo-300 hover:text-indigo-200"
                  >
                    WhatsApp →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>Organized by {event.organizer} – আয়োজক কমিটি</p>
          <p className="flex items-center gap-1.5">
            © {year} {event.organizer}. All rights reserved.
            <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
