import {
  ClipboardList,
  BadgeCheck,
  GitBranch,
  Hammer,
  CloudUpload,
  Send,
} from 'lucide-react';
import SectionHeading from './SectionHeading';

const steps = [
  {
    icon: ClipboardList,
    title: 'রেজিস্ট্রেশন ও আইডিয়া জমা',
    text: 'ফর্ম পূরণ করে প্রোডাক্টের নাম ও আইডিয়া জমা দিন (২০–২৩ নভেম্বর)।',
  },
  {
    icon: BadgeCheck,
    title: 'কনফার্মেশন পান',
    text: 'আইডিয়া যাচাইয়ের পর ২৫ নভেম্বর কনফার্মড তালিকা ঘোষণা হবে।',
  },
  {
    icon: GitBranch,
    title: 'অ্যাকাউন্ট প্রস্তুত',
    text: 'আগেই GitHub ও Vercel অ্যাকাউন্ট তৈরি করে রাখুন—Vercel-এ GitHub দিয়ে লগইন সবচেয়ে সহজ।',
  },
  {
    icon: Hammer,
    title: 'মূল দিনে নির্মাণ',
    text: '২৭ নভেম্বর সকাল ১০টার পর নতুন GitHub রিপো খুলে AI-এর সাহায্যে বানানো শুরু করুন।',
  },
  {
    icon: CloudUpload,
    title: 'Vercel ডিপ্লয়',
    text: 'রাত ৯টার মধ্যে Vercel-এ প্রোডাক্ট ডিপ্লয় শুরু করুন।',
  },
  {
    icon: Send,
    title: 'জমা দিন',
    text: 'রাত ১০টার আগে GitHub লিংক, Live লিংক ও README জমা দিন।',
  },
];

export default function HowItWorks() {
  return (
    <section id="rules" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="কীভাবে কাজ করবে"
          subtitle="মাত্র ৬টি ধাপ—এবং তুমি প্রস্তুত।"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="glass group relative overflow-hidden p-6">
              <span className="absolute right-5 top-3 text-5xl font-extrabold text-white/[0.04]">
                {i + 1}
              </span>
              <div className="mb-5 inline-grid h-11 w-11 place-items-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 transition group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
              {/* connector arrow on desktop */}
              {i < steps.length - 1 && (
                <span className="pointer-events-none absolute -bottom-3 right-4 hidden text-indigo-400/30 lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
