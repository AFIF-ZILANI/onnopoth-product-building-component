import Link from 'next/link';
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Gift,
  Sparkles,
  Timer,
  Trophy,
  Users,
} from 'lucide-react';
import Countdown from './Countdown';
import ShareButtons from './ShareButtons';
import { event, socialLinks } from '@/lib/config';

/** Small row inside the event-pass card. */
function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-500/10 text-indigo-300">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
        <p className="truncate text-[13px] font-semibold text-slate-200">{value}</p>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pb-16 pt-28 sm:pt-36 lg:pt-44">
      {/* ---------------- Atmosphere ---------------- */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="hero-grid absolute inset-0" />
        <div className="absolute -left-44 -top-20 h-[38rem] w-[38rem] animate-pulse-glow rounded-full bg-blue-600/20 blur-[130px]" />
        <div className="absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full bg-fuchsia-600/15 blur-[130px]" />
        <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-indigo-500/10 blur-[110px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
          {/* ---------------- Copy ---------------- */}
          <div className="animate-fade-up text-center lg:text-left">
            {/* Status + event badges */}
            <div className="mb-8 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Registration Open
              </span>
              <span className="badge">
                <CalendarDays className="h-3.5 w-3.5 text-indigo-300" /> 20–23 Nov
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[clamp(2.8rem,8vw,5.4rem)] font-extrabold leading-[0.98] tracking-[-0.045em] text-white">
              <span className="block">Product Building</span>
              <span className="gradient-text block pb-1">Competition</span>
              <span className="mt-2 block text-[0.42em] font-semibold tracking-[-0.01em] text-slate-400">
                (Using AI)
              </span>
            </h1>

            {/* Bangla subtitle */}
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl lg:mx-0">
              {event.tagline}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              আয়োজক: <span className="font-semibold text-slate-300">{event.organizer}</span> · সব
              প্রতিষ্ঠানের শিক্ষার্থীদের জন্য ওপেন
            </p>

            {/* Key facts */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
              <span className="badge">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" /> {event.mode}
              </span>
              <span className="badge">
                <Timer className="h-3.5 w-3.5 text-indigo-300" /> {event.duration}
              </span>
              <span className="badge">
                <Gift className="h-3.5 w-3.5 text-fuchsia-300" /> {event.prizeLabel}
              </span>
              <span className="badge">
                <Users className="h-3.5 w-3.5 text-emerald-300" /> Solo or Team of 3
              </span>
            </div>

            {/* Actions */}
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <a href="#register" className="btn-primary group w-full sm:w-auto">
                Register Now
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <Link href={socialLinks.rulebook} className="btn-secondary w-full sm:w-auto">
                Rulebook দেখো
              </Link>
            </div>

            <div className="mt-5 flex justify-center lg:justify-start">
              <ShareButtons />
            </div>

            {/* Stat strip */}
            <div className="mt-11 grid grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-5 text-center lg:text-left">
              {[
                { value: '12h', label: 'Build marathon' },
                { value: '100', label: 'Marks judging' },
                { value: 'Top 3', label: 'Get rewarded' },
              ].map((stat) => (
                <div key={stat.label} className="px-2">
                  <p className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-xl font-extrabold text-transparent sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[11px]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ---------------- Event pass card ---------------- */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            {/* glow + orbit rings */}
            <div className="absolute -inset-10 rounded-[3rem] bg-accent-gradient opacity-20 blur-[90px]" />
            <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] border border-white/[0.05]" />
            <div className="pointer-events-none absolute -inset-14 rounded-[3.5rem] border border-white/[0.03]" />

            <div className="glass-strong relative overflow-hidden rounded-[32px] p-6 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)] sm:p-8">
              {/* metallic top edge */}
              <div className="absolute inset-x-0 top-0 h-[3px] bg-accent-gradient" />

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-300">
                    The Countdown
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">Almost time to build 🚀</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Live
                </span>
              </div>

              {/* Big date */}
              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="bg-gradient-to-br from-white via-indigo-100 to-indigo-300 bg-clip-text text-6xl font-extrabold leading-none tracking-tighter text-transparent sm:text-7xl">
                    27
                  </p>
                  <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
                    November 2026
                  </p>
                </div>
                <div className="pb-1 text-right">
                  <p className="text-lg font-bold text-white sm:text-xl">10:00 AM</p>
                  <p className="text-xs text-slate-500">Friday · UTC+6</p>
                </div>
              </div>

              <div className="my-6 hero-hairline" />

              <Countdown />

              <p className="mt-3 text-center text-[11px] text-slate-500">
                প্রতিযোগিতা শুরু হতে বাকি
              </p>

              <div className="my-6 hero-hairline" />

              <div className="space-y-2.5">
                <DetailRow icon={Sparkles} label="Format" value="Online · AI-powered" />
                <DetailRow icon={Timer} label="Build window" value="10:00 AM – 10:00 PM" />
                <DetailRow icon={Gift} label="For the top 3" value="Book for each winner" />
              </div>

              {/* Organizer strip */}
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.svg" alt="OnnoPoth logo" className="h-9 w-9 rounded-lg" />
                <div>
                  <p className="text-xs font-bold text-white">Organized by OnnoPoth</p>
                  <p className="text-[11px] text-slate-500">আয়োজক কমিটি</p>
                </div>
                <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400" />
              </div>
            </div>

            {/* floating prize chip */}
            <div className="absolute -bottom-5 -left-3 hidden items-center gap-2.5 rounded-2xl border border-white/10 bg-navy-900/95 px-4 py-3 shadow-2xl backdrop-blur-xl sm:flex">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-gradient">
                <Trophy className="h-4 w-4 text-white" />
              </span>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">Prize</p>
                <p className="text-sm font-bold text-white">Book · Top 3</p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Bottom ticker ---------------- */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] py-3.5">
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 px-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[11px]">
            <span>20–23 Nov · Registration</span>
            <span className="h-1 w-1 rounded-full bg-indigo-400" />
            <span>25 Nov · Confirmed list</span>
            <span className="h-1 w-1 rounded-full bg-indigo-400" />
            <span>27 Nov · Build day</span>
            <span className="h-1 w-1 rounded-full bg-indigo-400" />
            <span>28 Nov · Results</span>
          </div>
        </div>

        {/* scroll cue */}
        <div className="mt-10 flex justify-center">
          <a
            href="#about"
            aria-label="নিচে স্ক্রল করুন"
            className="group flex flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 transition hover:text-indigo-300"
          >
            Explore
            <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 transition group-hover:border-indigo-400/50">
              <ArrowDown className="h-4 w-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
