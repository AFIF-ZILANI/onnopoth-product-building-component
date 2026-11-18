import { Crown, Medal, Award, Gift, Sparkles } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { prizes, event } from '@/lib/config';

/**
 * Premium prize cards — each theme carries its own metallic gradient, glow and
 * border colour so the three places read instantly (gold / silver / bronze).
 */
const themes = {
  gold: {
    light: '#FDE68A',
    gradient: 'linear-gradient(135deg, #FDE68A 0%, #FBBF24 45%, #D97706 100%)',
    border: 'rgba(251, 191, 36, 0.45)',
    glow: 'rgba(251, 191, 36, 0.35)',
    tint: 'rgba(251, 191, 36, 0.07)',
    icon: Crown,
  },
  silver: {
    light: '#E2E8F0',
    gradient: 'linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 50%, #94A3B8 100%)',
    border: 'rgba(226, 232, 240, 0.4)',
    glow: 'rgba(203, 213, 225, 0.28)',
    tint: 'rgba(226, 232, 240, 0.055)',
    icon: Medal,
  },
  bronze: {
    light: '#FED7AA',
    gradient: 'linear-gradient(135deg, #FDBA74 0%, #F97316 50%, #B45309 100%)',
    border: 'rgba(251, 146, 60, 0.45)',
    glow: 'rgba(251, 146, 60, 0.32)',
    tint: 'rgba(251, 146, 60, 0.07)',
    icon: Award,
  },
};

export default function Prizes() {
  return (
    <section className="relative py-20 sm:py-28">
      {/* ambient glow behind the cards */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/[0.06] blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Prizes"
          title="পুরস্কার"
          subtitle={`সেরা তিনটি প্রোডাক্টের জন্য রয়েছে উপহার। ${event.prizeLabel} — অপেক্ষা করছে তোমার জন্য!`}
        />

        <div className="mt-16 grid items-stretch gap-6 md:grid-cols-3">
          {prizes.map((p, i) => {
            const t = themes[p.theme];
            const Icon = t.icon;
            const isFirst = i === 0;

            return (
              <div
                key={p.place}
                className={`group relative rounded-[28px] border p-[1.5px] transition-transform duration-300 ease-out hover:-translate-y-2 ${
                  isFirst ? 'md:-translate-y-3 md:hover:-translate-y-5' : ''
                }`}
                style={{
                  borderColor: t.border,
                  background: `linear-gradient(180deg, ${t.tint}, rgba(255,255,255,0.02))`,
                  boxShadow: `0 30px 80px -35px ${t.glow}`,
                }}
              >
                {/* inner glass surface */}
                <div className="relative h-full overflow-hidden rounded-[26px] bg-navy-900/75 px-7 pb-8 pt-9 backdrop-blur-xl sm:px-8">
                  {/* metallic top edge */}
                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ background: t.gradient }}
                  />

                  {/* light sweep on hover */}
                  <div className="pointer-events-none absolute -left-2/3 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.09] to-transparent transition-transform duration-700 group-hover:translate-x-[320%]" />

                  {/* oversized rank number */}
                  <span className="pointer-events-none absolute right-5 top-4 text-6xl font-extrabold leading-none text-white/[0.05]">
                    0{i + 1}
                  </span>

                  {/* medallion */}
                  <div className="relative mx-auto mb-7 h-24 w-24">
                    <div
                      className="absolute inset-1 rounded-full blur-xl transition-opacity duration-300 group-hover:opacity-90"
                      style={{ background: t.glow, opacity: 0.65 }}
                    />
                    <div
                      className="absolute inset-0 rounded-full p-[3px]"
                      style={{ background: t.gradient }}
                    >
                      <div className="grid h-full w-full place-items-center rounded-full bg-navy-950">
                        <Icon
                          className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
                          style={{ color: t.light }}
                          strokeWidth={1.7}
                        />
                      </div>
                    </div>
                    {/* tiny sparkle on the winner card */}
                    {isFirst && (
                      <Sparkles
                        className="absolute -right-2 -top-1 h-5 w-5 animate-pulse"
                        style={{ color: t.light }}
                      />
                    )}
                  </div>

                  {/* place label */}
                  <p
                    className="text-center text-[11px] font-extrabold uppercase tracking-[0.28em]"
                    style={{ color: t.light }}
                  >
                    {p.place} Place
                  </p>
                  <h3 className="mt-2 text-center text-2xl font-extrabold text-white">
                    {p.bangla}
                  </h3>

                  {/* divider */}
                  <div
                    className="my-6 h-px w-full"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${t.border}, transparent)`,
                    }}
                  />

                  {/* prize pill */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-medium text-slate-400">পুরস্কার</span>
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-extrabold text-navy-950 shadow-lg"
                      style={{ background: t.gradient }}
                    >
                      <Gift className="h-4 w-4" /> {p.prize}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
