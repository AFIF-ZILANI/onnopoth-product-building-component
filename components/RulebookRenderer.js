import { submissionLink } from '@/lib/config';

/**
 * Renders one typed content block. Blocks are defined in lib/rulebook.js.
 * Keeping the renderer generic means the rulebook content stays in one file.
 */
function replaceTokens(text) {
  return String(text).replaceAll('{{SUBMISSION_LINK}}', submissionLink);
}

export function renderBlock(block, key) {
  switch (block.type) {
    case 'p':
      return (
        <p key={key} className="mb-4 text-[15px] leading-[1.9] text-slate-300 last:mb-0">
          {replaceTokens(block.text)}
        </p>
      );

    case 'list':
      return (
        <ul key={key} className="mb-4 list-disc space-y-2 pl-6 text-[15px] leading-[1.9] text-slate-300 marker:text-indigo-400 last:mb-0">
          {block.items.map((item, i) => (
            <li key={i}>{replaceTokens(item)}</li>
          ))}
        </ul>
      );

    case 'numbered':
      return (
        <ol key={key} className="mb-4 list-decimal space-y-3 pl-6 text-[15px] leading-[1.9] text-slate-300 marker:font-bold marker:text-indigo-400 last:mb-0">
          {block.items.map((item, i) => (
            <li key={i}>{replaceTokens(item)}</li>
          ))}
        </ol>
      );

    case 'table':
      return (
        <div key={key} className="mb-5 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[440px] border-collapse text-left text-[15px]">
            <tbody>
              {block.rows.map(([label, value], i) => (
                <tr key={i} className="border-b border-white/10 last:border-0 odd:bg-white/[0.03]">
                  <th className="w-2/5 px-4 py-3 align-top font-bold text-slate-100">
                    {replaceTokens(label)}
                  </th>
                  <td className="px-4 py-3 align-top leading-relaxed text-slate-300">
                    {replaceTokens(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'steps':
      return (
        <div key={key} className="space-y-7">
          {block.items.map((step, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <h4 className="mb-3 flex items-center gap-2.5 text-base font-bold text-white">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent-gradient text-xs font-extrabold text-white">
                  {i + 1}
                </span>
                {replaceTokens(step.title)}
              </h4>
              <div>{step.blocks.map((b, j) => renderBlock(b, `${key}-${i}-${j}`))}</div>
            </div>
          ))}
        </div>
      );

    case 'qa':
      return (
        <div key={key} className="space-y-4">
          {block.items.map((qa, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
              <p className="font-bold text-white">প্রশ্ন: {replaceTokens(qa.q)}</p>
              <p className="mt-2 text-[15px] leading-[1.9] text-slate-300">
                <span className="font-semibold text-indigo-300">উত্তর:</span> {replaceTokens(qa.a)}
              </p>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}

/**
 * Renders all rulebook sections. `section.id` is used for the anchor links in
 * the table of contents.
 */
export default function RulebookRenderer({ sections }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="mb-12 scroll-mt-28 last:mb-0">
          <h2 className="mb-5 border-b border-white/10 pb-3 text-xl font-extrabold text-white sm:text-2xl">
            {section.title}
          </h2>
          <div>{section.blocks.map((block, i) => renderBlock(block, `${section.id}-${i}`))}</div>
        </section>
      ))}
    </>
  );
}
