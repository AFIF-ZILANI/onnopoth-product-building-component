import Link from 'next/link';
import { ArrowLeft, BookOpen, List } from 'lucide-react';
import PrintButton from '@/components/PrintButton';
import RulebookRenderer from '@/components/RulebookRenderer';
import { rulebookIntro, rulebookSections } from '@/lib/rulebook';
import { event } from '@/lib/config';

export const metadata = {
  title: 'রুলবুক',
  description: `${event.name} – সম্পূর্ণ রুলবুক। আয়োজক: ${event.organizer}।`,
  openGraph: {
    title: `রুলবুক | ${event.name}`,
    description: `${event.name} – আয়োজক: ${event.organizer}`,
  },
};

export default function RulebookPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 sm:pt-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="no-print mb-10">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-indigo-300"
          >
            <ArrowLeft className="h-4 w-4" /> হোমে ফিরে যান
          </Link>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-bold text-indigo-200">
                <BookOpen className="h-3.5 w-3.5" /> Official Rulebook
              </span>
              <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                {rulebookIntro.title}
              </h1>
              <p className="mt-2 text-sm text-slate-400">{rulebookIntro.organizer}</p>
            </div>
            <PrintButton />
          </div>
        </header>

        {/* Print header (hidden on screen, shown in the PDF) */}
        <div className="hidden print:block print:mb-8">
          <h1 className="text-2xl font-bold">{rulebookIntro.title}</h1>
          <p className="text-sm">{rulebookIntro.organizer}</p>
        </div>

        {/* Content + sticky table of contents */}
        <div className="grid items-start gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="no-print hidden lg:block">
            <nav className="glass sticky top-28 p-5">
              <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-300">
                <List className="h-3.5 w-3.5" /> Contents
              </p>
              <ol className="space-y-1.5">
                {rulebookSections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block rounded-lg px-2 py-1.5 text-[13px] leading-snug text-slate-400 transition hover:bg-white/5 hover:text-white"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className="print-document glass p-6 sm:p-10">
            <RulebookRenderer sections={rulebookSections} />

            <div className="no-print mt-12 flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-6 sm:flex-row">
              <Link href="/#register" className="btn-primary">
                রেজিস্ট্রেশন করুন
              </Link>
              <Link href="/submit" className="btn-secondary">
                প্রোডাক্ট জমা দিন
              </Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
