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
    title: 'রেজিস্ট্রেশন ও আইডিয়া',
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
    text: 'আগেই GitHub ও Vercel অ্যাকাউন্ট তৈরি করে রাখুন—লগইন সবচেয়ে সহজ।',
  },
  {
    icon: Hammer,
    title: 'নির্মাণ শুরু',
    text: '২৭ নভেম্বর সকাল ১০টার পর নতুন রিপো খুলে AI-এর সাহায্যে বানানো শুরু করুন।',
  },
  {
    icon: CloudUpload,
    title: 'Vercel ডিপ্লয়',
    text: 'রাত ৯টার মধ্যে Vercel-এ প্রোডাক্ট ডিপ্লয় শুরু করুন।',
  },
  {
    icon: Send,
    title: 'সবকিছু জমা দিন',
    text: 'রাত ১০টার আগে GitHub লিংক, Live লিংক ও README জমা দিন।',
  },
];

export default function HowItWorks() {
  return (
    <section data-reveal id="rules" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="04"
          eyebrow="How it works"
          title="কীভাবে কাজ করবে"
          subtitle="মাত্র ৬টি ধাপ—এবং তুমি প্রস্তুত।"
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-white/[0.06]"
            >
              {/* bottom accent line */}
              <div className="absolute inset-x-0 bottom-0 h-[2px] scale-x-0 bg-accent-gradient transition-transform duration-500 group-hover:scale-x-100" />

              <div className="flex items-start justify-between">
                <div className="relative grid h-12 w-12 place-items-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 transition group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-4xl font-extrabold leading-none text-white/[0.05]">
                  0{i + 1}
                </span>
              </div>

              <h3 className="mt-6 text-base font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>

              <div className="mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-300/70">
                Step {i + 1} of 6
                <span className="h-px flex-1 bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
