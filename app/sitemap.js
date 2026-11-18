import { socialLinks } from '@/lib/config';

/** App Router metadata route — served at /sitemap.xml */
export default function sitemap() {
  const base = socialLinks.siteUrl;
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/rulebook`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/submit`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];
}
