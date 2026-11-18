import { Crown, Medal, Award, Gift } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { prizes } from '@/lib/config';

const styles = {
  gold: {
    icon: Crown,
    ring: 'border-amber-400/40',
    glow: 'shadow-[0_20px_60px_-25px_rgba(251,191,36,0.55)]',
    iconWrap: 'bg-amber-400/15 text-amber-300',
    accent: 'text-amber-300',
    badge: 'from-amber-400 to-yellow-500',
  },
  silver: {
    icon: Medal,
    ring: 'border-slate-300/30',
    glow: 'shadow-[0_20px_60px_-25px_rgba(203,213,225,0.45)]',
    iconWrap: 'bg-slate-300/10 text-slate-200',
    accent: 'text-slate-200',
    badge: 'from-slate-300 to-slate-400',
  },
  bronze: {
    icon: Award,
    ring: 'border-orange-400/40',
    glow: 'shadow-[0_20px_60px_-25px_rgba(251,146,60,0.5)]',
    iconWrap: 'bg-orange-400/15 text-orange-300',
    accent: 'text-orange-300',
    badge: 'from-orange-400 to-amber-600',
  },
};

export default function Prizes() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[120px]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Prizes"
          title="পুরস্কার"
          subtitle="সেরা তিনটি প্রোডাক্টের জন্য রয়েছে উপহার।"
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {prizes.map((p, i) => {
            const s = styles[p.theme];
            const Icon = s.icon;
            const isFirst = i === 0;
            return (
              <div
                key={p.place}
                className={`glass relative overflow-hidden border ${s.ring} ${s.glow} p-8 text-center transition duration-300 hover:-translate-y-1.5 ${
                  isFirst ? 'md:-translate-y-3 md:scale-[1.03]' : ''
                }`}
              >
                {isFirst && (
                  <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.badge}`} />
                )}
                <div className={`mx-auto mb-5 inline-grid h-16 w-16 place-items-center rounded-2xl ${s.iconWrap}`}>
                  <Icon className="h-8 w-8" />
                </div>
                <p className={`text-sm font-bold uppercase tracking-widest ${s.accent}`}>{p.place} Place</p>
                <h3 className="mt-1 text-xl font-extrabold text-white">{p.bangla}</h3>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white">
                  <Gift className="h-4 w-4 text-white/70" /> {p.prize}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
