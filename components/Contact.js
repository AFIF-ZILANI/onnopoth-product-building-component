import { MessageCircle, Phone, UserRound } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { contact } from '@/lib/config';

export default function Contact() {
  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-indigo-600/10 to-transparent" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <SectionHeading
          eyebrow="Contact"
          title="কোনো প্রশ্ন আছে?"
          subtitle="যেকোনো প্রশ্ন বা সহায়তার জন্য সরাসরি যোগাযোগ করুন—আমরা সাহায্য করতে প্রস্তুত।"
        />

        <div className="glass mt-12 flex flex-col items-center p-8 sm:p-10">
          <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-accent-gradient shadow-glow">
            <UserRound className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-xl font-extrabold text-white">{contact.person}</h3>
          <p className="mt-1 text-lg font-semibold text-indigo-200">{contact.phone}</p>
          <p className="mt-2 text-sm text-slate-400">আয়োজক কমিটি, OnnoPoth</p>

          <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp-এ বার্তা দিন
            </a>
            <a href={contact.tel} className="btn-secondary">
              <Phone className="h-4 w-4" /> কল করুন
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
