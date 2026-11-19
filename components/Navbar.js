'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { navLinks, event } from '@/lib/config';

/**
 * Sticky, mobile-first navigation.
 * Links come from lib/config.js so they can be edited in one place.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add a stronger background once the user scrolls a little.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu when the viewport becomes wide.
  useEffect(() => {
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-navy-950/80 backdrop-blur-xl shadow-lg shadow-black/20'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <a href="/#home" className="group flex items-center" aria-label="OnnoPoth — Home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-light.svg"
            alt="OnnoPoth"
            className="h-6 w-auto transition group-hover:opacity-80 sm:h-7"
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isRulebook = link.href === '/rulebook';
            return (
              <li key={link.label}>
                {isRulebook ? (
                  <Link
                    href={link.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA */}
        <a href="/#register" className="btn-primary hidden !px-5 !py-2.5 lg:inline-flex">
          Register <ArrowUpRight className="h-4 w-4" />
        </a>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/5 text-white lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {open && (
        <div className="border-t border-white/10 bg-navy-950/95 backdrop-blur-xl lg:hidden">
          <ul className="space-y-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.href === '/rulebook' ? (
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-slate-200 hover:bg-white/5"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-slate-200 hover:bg-white/5"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
            <li className="pt-2">
              <a href="/#register" onClick={() => setOpen(false)} className="btn-primary w-full">
                Register Now
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
