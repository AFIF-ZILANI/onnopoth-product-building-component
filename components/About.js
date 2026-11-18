import { Lightbulb, Code2, Rocket, Bot } from 'lucide-react';
import SectionHeading from './SectionHeading';

const points = [
  {
    icon: Lightbulb,
    title: 'একটি বাস্তব সমস্যা বাছাই',
    text: 'তোমার আশেপাশের এমন একটি সমস্যা খুঁজে বের করো, যার সমাধান একটি ওয়েব প্রোডাক্ট দেওয়া যায়।',
  },
  {
    icon: Bot,
    title: 'AI কে সহকারী বানাও',
    text: 'কোড, ডিজাইন আর ডিবাগিং—সব কাজে ChatGPT, Claude, Cursor-এর মতো টুল ব্যবহার করা যাবে। এটিই প্রতিযোগিতার মূল বিষয়।',
  },
  {
    icon: Code2,
    title: 'তৈরি করো গত ১২ ঘণ্টায়',
    text: '২৭ নভেম্বর সকাল ১০টা থেকে রাত ১০টা—মাত্র ১২ ঘণ্টায় আইডিয়াকে একটি কাজ করা প্রোডাক্টে রূপ দিতে হবে।',
  },
  {
    icon: Rocket,
    title: 'Vercel-এ ডিপ্লয়',
    text: 'কোড GitHub-এ রেখে প্রোডাক্টটি Vercel-এ লাইভ করে জমা দিতে হবে। ফ্রি প্ল্যানই যথেষ্ট।',
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="About the competition"
          title="আইডিয়া থেকে লাইভ প্রোডাক্ট"
          subtitle="এটি কোনো পরীক্ষা নয়—এটি একটি নির্মাণের অভিজ্ঞতা। AI-এর সাহায্যে তুমি যা ভাবছো, তা কয়েক ঘণ্টার মধ্যে বাস্তবায়ন করতে পারবে।"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {points.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              className="glass group p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/40"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="mb-5 inline-grid h-12 w-12 place-items-center rounded-2xl bg-accent-gradient shadow-glow">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{text}</p>
            </div>
          ))}
        </div>

        <div className="glass mt-10 flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <Rocket className="h-5 w-5" />
          </span>
          <p className="text-sm leading-relaxed text-slate-300">
            <span className="font-bold text-white">কোনো অভিজ্ঞতা লাগবে না।</span> যারা কখনো কোড লেখেননি,
            তারাও AI-এর সাহায্যে এই প্রতিযোগিতায় অংশ নিতে পারেন—আসল কাজ হলো সমস্যা বাছাই এবং তার
            সমাধান ভাবা।
          </p>
        </div>
      </div>
    </section>
  );
}
