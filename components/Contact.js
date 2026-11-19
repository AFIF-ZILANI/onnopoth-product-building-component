import { ArrowUpRight, Globe, MessageCircle, Phone, UserRound } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { CommunityCard } from './ShareButtons';
import { contacts } from '@/lib/config';

export default function Contact() {
  return (
    <section data-reveal id="contact" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-indigo-600/10 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <SectionHeading
          index="09"
          eyebrow="Contact"
          title={<>কোনো <span className="text-gradient-warm">প্রশ্ন</span> আছে?</>}
          subtitle="রেজিস্ট্রেশন বা নিয়ম নিয়ে যেকোনো হেল্প লাগলে সরাসরি যোগাযোগ করুন—আমরা সাহায্য করতে প্রস্তুত।"
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {contacts.map((person) => (
            <div key={person.name} className="glass flex flex-col items-center p-7 sm:p-8">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-accent-gradient shadow-glow">
                {person.facebook ? (
                  <Globe className="h-6 w-6 text-white" />
                ) : (
                  <UserRound className="h-6 w-6 text-white" />
                )}
              </div>

              <h3 className="text-lg font-extrabold text-white sm:text-xl">{person.name}</h3>
              <p className="mt-1 text-base font-semibold text-indigo-200 sm:text-lg">
                {person.detail}
              </p>
              <p className="mt-1.5 text-xs text-slate-500">আয়োজক কমিটি, OnnoPoth</p>

              <div className="mt-6 flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
                {person.whatsapp && (
                  <a
                    href={person.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary !px-4 !py-2.5 !text-xs sm:!text-sm"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                )}
                {person.tel && (
                  <a
                    href={person.tel}
                    className="btn-secondary !px-4 !py-2.5 !text-xs sm:!text-sm"
                  >
                    <Phone className="h-4 w-4" /> কল করুন
                  </a>
                )}
                {person.facebook && (
                  <a
                    href={person.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary !px-5 !py-2.5 !text-xs sm:!text-sm"
                  >
                    <Globe className="h-4 w-4" /> Facebook Page <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <CommunityCard />
        </div>
      </div>
    </section>
  );
}
