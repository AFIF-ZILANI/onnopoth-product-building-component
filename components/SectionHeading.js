/**
 * Shared section header used across the site.
 * `index` renders a small numbered eyebrow (01 / 02 / …) for an editorial feel.
 */
export default function SectionHeading({ eyebrow, index, title, subtitle, align = 'center' }) {
  const centered = align === 'center';

  return (
    <div className={`max-w-2xl ${centered ? 'mx-auto text-center' : 'text-left'}`}>
      <div className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
        {index && (
          <span className="text-gradient-cool text-sm font-extrabold tabular-nums">{index}</span>
        )}
        <span className="h-px w-10 bg-gradient-to-r from-indigo-400 via-purple-400 to-transparent" />
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
          {eyebrow}
        </span>
      </div>
      <h2 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">{subtitle}</p>
      )}
    </div>
  );
}
