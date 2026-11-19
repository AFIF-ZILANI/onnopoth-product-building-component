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
    <div className="id-card mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-navy-900/80 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
      {/* Accent strip */}
      <div className="id-card-accent h-1.5 w-full bg-accent-gradient" />

      {/* Header — branding only, no extra identity fields */}
      <div className="id-card-header flex flex-wrap items-center gap-4 border-b border-white/10 px-6 py-5 sm:px-9">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-light.svg" alt="OnnoPoth" className="h-6 w-auto shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-indigo-300">
            OnnoPoth
          </p>
          <p className="truncate text-sm font-bold text-white sm:text-base">{event.name}</p>
        </div>
        <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-indigo-200">
          Competitor ID
        </span>
      </div>

      {/* Identity fields — exactly eight, in order */}
      <div className="id-card-body grid gap-x-8 gap-y-5 px-6 py-7 sm:grid-cols-2 sm:px-9 sm:py-9">
        {fields.map((field) => (
          <div key={field.label} className="min-w-0">
            <p className="id-card-label text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              {field.label}
            </p>
            <p className="id-card-value mt-1 break-words text-sm font-semibold text-white sm:text-base">
              {field.value}
            </p>
          </div>
        ))}
      </div>

      {/* Footer line — no extra identity information */}
      <div className="id-card-footer border-t border-white/10 px-6 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 sm:px-9">
        {event.organizer} · {event.mode}
      </div>
    </div>
  );
}
