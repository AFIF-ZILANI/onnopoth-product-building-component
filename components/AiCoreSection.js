import { Bot, MousePointer2, Sparkles, WandSparkles } from 'lucide-react';
import SectionHeading from './SectionHeading';
import LazyObject3D from './three/LazyObject3D';

const points = [
  {
    icon: Bot,
    title: 'AI-কে সহকারী বানাও',
    text: 'কোড, ডিজাইন ও ডিবাগিংয়ের জন্য ChatGPT, Claude বা Cursor — যেকোনো টুল ব্যবহার করা যাবে।',
  },
  {
    icon: WandSparkles,
    title: 'আইডিয়া থেকে প্রোডাক্ট',
    text: '১২ ঘণ্টার মধ্যে একটা বাস্তব সমস্যার সমাধান বানিয়ে Vercel-এ লাইভ করে দেখাও।',
  },
];

/** Interactive 3D section — the object can be dragged to rotate. */
export default function AiCoreSection() {
  return (
    <section id="ai-core" data-reveal className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute left-2/3 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Powered by AI"
              align="left"
              title={
                <>
                  AI-এর সাথে <span className="text-gradient-cool">বানানোর গল্প</span>
                </>
              }
              subtitle="এই প্রতিযোগিতার আসল বিষয় হলো AI-কে কাজে লাগানো। নিচের অবজেক্টটা ঘুরিয়ে দেখো — ইন্টারঅ্যাকটিভ 3D!"
            />

            <div className="mt-9 space-y-4">
              {points.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-500/15 text-indigo-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D canvas */}
          <div className="glass relative h-[340px] overflow-hidden rounded-[32px] sm:h-[440px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(99,102,241,0.18),transparent_60%)]" />
            <LazyObject3D variant="core" className="relative z-10" />
            <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-navy-950/70 px-4 py-2 text-[11px] font-semibold text-slate-300 backdrop-blur">
              <MousePointer2 className="h-3.5 w-3.5 text-indigo-300" /> Drag to rotate · AI Core
            </div>
            <Sparkles className="pointer-events-none absolute right-6 top-6 h-5 w-5 text-fuchsia-300/70" />
          </div>
        </div>
      </div>
    </section>
  );
}
