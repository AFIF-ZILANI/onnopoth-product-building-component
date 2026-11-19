import { Mark } from './Logo';
import { event, idCardSample } from '@/lib/config';

/**
 * Competitor identity card.
 * Renders exactly the eight identity fields — nothing added, nothing omitted.
 * Used on the website (home) and inside the printable rulebook PDF.
 */
export default function CompetitorIdCard({ data = idCardSample }) {
  const fields = [
    { label: 'Full Name', value: data.fullName },
    { label: 'Institution', value: data.institution },
    { label: 'Class / Department', value: data.className },
    { label: 'WhatsApp', value: data.whatsapp },
    { label: 'Email', value: data.email },
    { label: 'GitHub Username', value: data.github },
    { label: 'Team Name', value: data.teamName },
    { label: 'Team Leader', value: data.teamLeader },
  ];

  return (
    <div className="id-card mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-surface shadow-lift">
      <div className="flex items-center gap-3 border-b border-line px-6 py-4 sm:px-8">
        <Mark className="h-8 w-8 shrink-0 text-ink" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">OnnoPoth</p>
          <p className="truncate text-xs text-ink-3">{event.name}</p>
        </div>
        <span className="rounded-full border border-line-strong px-2.5 py-1 text-[11px] font-semibold text-ink-2">Competitor ID</span>
      </div>
      <dl className="grid gap-x-8 gap-y-5 px-6 py-6 sm:grid-cols-2 sm:px-8 sm:py-7">
        {fields.map((field) => (
          <div key={field.label} className="min-w-0">
            <dt className="text-xs text-ink-3">{field.label}</dt>
            <dd className="mt-1 break-words text-[15px] font-semibold text-ink">{field.value}</dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-line bg-paper px-6 py-3 text-xs text-ink-3 sm:px-8">
        {event.organizer} · {event.mode}
      </div>
    </div>
  );
}
