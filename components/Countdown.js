'use client';

import { useEffect, useState } from 'react';
import { dates } from '@/lib/config';

const EMPTY = { days: 0, hours: 0, minutes: 0, seconds: 0, started: false };

function getRemaining() {
  const diff = new Date(dates.competitionStart).getTime() - Date.now();
  if (diff <= 0) return { ...EMPTY, started: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    started: false,
  };
}

/** Compact countdown used inside the hero's event-pass card. */
export default function Countdown() {
  // Zeros on both server and client first → no hydration mismatch.
  const [time, setTime] = useState(EMPTY);

  useEffect(() => {
    setTime(getRemaining());
    const timer = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (time.started) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-4 text-sm font-bold text-emerald-300">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
        প্রতিযোগিতা চলছে / শুরু হয়েছে!
      </div>
    );
  }

  const boxes = [
    { value: time.days, label: 'Days' },
    { value: time.hours, label: 'Hours' },
    { value: time.minutes, label: 'Mins' },
    { value: time.seconds, label: 'Secs' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
      {boxes.map((box) => (
        <div
          key={box.label}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] px-1 py-3 text-center"
        >
          <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />
          <div className="font-mono text-xl font-bold tabular-nums tracking-tight text-white sm:text-2xl">
            {String(box.value).padStart(2, '0')}
          </div>
          <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-[10px]">
            {box.label}
          </div>
        </div>
      ))}
    </div>
  );
}
