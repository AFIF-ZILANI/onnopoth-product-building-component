'use client';

import { useState } from 'react';
import { ArrowUpRight, ChevronDown, MessageCircle } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { faqItems, extraFaqItems } from '@/lib/rulebook';
import { contacts } from '@/lib/config';

const allFaqItems = [...faqItems, ...extraFaqItems];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          {/* Left — heading + help card */}
          <div>
            <SectionHeading
              index="08"
              eyebrow="FAQ"
              align="left"
              title="সাধারণ প্রশ্ন"
              subtitle="মনে কোনো প্রশ্ন এসেছে? এখানে উত্তর পেতে পারো।"
            />

            <div className="glass relative mt-9 overflow-hidden p-7">
              <div className="absolute inset-x-0 top-0 h-1 bg-accent-gradient" />
              <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-2xl bg-indigo-500/15 text-indigo-300">
                <MessageCircle className="h-5 w-5" />
              </div>
              <p className="text-base font-bold text-white">এখনো কিছু জানার আছে?</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                নিচ থেকে আয়োজক কমিটির সাথে যোগাযোগ করুন—হেল্প করতে আমরা প্রস্তুত।
              </p>
              <div className="mt-6 space-y-3">
                {contacts.map((person) => (
                  <a
                    key={person.name}
                    href={person.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200 transition hover:border-indigo-400/40"
                  >
                    <span>
                      <span className="block font-semibold">{person.name}</span>
                      <span className="text-xs text-slate-500">{person.detail}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-indigo-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — accordion */}
          <div className="space-y-3">
            {allFaqItems.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={item.q}
                  className={`overflow-hidden rounded-2xl border transition duration-300 ${
                    isOpen
                      ? 'border-indigo-400/40 bg-indigo-500/[0.07]'
                      : 'border-white/10 bg-white/[0.025] hover:border-white/20'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 p-5 text-left"
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[11px] font-extrabold ${
                        isOpen ? 'bg-accent-gradient text-white' : 'bg-white/5 text-slate-500'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-white sm:text-base">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-indigo-300' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="border-t border-white/10 px-5 py-5 pl-[4.5rem] text-sm leading-relaxed text-slate-400">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
