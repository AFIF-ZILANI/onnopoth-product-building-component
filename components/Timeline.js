import { CalendarRange, CheckCircle2, ListChecks, Megaphone, Cpu, Trophy } from 'lucide-react';
import SectionHeading from './SectionHeading';

const items = [
  {
    icon: CalendarRange,
    date: '২০–২৩ নভেম্বর',
    title: 'রেজিস্ট্রেশন ও আইডিয়া জমা',
    text: 'ফর্ম পূরণ করে নিজের আইডিয়া জমা দিন। টিম হলে সবার নাম ও টিম লিডার উল্লেখ করুন।',
  },
  {
    icon: ListChecks,
    date: '২৪ নভেম্বর',
    title: 'আইডিয়া যাচাই',
    text: 'আয়োজক কমিটি আইডিয়াগুলোর স্পষ্টতা ও ১২ ঘণ্টায় বানানোর সম্ভাবনা যাচাই করবে।',
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
    date: '২৭ নভেম্বর (শুক্রবার)',
    title: 'মূল প্রতিযোগিতা · ১২ ঘণ্টা',
    text: 'সকাল ১০টা থেকে রাত ১০টা। ১০টার পর নতুন GitHub রিপো খুলে কাজ শুরু, রাত ৯টায় Vercel ডিপ্লয় শুরু।',
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
    <section id="timeline" className="relative py-20 sm:py-28">
      {/* subtle divider glow */}
      <div className="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Timeline"
          title="প্রতিযোগিতার সময়সূচি"
          subtitle="রেজিস্ট্রেশন থেকে ফলাফল—সব ধাপ এক নজরে।"
        />

        <div className="relative mt-14">
          {/* vertical line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-indigo-400/60 via-purple-400/40 to-transparent sm:left-1/2 sm:-translate-x-1/2" />

          <ol className="space-y-8">
            {items.map((item, i) => {
              const Icon = item.icon;
              const left = i % 2 === 0;
              return (
                <li key={item.title} className="relative sm:grid sm:grid-cols-2 sm:gap-12">
                  {/* dot */}
                  <span
                    className={`absolute left-[7px] top-6 z-10 grid h-[25px] w-[25px] place-items-center rounded-full border-2 sm:left-1/2 sm:-translate-x-1/2 ${
                      item.highlight
                        ? 'border-fuchsia-400 bg-fuchsia-500 shadow-[0_0_18px_rgba(217,70,239,0.7)]'
                        : 'border-indigo-400 bg-navy-900'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${item.highlight ? 'bg-white' : 'bg-indigo-400'}`} />
                  </span>

                  {/* card */}
                  <div
                    className={`ml-12 sm:ml-0 ${
                      left ? 'sm:col-start-1 sm:pr-2 sm:text-right' : 'sm:col-start-2 sm:pl-2'
                    }`}
                  >
                    <div
                      className={`glass p-5 transition hover:-translate-y-0.5 hover:border-indigo-400/40 ${
                        item.highlight ? '!border-fuchsia-400/40 bg-fuchsia-500/[0.07]' : ''
                      }`}
                    >
                      <div
                        className={`mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-indigo-300 ${
                          left ? 'sm:justify-end' : ''
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.date}
                      </div>
                      <h3 className="text-base font-bold text-white sm:text-lg">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.text}</p>
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
