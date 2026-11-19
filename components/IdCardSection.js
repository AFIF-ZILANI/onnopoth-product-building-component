import SectionHeading from './SectionHeading';
import CompetitorIdCard from './CompetitorIdCard';

/** Website section showing the competitor identity card. */
export default function IdCardSection() {
  return (
    <section data-reveal id="id-card" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Competitor ID Card"
          title={<>প্রতিযোগীর <span className="text-gradient-cool">আইডি কার্ড</span></>}
          subtitle="প্রত্যেক প্রতিযোগীর পরিচয়ের জন্য একটিমাত্র কার্ড — রুলবুকের PDF-এও একই কার্ড পাবেন।"
        />
        <div className="mt-14">
          <CompetitorIdCard />
        </div>
      </div>
    </section>
  );
}
