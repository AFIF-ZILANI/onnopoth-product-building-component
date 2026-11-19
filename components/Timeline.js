import { CalendarRange, CheckCircle2, ListChecks, Megaphone, Cpu, Trophy } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { dates } from '@/lib/config';

const items = [
  {
    icon: CalendarRange,
    date: dates.registrationWindowLabel,
    title: 'রেজিস্ট্রেশন ও আইডিয়া জমা',
    text: 'ফর্ম পূরণ করে প্রোডাক্টের নাম ও আইডিয়া জমা দিন। টিম হলে সবার নাম ও টিম লিডার উল্লেখ করুন।',
  },
  {
    icon: ListChecks,
    date: '২৪ নভেম্বর',
    title: 'আইডিয়া যাচাই',
    text: 'আইডিয়ার স্পষ্টতা ও ১২ ঘণ্টায় বানানোর সম্ভাবনা যাচাই করবে আয়োজক কমিটি।',
  },
  {
    icon: CheckCircle2,
    date: '২৫ নভেম্বর',
    title: 'কনফার্মড তালিকা ঘোষণা',
    text: 'শুধু কনফার্মড প্রতিযোগীরাই মূল প্রতিযোগিতায় অংশ নিতে পারবেন।',
  },
  {
    icon: Megaphone,
    date: '২৬ নভেম্বর',
    title: 'নিয়মাবলি ও ব্রিফিং',
    text: 'কনফার্মড প্রতিযোগীদের গ্রুপে যুক্ত করা হবে এবং জমা দেওয়ার পদ্ধতি বুঝিয়ে দেওয়া হবে।',
  },
  {
    icon: Cpu,
    date: '২৭ নভেম্বর · শুক্রবার',
    title: 'মূল প্রতিযোগিতা · ১২ ঘণ্টা',
    text: 'সকাল ১০টার পর নতুন GitHub রিপো খুলে কাজ শুরু, রাত ৯টায় Vercel ডিপ্লয় শুরু, রাত ১০টায় জমা দেওয়া।',
    highlight: true,
  },
  {
    icon: Trophy,
    date: '২৮ নভেম্বর',
    title: 'বিচার ও ফলাফল',
    text: 'বিচারকমণ্ডলী প্রোডাক্ট যাচাই করবে এবং সন্ধ্যায় ফলাফল ঘোষণা করা হবে।',
  },
];

export default function Timeline() {
  return (
    <section data-reveal id="timeline" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-indigo-500/25 to-transparent" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="03"
          eyebrow="Timeline"
          title="প্রতিযোগিতার সময়সূচি"
          subtitle="রেজিস্ট্রেশন থেকে ফলাফল—সব ধাপ এক নজরে।"
        />

        <div className="relative mt-16">
          {/* glowing spine */}
          <div className="absolute bottom-2 left-[19px] top-2 w-px bg-gradient-to-b from-indigo-400/70 via-purple-400/40 to-transparent sm:left-1/2 sm:-translate-x-1/2" />

          <ol className="space-y-7">
            {items.map((item, i) => {
              const Icon = item.icon;
              const left = i % 2 === 0;

              return (
                <li key={item.title} className="relative sm:grid sm:grid-cols-2 sm:gap-14">
                  {/* node */}
                  <span
                    className={`absolute left-[7px] top-7 z-10 grid h-[25px] w-[25px] place-items-center rounded-full border-2 sm:left-1/2 sm:-translate-x-1/2 ${
                      item.highlight
                        ? 'border-fuchsia-400 bg-fuchsia-500 shadow-[0_0_22px_rgba(217,70,239,0.8)]'
                        : 'border-indigo-400 bg-navy-950 shadow-[0_0_0_5px_rgba(99,102,241,0.08)]'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${item.highlight ? 'bg-white' : 'bg-indigo-400'}`} />
                  </span>

                  <div
                    className={`ml-12 sm:ml-0 ${
                      left ? 'sm:col-start-1 sm:pr-2 sm:text-right' : 'sm:col-start-2 sm:pl-2'
                    }`}
                  >
                    <div
                      className={`group relative overflow-hidden rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 ${
                        item.highlight
                          ? 'border-fuchsia-400/40 bg-fuchsia-500/[0.09] shadow-[0_25px_60px_-35px_rgba(217,70,239,0.65)]'
                          : 'border-white/10 bg-white/[0.035] hover:border-indigo-400/40 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div
                        className={`relative flex flex-wrap items-center gap-2 ${
                          left ? 'sm:justify-end' : ''
                        }`}
                      >
                        {/* Clear step number — always fully inside the card */}
                        <span
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[11px] font-extrabold tabular-nums ${
                            item.highlight
                              ? 'bg-fuchsia-400/25 text-fuchsia-100'
                              : 'bg-indigo-500/20 text-indigo-200'
                          }`}
                          aria-label={`ধাপ ${i + 1}`}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            item.highlight
                              ? 'bg-fuchsia-400/20 text-fuchsia-200'
                              : 'bg-indigo-500/15 text-indigo-300'
                          }`}
                        >
                          {item.date}
                        </span>
                        <span
                          className={`grid h-7 w-7 place-items-center rounded-lg ${
                            item.highlight ? 'bg-fuchsia-400/20 text-fuchsia-200' : 'bg-white/5 text-slate-400'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                      </div>

                      {item.highlight && (
                        <span className="relative mt-4 inline-block rounded-full bg-accent-gradient px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-white">
                          Main Event
                        </span>
                      )}

                      <h3 className="relative mt-3 text-base font-bold text-white sm:text-lg">
                        {item.title}
                      </h3>
                      <p className="relative mt-2 text-sm leading-relaxed text-slate-400">{item.text}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
