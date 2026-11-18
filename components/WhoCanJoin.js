import { GraduationCap, Users, UserCheck, HeartHandshake, ArrowRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

const cards = [
  {
    icon: GraduationCap,
    title: 'যেকোনো শিক্ষার্থী',
    text: 'জুনিয়র বা সিনিয়র—যেকোনো প্রতিষ্ঠানের শিক্ষার্থী বা শিক্ষানবিস সবাই অংশ নিতে পারেন।',
  },
  {
    icon: UserCheck,
    title: 'একা বা টিম',
    text: 'একা অথবা সর্বোচ্চ ৩ জনের টিম করে অংশ নেওয়া যাবে।',
  },
  {
    icon: Users,
    title: 'একজন, একটি টিম',
    text: 'একজন ব্যক্তি একটির বেশি টিমে থাকতে পারবে না। একটি টিমই বেছে নিন।',
  },
  {
    icon: HeartHandshake,
    title: 'অভিজ্ঞতা লাগবে না',
    text: 'প্রোগ্রামিংয়ে কম অভিজ্ঞতা থাকলেও সমস্যা নেই—AI তোমার পাশে আছে।',
  },
];

export default function WhoCanJoin() {
  return (
    <section data-reveal className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="02"
          eyebrow="Who can join"
          title="কে অংশ নিতে পারবে?"
          subtitle="শিক্ষার্থী, শিক্ষানবিস আর কৌতূহলী মন—সবাইকে স্বাগতম। শর্ত খুবই সহজ:"
        />

        {/* Hairline-separated panel — clean and scannable */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              className="group relative bg-navy-900/95 p-7 transition duration-300 hover:bg-navy-800/95"
            >
              <span className="absolute right-5 top-4 text-4xl font-extrabold leading-none text-white/[0.04]">
                0{i + 1}
              </span>
              <div className="mb-6 inline-grid h-12 w-12 place-items-center rounded-2xl border border-indigo-400/25 bg-indigo-500/10 text-indigo-300 transition group-hover:scale-110 group-hover:border-indigo-400/60">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{text}</p>
            </div>
          ))}
        </div>

        <div className="glass mt-5 flex flex-col items-center justify-between gap-5 overflow-hidden p-6 sm:flex-row sm:p-7">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent-gradient shadow-glow">
              <HeartHandshake className="h-6 w-6 text-white" />
            </span>
            <div>
              <p className="text-base font-bold text-white">নতুন হলেও চলবে 🧠</p>
              <p className="mt-0.5 text-sm text-slate-400">
                আসল কাজ হলো একটা বাস্তব সমস্যা বাছা—বাকিটা AI-এর সাহায্যে শিখে নিতে পারো।
              </p>
            </div>
          </div>
          <a
            href="#register"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-indigo-300 transition hover:text-indigo-200"
          >
            রেজিস্ট্রেশন করুন <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
