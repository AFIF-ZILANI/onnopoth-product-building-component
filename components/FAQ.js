'use client';

import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { faqItems, extraFaqItems } from '@/lib/rulebook';

const allFaqItems = [...faqItems, ...extraFaqItems];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="সাধারণ প্রশ্ন"
          subtitle="মনে কোনো প্রশ্ন এসেছে? এখানে উত্তর পেতে পারো।"
        />

        <div className="mt-12 space-y-3">
          {allFaqItems.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q} className="glass overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="flex items-center gap-3 font-semibold text-white">
                    <HelpCircle className="h-5 w-5 shrink-0 text-indigo-300" />
                    {item.q}
                  </span>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-slate-300">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-white/10 px-5 py-5 sm:pl-12 text-sm leading-relaxed text-slate-400">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
