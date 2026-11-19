import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Timeline from '@/components/Timeline';
import Rules from '@/components/Rules';
import Prizes from '@/components/Prizes';
import RegistrationForm from '@/components/RegistrationForm';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import SectionHeading from '@/components/SectionHeading';
import CompetitorIdCard from '@/components/CompetitorIdCard';

/** Home — reads top to bottom as: what it is → how → when → rules → prizes → register → questions. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Timeline />
      <Rules />
      <Prizes />
      <RegistrationForm />
      <section id="id-card" className="section">
        <div className="page grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <SectionHeading
            eyebrow="প্রতিযোগীর আইডি কার্ড"
            title="প্রত্যেকের একটি পরিচয়পত্র"
            subtitle="রেজিস্ট্রেশনের তথ্য দিয়ে তৈরি এই কার্ডেই তোমার পরিচয় থাকবে। রুলবুকের PDF-এও একই কার্ড পাবে।"
          />
          <div data-reveal>
            <CompetitorIdCard />
          </div>
        </div>
      </section>
      <FAQ />
      <Contact />
    </>
  );
}
