import Link from 'next/link';
import { ArrowUpRight, Heart } from 'lucide-react';
import { event, navLinks, contacts } from '@/lib/config';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-navy-950/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Final CTA */}
        <div className="no-print relative mb-14 overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-r from-indigo-600/20 via-purple-600/15 to-transparent p-7 sm:p-9">
          <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-[70px]" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-300">
                Ready to build?
              </p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                তোমার আইডিয়ার অপেক্ষায় আছি।
              </h3>
              <p className="mt-2 text-sm text-slate-400">২৩ নভেম্বরের আগে রেজিস্ট্রেশন করুন।</p>
            </div>
            <a href="/#register" className="btn-primary shrink-0">
              Register Now <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-light.svg" alt="OnnoPoth" className="h-7 w-auto" />
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
                <li key={person.name} className="text-sm text-slate-400">
                  <span className="block font-semibold text-slate-200">{person.name}</span>
                  <span>{person.detail}</span>{' '}
                  <a
                    href={person.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 font-semibold text-indigo-300 hover:text-indigo-200"
                  >
                    {person.linkLabel} →
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
          <a href="#home" className="transition hover:text-indigo-300">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
