import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { event, dates, socialLinks } from '@/lib/config';

/**
 * SEO + Open Graph metadata.
 * Change `socialLinks.siteUrl` in lib/config.js to your real Vercel URL.
 */
export const metadata = {
  metadataBase: new URL(socialLinks.siteUrl),
  title: {
    default: `${event.name} | ${event.organizer}`,
    template: `%s | ${event.organizer}`,
  },
  description:
    'AI-এর সাহায্যে আইডিয়াকে বাস্তব প্রোডাক্টে রূপ দাও। OnnoPoth আয়োজিত সম্পূর্ণ অনলাইন Product Building Competition — ২৭ নভেম্বর ২০২৬, ১২ ঘণ্টা।',
  keywords: [
    'OnnoPoth',
    'Product Building Competition',
    'AI competition Bangladesh',
    'student competition',
    'Vercel',
    'GitHub',
    'Bangla',
  ],
  authors: [{ name: 'OnnoPoth' }],
  creator: event.organizer,
  applicationName: event.name,
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    url: '/',
    siteName: `${event.shortName} – ${event.organizer}`,
    title: `${event.name} | ${event.organizer}`,
    description: event.tagline,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${event.name} – ${event.organizer}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${event.name} | ${event.organizer}`,
    description: event.tagline,
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050a1f',
};

export default function RootLayout({ children }) {
  // Structured data helps Google show a rich Event result.
  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.tagline,
    startDate: dates.competitionStart,
    endDate: dates.competitionEnd,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: { '@type': 'VirtualLocation', url: socialLinks.siteUrl },
    organizer: { '@type': 'Organization', name: event.organizer, url: socialLinks.siteUrl },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BDT',
      availability: 'https://schema.org/InStock',
      url: `${socialLinks.siteUrl}/#register`,
    },
  };

  return (
    <html lang="bn">
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
