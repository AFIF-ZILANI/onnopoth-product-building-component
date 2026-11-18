'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Sparkles } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { judgingCriteria } from '@/lib/config';

const COLORS = [
  { bar: 'from-blue-500 to-indigo-500', hex: '#3b82f6' },
  { bar: 'from-indigo-500 to-violet-500', hex: '#6366f1' },
  { bar: 'from-violet-500 to-purple-500', hex: '#8b5cf6' },
  { bar: 'from-purple-500 to-fuchsia-500', hex: '#a855f7' },
  { bar: 'from-fuchsia-500 to-pink-500', hex: '#d946ef' },
  { bar: 'from-cyan-500 to-blue-500', hex: '#22d3ee' },
];

export default function JudgingCriteria() {
  const [mounted, setMounted] = useState(false);
  const total = judgingCriteria.reduce((sum, c) => sum + c.marks, 0);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Build a conic-gradient donut from the same marks used by the bars.
  let acc = 0;
  const conic = judgingCriteria
    .map((c, i) => {
      const start = acc;
      acc += c.marks;
      return `${COLORS[i % COLORS.length].hex} ${start}% ${acc}%`;
    })
    .join(', ');

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="05"
          eyebrow="Judging criteria"
          title="বিচারের মানদণ্ড"
          subtitle={`মোট ${total} নম্বর। প্রতিটি বিভাগের ওজন নিচে দেখানো হয়েছে।`}
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          {/* Bars */}
          <div className="glass p-7 sm:p-10">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                <BarChart3 className="h-4 w-4 text-indigo-300" /> Score distribution
              </div>
              <span className="rounded-full bg-accent-gradient px-3 py-1 text-xs font-extrabold text-white">
                {total} Marks
              </span>
            </div>

            <div className="space-y-6">
              {judgingCriteria.map((criterion, i) => (
                <div key={criterion.label}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                    <span className="flex items-center gap-2.5 font-medium text-slate-200">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: COLORS[i % COLORS.length].hex }}
                      />
                      {criterion.label}
                    </span>
                    <span className="shrink-0 font-bold tabular-nums text-white">
                      {criterion.marks}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${COLORS[i % COLORS.length].bar} transition-[width] duration-1000 ease-out`}
                      style={{
                        width: mounted ? `${(criterion.marks / total) * 100}%` : '0%',
                        transitionDelay: `${i * 100}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Donut summary */}
          <div className="glass relative flex flex-col items-center justify-center overflow-hidden p-8 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-indigo-500/15 blur-[70px]" />
            <p className="relative text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-300">
              Total score
            </p>
            <div className="relative mt-6 h-44 w-44">
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: `conic-gradient(${conic})` }}
              />
              <div className="absolute inset-[18px] rounded-full bg-navy-950" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <p className="text-4xl font-extrabold tracking-tight text-white">{total}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Marks
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mt-7 flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-300" />
              <p>
                সবচেয়ে বেশি ওজন রয়েছে <span className="font-semibold text-white">মৌলিকতা</span> ও{' '}
                <span className="font-semibold text-white">কার্যকারিতায়</span>।
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
