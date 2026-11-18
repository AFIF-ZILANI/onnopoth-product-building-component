import { Bot, Check, Code2, Lightbulb, Rocket } from 'lucide-react';
import SectionHeading from './SectionHeading';

const highlights = [
  'একটি বাস্তব সমস্যা বেছে নাও',
  'AI টুল দিয়ে সমাধান তৈরি করো',
  'Vercel-এ লাইভ করে জমা দাও',
];

const features = [
  {
    icon: Lightbulb,
    title: 'সমস্যা খোঁজা',
    text: 'আশেপাশের এমন একটা সমস্যা খুঁজে বের করো, যার সমাধান একটা ওয়েব প্রোডাক্ট দিতে পারে।',
  },
  {
    icon: Bot,
    title: 'AI তোমার সহকারী',
    text: 'কোড, ডিজাইন আর ডিবাগিং—ChatGPT, Claude, Cursor দিয়েই করা যায়। এটাই প্রতিযোগিতার মূল বিষয়।',
  },
  {
    icon: Code2,
    title: '১২ ঘণ্টার বিল্ড ম্যারাথন',
    text: '২৭ নভেম্বর সকাল ১০টা থেকে রাত ১০টা—আইডিয়াকে কাজ করা প্রোডাক্টে বদলানোর সময়।',
  },
  {
    icon: Rocket,
    title: 'লাইভ ডিপ্লয়',
    text: 'কোড GitHub-এ আর প্রোডাক্ট Vercel-এ লাইভ করেই জমা দিতে হবে। ফ্রি প্ল্যানই যথেষ্ট।',
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Left — statement */}
          <div>
            <SectionHeading
              index="01"
              eyebrow="About the competition"
              align="left"
              title={
                <>
                  আইডিয়া থেকে <span className="gradient-text">লাইভ প্রোডাক্ট</span>
                </>
              }
              subtitle="এটা কোনো এক্সাম নয়—আসল কাজ হলো হাতে-কলমে কিছু বানানো। AI-এর সাহায্যে তোমার আইডিয়া কয়েক ঘণ্টার মধ্যেই বাস্তব রূপ পাবে।"
            />

            <ul className="mt-9 space-y-3.5">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-3">
              {[
                { value: '12h', label: 'Build time' },
                { value: 'AI', label: 'Powered' },
                { value: '100%', label: 'Online' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3"
                >
                  <p className="text-xl font-extrabold text-white">{stat.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — feature grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, text }, i) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-white/[0.06]"
              >
                <span className="absolute right-5 top-3 text-5xl font-extrabold leading-none text-white/[0.04]">
                  0{i + 1}
                </span>
                <div className="relative mb-5 inline-grid h-11 w-11 place-items-center rounded-xl bg-accent-gradient shadow-glow">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="relative text-base font-bold text-white">{title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
