'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Bot, RotateCcw, Send, Sparkles } from 'lucide-react';
import { faqItems, extraFaqItems } from '@/lib/rulebook';
import { contacts } from '@/lib/config';

/** Knowledge base = the exact rulebook Q&As + the extra home-page questions. */
const KNOWLEDGE = [...faqItems, ...extraFaqItems].map((item, i) => ({
  id: i,
  q: item.q,
  a: item.a,
  keywords: [], // filled from TAGS below
}));

// Topic tags per FAQ index make matching reliable for short chat messages.
const TAGS = {
  0: ['নতুন', 'প্রোগ্রামিং', 'পারব', 'অভিজ্ঞতা', 'শিখ', 'beginner', 'কোড'],
  1: ['ভাষা', 'ফ্রেমওয়ার্ক', 'react', 'next', 'python', 'javascript', 'Vercel', 'ওয়েব'],
  2: ['আইডিয়া', 'অ্যাকাউন্ট', 'আগে', 'পরিকল্পনা', 'github', 'vercel', 'কোড শুরু'],
  3: ['টিম', 'কতজন', 'সদস্য', '৩ জন', 'তিনজন', 'একা', 'সolo'],
  4: ['পেইড', 'টাকা', 'খরচ', 'ফ্রি', 'টুল', 'কেনা', 'ফ্রি প্ল্যান'],
  5: ['জমা', 'সাবমিশন', 'লিংক', 'readme', 'ডেমো', 'ভিডিও', 'কী দিতে'],
  6: ['ডেডলাইন', 'শেষ', 'রেজিস্ট্রেশন', 'কখন', 'তারিখ', 'বন্ধ'],
  7: ['ফলাফল', 'কখন', 'ঘোষণা', 'রিজাল্ট', 'সন্ধ্যা'],
  8: ['পুরস্কার', 'বই', 'book', 'গিফট', 'প্রথম', 'দ্বিতীয়', 'তৃতীয়'],
};

KNOWLEDGE.forEach((item) => {
  item.keywords = [...TAGS[item.id], ...item.q.split(/\s+/).filter((w) => w.length > 2)];
});

const QUICK = [
  'প্রোগ্রামিংয়ে নতুন, পারব?',
  'টিমে কতজন হতে পারে?',
  'কী কী জমা দিতে হবে?',
  'রেজিস্ট্রেশনের শেষ সময়?',
  'পুরস্কার কী?',
  'ফলাফল কখন?',
];

// Generic question words carry no topic information — ignore them.
const STOP_WORDS = new Set([
  'কী', 'কি', 'কখন', 'কেন', 'কোথায়', 'কেমন', 'জন্য', 'আমি', 'আমার', 'চাই',
  'জানতে', 'বলুন', 'প্রশ্ন', 'হয়', 'এই', 'ওই', 'থাকে', 'করে', 'সম্পর্কে',
  'দিন', 'দয়া', 'জানো', 'বুঝ', 'বুঝতে',
]);

function findAnswer(text) {
  const tokens = String(text)
    .toLowerCase()
    .split(/[\s?।,.!]+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  let best = null;
  let bestScore = 0;

  for (const item of KNOWLEDGE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (!kw) continue;
      const k = kw.toLowerCase();
      if (tokens.includes(k)) score += 3;
      else if (k.length >= 5 && tokens.some((t) => t.includes(k) || k.includes(t))) score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  return bestScore >= 3 ? best : null;
}

function BotAvatar() {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-accent-gradient shadow-glow">
      <Bot className="h-4 w-4 text-white" />
    </span>
  );
}

export default function FaqChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'bot',
      text: 'আসসালামু আলাইকুম! 👋 আমি OnnoPoth Assistant। রেজিস্ট্রেশন, নিয়ম বা পুরস্কার নিয়ে যেকোনো প্রশ্ন করুন — নিচের চিপগুলোতেও ক্লিক করতে পারেন।',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function ask(question) {
    if (!question.trim() || typing) return;
    const text = question.trim();
    setInput('');
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text }]);
    setTyping(true);

    timerRef.current = setTimeout(() => {
      const match = findAnswer(text);
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          role: 'bot',
          text: match
            ? match.a
            : 'এই প্রশ্নটির উত্তর আমার কাছে নেই 😔 নিচের কন্টাক্টে আয়োজক কমিটিকে জিজ্ঞেস করুন—অবশ্যই সাহায্য করবেন।',
        },
      ]);
      setTyping(false);
    }, 650);
  }

  function reset() {
    clearTimeout(timerRef.current);
    setTyping(false);
    setMessages([messages[0]]);
    setInput('');
  }

  return (
    <div className="glass overflow-hidden rounded-[32px]">
      {/* Header */}
      <div className="relative flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-indigo-600/20 via-purple-600/10 to-transparent px-5 py-4">
        <BotAvatar />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm font-bold text-white">
            OnnoPoth Assistant
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
          </p>
          <p className="text-[11px] text-slate-400">সাধারণ প্রশ্নের উত্তর দিচ্ছি · online</p>
        </div>
        <button
          type="button"
          onClick={reset}
          aria-label="চ্যাট রিসেট করুন"
          className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-white/25 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        aria-live="polite"
        className="h-[360px] space-y-4 overflow-y-auto bg-navy-950/40 px-4 py-5 sm:h-[420px] sm:px-6"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'bot' && <BotAvatar />}
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[72%] ${
                msg.role === 'user'
                  ? 'rounded-br-sm bg-accent-gradient font-medium text-white'
                  : 'rounded-bl-sm border border-white/10 bg-white/[0.06] text-slate-200'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex items-end gap-2">
            <BotAvatar />
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.06] px-4 py-3.5">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-300"
                  style={{ animationDelay: `${d * 140}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick replies */}
      <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-3 sm:px-6">
        {QUICK.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => ask(q)}
            disabled={typing}
            className="rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1.5 text-[11px] font-semibold text-indigo-200 transition hover:border-indigo-400/60 hover:bg-indigo-500/20 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex items-center gap-2 border-t border-white/10 px-4 py-4 sm:px-6"
      >
        <label htmlFor="chat-input" className="sr-only">প্রশ্ন লিখুন</label>
        <input
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="আপনার প্রশ্ন লিখুন…"
          autoComplete="off"
          className="field-input !py-3"
        />
        <button
          type="submit"
          disabled={typing || !input.trim()}
          aria-label="প্রশ্ন পাঠান"
          className="btn-primary !h-[46px] !w-[46px] shrink-0 !rounded-xl !px-0 !py-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      {/* Footer note */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-white/[0.02] px-5 py-3 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-indigo-300" /> উত্তরগুলো রুলবুক থেকে নেওয়া
        </span>
        <Link href="/rulebook" target="_blank" className="flex items-center gap-1 text-indigo-300 hover:text-indigo-200">
          সম্পূর্ণ রুলবুক <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
