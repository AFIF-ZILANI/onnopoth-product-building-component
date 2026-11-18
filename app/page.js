import Hero from '@/components/Hero';
import About from '@/components/About';
import WhoCanJoin from '@/components/WhoCanJoin';
import Timeline from '@/components/Timeline';
import HowItWorks from '@/components/HowItWorks';
import JudgingCriteria from '@/components/JudgingCriteria';
import Prizes from '@/components/Prizes';
import IdCardSection from '@/components/IdCardSection';
import RegistrationForm from '@/components/RegistrationForm';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';

/** Home — a single scrolling page made of independent sections. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <WhoCanJoin />
      <Timeline />
      <HowItWorks />
      <JudgingCriteria />
      <Prizes />
      <IdCardSection />
      <RegistrationForm />
      <FAQ />
      <Contact />
    </>
  );
}
