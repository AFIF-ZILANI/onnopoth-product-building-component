import { ArrowUpRight, Bot, MessageCircle } from 'lucide-react';
import SectionHeading from './SectionHeading';
import FaqChatbot from './FaqChatbot';
import { contacts } from '@/lib/config';

export default function FAQ() {
  return (
    <section id="faq" data-reveal className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-[46rem] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          {/* Left — heading + human fallback */}
          <div>
            <SectionHeading
              eyebrow="AI assistant"
              align="left"
              title={
                <>
                  প্রশ্ন করো, <span className="text-gradient-warm">উত্তর পাও</span>
                </>
              }
              subtitle="এখন আর accordion খুঁজতে হবে না — আমাদের AI অ্যাসিস্ট্যান্টের সাথে চ্যাট করে সাধারণ প্রশ্নের উত্তর নিন।"
            />

            <div className="glass relative mt-9 overflow-hidden p-7">
              <div className="absolute inset-x-0 top-0 h-1 bg-accent-gradient" />
              <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-2xl bg-indigo-500/15 text-indigo-300">
                <MessageCircle className="h-5 w-5" />
              </div>
              <p className="text-base font-bold text-white">বট উত্তর দিতে না পারলে?</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                নিচ থেকে আয়োজক কমিটির সাথে সরাসরি যোগাযোগ করুন — হেল্প করতে আমরা প্রস্তুত।
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

            <p className="mt-5 flex items-center gap-2 text-xs text-slate-500">
              <Bot className="h-3.5 w-3.5 text-indigo-300" /> চ্যাটটি রুলবুকের তথ্য দিয়ে চলে — যেকোনো প্রশ্ন চেষ্টা করে দেখুন।
            </p>
          </div>

          {/* Right — chatbot */}
          <FaqChatbot />
        </div>
      </div>
    </section>
  );
}
