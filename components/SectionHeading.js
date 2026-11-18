/**
 * Reusable section title with a small gradient eyebrow + Bangla heading.
 */
export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  const alignment = align === 'left' ? 'text-left' : 'text-center mx-auto';
  return (
    <div className={`${alignment} max-w-2xl`}>
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-indigo-300">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-slate-400">{subtitle}</p>}
      <div className={`mt-5 h-1 w-20 rounded-full bg-accent-gradient ${align === 'center' ? 'mx-auto' : ''}`} />
    </div>
  );
}
