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

/** Live countdown to the competition start (27 Nov 2026, 10:00 AM UTC+6). */
export default function Countdown() {
  // Start with zeros on both server and client to avoid hydration mismatch.
  const [time, setTime] = useState(EMPTY);

  useEffect(() => {
    setTime(getRemaining());
    const timer = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (time.started) {
    return (
      <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-sm font-bold text-emerald-300">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
        প্রতিযোগিতা চলছে / শুরু হয়েছে!
      </div>
    );
  }

  const boxes = [
    { value: time.days, label: 'দিন' },
    { value: time.hours, label: 'ঘণ্টা' },
    { value: time.minutes, label: 'মিনিট' },
    { value: time.seconds, label: 'সেকেন্ড' },
  ];

  return (
    <div>
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        প্রতিযোগিতা শুরু হতে বাকি
      </p>
      <div className="flex justify-center gap-2 sm:gap-3">
        {boxes.map((box) => (
          <div
            key={box.label}
            className="glass min-w-[64px] px-2 py-3 text-center sm:min-w-[84px] sm:py-4"
          >
            <div className="font-mono text-2xl font-extrabold tabular-nums text-white sm:text-4xl">
              {String(box.value).padStart(2, '0')}
            </div>
            <div className="mt-1 text-[10px] font-medium text-slate-400 sm:text-xs">{box.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
