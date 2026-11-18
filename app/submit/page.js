import Link from 'next/link';
import { ArrowLeft, Clock3 } from 'lucide-react';
import SubmissionForm from '@/components/SubmissionForm';
import { event, dates } from '@/lib/config';

export const metadata = {
  title: 'প্রোডাক্ট জমা দিন',
  description: `${event.name} — ফাইনাল সাবমিশন। ${dates.submissionDeadlineLabel}।`,
  openGraph: {
    title: `প্রোডাক্ট জমা দিন | ${event.name}`,
    description: `${event.name} — ফাইনাল সাবমিশন ফর্ম।`,
  },
};

export default function SubmitPage() {
  return (
    <div className="min-h-screen pt-20 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-indigo-300"
        >
          <ArrowLeft className="h-4 w-4" /> হোমে ফিরে যান
        </Link>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1.5 text-xs font-bold text-fuchsia-200">
          <Clock3 className="h-3.5 w-3.5" /> {dates.submissionDeadlineLabel}
        </div>
      </div>
      <SubmissionForm />
    </div>
  );
}
