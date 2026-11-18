'use client';

import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { judgingCriteria } from '@/lib/config';

const BAR_COLORS = [
  'from-blue-500 to-indigo-500',
  'from-indigo-500 to-violet-500',
  'from-violet-500 to-purple-500',
  'from-purple-500 to-fuchsia-500',
  'from-fuchsia-500 to-pink-500',
  'from-cyan-500 to-blue-500',
];

export default function JudgingCriteria() {
  const [mounted, setMounted] = useState(false);
  const total = judgingCriteria.reduce((sum, c) => sum + c.marks, 0);

  // Kick off the width animation after the first paint.
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Judging criteria"
          title="বিচারের মানদণ্ড"
          subtitle={`মোট ${total} নম্বর। নিচের বিভাগগুলোর ভিত্তিতে প্রোডাক্ট যাচাই করা হবে।`}
        />

        <div className="glass mt-14 p-6 sm:p-10">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <BarChart3 className="h-4 w-4 text-indigo-300" />Score distribution
            </div>
            <span className="rounded-full bg-accent-gradient px-3 py-1 text-xs font-bold text-white">
              {total} Marks
            </span>
          </div>

          <div className="space-y-6">
            {judgingCriteria.map((criterion, i) => (
              <div key={criterion.label}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-slate-200">{criterion.label}</span>
                  <span className="shrink-0 font-bold tabular-nums text-white">
                    {criterion.marks}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${BAR_COLORS[i % BAR_COLORS.length]} transition-[width] duration-1000 ease-out`}
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
      </div>
    </section>
  );
}
