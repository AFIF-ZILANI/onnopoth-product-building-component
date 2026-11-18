import { GraduationCap, Users, UserCheck, HeartHandshake } from 'lucide-react';
import SectionHeading from './SectionHeading';

const cards = [
  {
    icon: GraduationCap,
    title: 'যেকোনো শিক্ষার্থী',
    text: 'যেকোনো প্রতিষ্ঠানের শিক্ষার্থী বা শিক্ষানবিস—জুনিয়র হোক বা সিনিয়র, সবাই অংশ নিতে পারেন।',
  },
  {
    icon: UserCheck,
    title: 'একা বা টিম',
    text: 'একা অথবা সর্বোচ্চ ৩ জনের টিম করে অংশ নেওয়া যাবে।',
  },
  {
    icon: Users,
    title: 'একজন, একটি টিম',
    text: 'একজন ব্যক্তি একটির বেশি টিমে থাকতে পারবে না। অনুগ্রহ করে একটি টিমই বেছে নিন।',
  },
  {
    icon: HeartHandshake,
    title: 'অভিজ্ঞতা লাগবে না',
    text: 'প্রোগ্রামিংয়ে কম অভিজ্ঞতা থাকলেও সমস্যা নেই—AI তোমার পাশে আছে।',
  },
];

export default function WhoCanJoin() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Who can join"
          title="কে অংশ নিতে পারবে?"
          subtitle="শিক্ষার্থী, শিক্ষানবিস আর কৌতূহলী মন—সবাইকে স্বাগতম। শর্ত খুবই সহজ:"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass p-6 transition hover:-translate-y-1 hover:border-indigo-400/40">
              <div className="mb-5 inline-grid h-12 w-12 place-items-center rounded-2xl border border-indigo-400/30 bg-indigo-500/10 text-indigo-300">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
