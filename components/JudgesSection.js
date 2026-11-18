import { Gavel, HeartHandshake, MessageCircle, Users } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { judges, contacts } from '@/lib/config';

export default function JudgesSection() {
  const organizer = contacts[0];

  return (
    <section data-reveal className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Judges & committee"
          title="বিচারকমণ্ডলী ও আয়োজক কমিটি"
          subtitle="২৮ নভেম্বর বিচারকমণ্ডলী প্রোডাক্ট যাচাই করবেন — তাদের সিদ্ধান্তই চূড়ান্ত।"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {/* Judges */}
          <div className="glass p-7 sm:p-9">
            <div className="mb-6 inline-grid h-12 w-12 place-items-center rounded-2xl bg-accent-gradient shadow-glow">
              <Gavel className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">বিচারকমণ্ডলী</h3>
            {judges.length ? (
              <div className="mt-5 space-y-3">
                {judges.map((judge) => (
                  <div key={judge.name} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-500/15 text-indigo-300">
                      <Users className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">{judge.name}</p>
                      <p className="text-xs text-slate-500">{judge.role || judge.detail || ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                বিচারকমণ্ডলীর নাম ২৬ নভেম্বর ব্রিফিংয়ের সাথে ঘোষণা করা হবে।
              </p>
            )}
          </div>

          {/* Organizing committee */}
          <div className="glass p-7 sm:p-9">
            <div className="mb-6 inline-grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500/15 text-indigo-300">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">আয়োজক কমিটি</h3>
            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-bold text-white">{organizer.name}</p>
              <p className="mt-0.5 text-sm text-indigo-200">{organizer.detail}</p>
              <a
                href={organizer.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-indigo-300 hover:text-indigo-200"
              >
                <MessageCircle className="h-3.5 w-3.5" /> {organizer.linkLabel} করুন →
              </a>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-slate-400">
              OnnoPoth — সবার জন্য উন্মুক্ত একটি লার্নিং কমিউনিটি।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
