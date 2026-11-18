import Link from 'next/link';
import { CalendarDays, Timer, Gift, ArrowDown, Sparkles } from 'lucide-react';
import Countdown from './Countdown';
import { event, dates, socialLinks } from '@/lib/config';

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      {/* Decorative blurred orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute top-40 -left-20 h-72 w-72 rounded-full bg-blue-500/15 blur-[100px]" />
      <div className="pointer-events-none absolute top-52 -right-20 h-72 w-72 rounded-full bg-purple-500/15 blur-[100px]" />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        {/* Badges */}
        <div className="mb-7 flex flex-wrap items-center justify-center gap-2.5">
          <span className="badge">
            <CalendarDays className="h-3.5 w-3.5 text-indigo-300" /> {event.mode}
          </span>
          <span className="badge">
            <Timer className="h-3.5 w-3.5 text-cyan-300" /> {event.duration}
          </span>
          <span className="badge">
            <Gift className="h-3.5 w-3.5 text-fuchsia-300" /> {event.prizeLabel}
          </span>
        </div>

        {/* Main title */}
        <h1 className="animate-fade-up text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-6xl lg:text-7xl">
          <span className="block">Product Building</span>
          <span className="gradient-text block">Competition</span>
          <span className="mt-2 block text-2xl font-bold text-slate-300 sm:text-4xl">
            (Using AI)
          </span>
        </h1>

        {/* Bangla subtitle */}
        <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-slate-300 sm:text-xl">
          {event.tagline}
        </p>

        <p className="mt-3 text-sm text-slate-500">
          আয়োজক: <span className="font-semibold text-slate-300">{event.organizer}</span> ·{' '}
          {dates.competitionStartLabel}
        </p>

        {/* CTA buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#register" className="btn-primary w-full sm:w-auto">
            <Sparkles className="h-4 w-4" /> Register Now
          </a>
          <Link href={socialLinks.rulebook} className="btn-secondary w-full sm:w-auto">
            Rulebook দেখো
          </Link>
        </div>

        {/* Countdown */}
        <div className="mx-auto mt-14 max-w-xl">
          <Countdown />
        </div>

        {/* Scroll hint */}
        <a
          href="#about"
          aria-label="নিচে স্ক্রল করুন"
          className="mt-14 inline-flex h-10 w-10 animate-bounce items-center justify-center rounded-full border border-white/15 text-slate-400 transition hover:text-white"
        >
          <ArrowDown className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
}
