'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, MessageCircle, Share2 } from 'lucide-react';
import { event, socialLinks } from '@/lib/config';

/** WhatsApp / Facebook / copy-link sharing row. */
export default function ShareButtons() {
  const [url, setUrl] = useState(socialLinks.siteUrl);
  const [copied, setCopied] = useState(false);

  // Keep server and first client render identical; use the real URL after mount.
  useEffect(() => {
    setUrl(window.location.origin);
  }, []);

  const text = `${event.name} — ${event.tagline}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the other share options still work.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 hidden items-center gap-1.5 text-xs font-semibold text-slate-500 sm:flex">
        <Share2 className="h-3.5 w-3.5" /> শেয়ার করো:
      </span>
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-emerald-400/40 hover:text-white"
      >
        <MessageCircle className="h-3.5 w-3.5 text-emerald-300" /> WhatsApp
      </a>
      <a
        href={facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-indigo-400/40 hover:text-white"
      >
        <Share2 className="h-3.5 w-3.5 text-indigo-300" /> Facebook
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-fuchsia-400/40 hover:text-white"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5 text-fuchsia-300" />}
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  );
}

/** Shows the real group button once a link is configured, otherwise a status note. */
export function CommunityCard() {
  if (socialLinks.whatsappGroup) {
    return (
      <a
        href={socialLinks.whatsappGroup}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary w-full"
      >
        <MessageCircle className="h-4 w-4" /> Join WhatsApp Group
      </a>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center text-sm text-slate-400">
      কনফার্মড প্রতিযোগীদের WhatsApp গ্রুপ <span className="font-semibold text-indigo-200">২৬ নভেম্বর</span> ব্রিফিংয়ের পর চালু হবে।
    </div>
  );
}
