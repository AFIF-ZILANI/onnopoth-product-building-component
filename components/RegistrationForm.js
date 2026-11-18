'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  Users,
  Building2,
  GraduationCap,
  MessageCircle,
  Mail,
  GitBranch,
  Lightbulb,
  Target,
  ListChecks,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Lock,
  ArrowRight,
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import { dates, isRegistrationOpen, event } from '@/lib/config';

// Empty form state — kept in one object so resetting is trivial.
const EMPTY_FORM = {
  registrationType: 'solo',
  fullName: '',
  teamName: '',
  members: ['', '', ''],
  teamLeader: 0,
  institution: '',
  className: '',
  whatsapp: '',
  email: '',
  github: '',
  productName: '',
  problem: '',
  users: '',
  features: '',
  agree: false,
  website: '', // hidden honeypot — real users never touch this
};

const PHONE_RE = /^01\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Small inline error message shown under a field. */
function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="field-error" role="alert">
      <AlertCircle className="h-3.5 w-3.5" /> {message}
    </p>
  );
}

export default function RegistrationForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [serverMessage, setServerMessage] = useState('');
  const [registrationOpen, setRegistrationOpen] = useState(null); // null until checked on client

  // Deadline is checked only on the client after mount → no hydration mismatch.
  useEffect(() => {
    setRegistrationOpen(isRegistrationOpen());
  }, []);

  const isTeam = form.registrationType === 'team';

  // Generic change handler for text inputs / textareas.
  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Handler for the three team-member inputs.
  const setMember = (index, value) => {
    setForm((prev) => {
      const members = [...prev.members];
      members[index] = value;
      return { ...prev, members };
    });
  };

  // Clear an error when a field is fixed.
  const clearError = (name) => setErrors((prev) => ({ ...prev, [name]: undefined }));

  // Client-side validation — mirrors the API route. All messages are in Bangla.
  function validate() {
    const next = {};
    const leaderName = isTeam
      ? (form.members[form.teamLeader] || '').trim() || (form.members[0] || '').trim()
      : form.fullName.trim();

    if (!leaderName) next.fullName = 'নাম আবশ্যক।';
    if (isTeam && !form.members.some((m) => m.trim())) {
      next.members = 'কমপক্ষে একজন সদস্যের নাম লিখুন।';
    }
    if (!form.institution.trim()) next.institution = 'প্রতিষ্ঠানের নাম আবশ্যক।';
    if (!form.className.trim()) next.className = 'শ্রেণি/সেমিস্টার আবশ্যক।';

    const phone = form.whatsapp.replace(/[\s-]/g, '');
    if (!PHONE_RE.test(phone)) next.whatsapp = 'সঠিক WhatsApp নম্বর দিন (01XXXXXXXXX)।';
    if (!EMAIL_RE.test(form.email.trim())) next.email = 'সঠিক ইমেইল ঠিকানা দিন।';
    if (!form.github.trim()) next.github = 'GitHub ইউজারনেম আবশ্যক।';
    if (!form.productName.trim()) next.productName = 'প্রোডাক্টের নাম আবশ্যক।';
    if (!form.problem.trim()) next.problem = 'কোন সমস্যার সমাধান করবে তা লিখুন।';
    if (!form.users.trim()) next.users = 'কারা এটি ব্যবহার করবে তা লিখুন।';
    if (!form.features.trim()) next.features = 'প্রধান ফিচারগুলো লিখুন।';
    if (!form.agree) next.agree = 'রুলবুক পড়ার নিশ্চিতকরণ আবশ্যক।';

    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting || registrationOpen === false) return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Scroll to the first error so the student can see what to fix.
      document.getElementById('register')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setSubmitting(true);
    setStatus(null);
    setServerMessage('');

    // For a team, the "full name" sent to the organizer is the selected leader.
    const leaderName = isTeam
      ? (form.members[form.teamLeader] || form.members[0]).trim()
      : form.fullName.trim();
    const payload = { ...form, fullName: leaderName };

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus('success');
        setForm(EMPTY_FORM);
      } else {
        setStatus('error');
        setServerMessage(data.error || 'কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        if (data.fields) setErrors(data.fields);
      }
    } catch {
      setStatus('error');
      setServerMessage('ইন্টারনেট সংযোগ যাচাই করে আবার চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  }

  const closed = registrationOpen === false;

  return (
    <section id="register" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[110px]" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Registration"
          title="এখুনি রেজিস্ট্রেশন করো"
          subtitle={`রেজিস্ট্রেশন শেষ হবে ${dates.registrationDeadlineLabel}। ফর্ম পূরণ করে আইডিয়া জমা দিন—আমরা আপনার ইমেইলে নিশ্চিতকরণ পাঠাব।`}
        />

        <form onSubmit={handleSubmit} noValidate className="glass mt-14 p-6 sm:p-10">
          {/* Deadline banner */}
          {closed && (
            <div className="mb-7 flex items-center gap-3 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm font-semibold text-rose-200">
              <Lock className="h-5 w-5 shrink-0" />
              রেজিস্ট্রেশনের সময় শেষ হয়ে গেছে। ধন্যবাদ!
            </div>
          )}

          {/* ---------------- Registration type ---------------- */}
          <fieldset>
            <legend className="field-label">রেজিস্ট্রেশনের ধরন *</legend>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'solo', label: 'একা (Solo)', icon: User },
                { value: 'team', label: 'টিম (Team)', icon: Users },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setField('registrationType', value);
                    setStatus(null);
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    form.registrationType === value
                      ? 'border-indigo-400 bg-indigo-500/20 text-white shadow-glow'
                      : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25'
                  }`}
                  aria-pressed={form.registrationType === value}
                >
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* ---------------- Team-only fields ---------------- */}
          {isTeam && (
            <div className="mt-7 rounded-2xl border border-indigo-400/20 bg-indigo-500/[0.06] p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-indigo-200">
                <Users className="h-4 w-4" /> টিমের তথ্য
              </h3>

              <div>
                <label className="field-label" htmlFor="teamName">টিমের নাম (ঐচ্ছিক)</label>
                <input
                  id="teamName"
                  className="field-input"
                  placeholder="যেমন: Team Syntax Error"
                  value={form.teamName}
                  onChange={(e) => setField('teamName', e.target.value)}
                />
              </div>

              <div className="mt-5">
                <label className="field-label">সদস্যদের নাম * (সর্বোচ্চ ৩ জন)</label>
                <p className="mb-3 text-xs text-slate-400">
                  প্রথম ঘরটি টিম লিডারসহ যেকোনো সদস্য—নিচে লিডার নির্বাচন করুন।
                </p>
                <div className="space-y-3">
                  {form.members.map((member, i) => (
                    <div key={i}>
                      <input
                        className="field-input"
                        placeholder={`সদস্য ${i + 1} এর পুরো নাম${i === 0 ? ' *' : ' (ঐচ্ছিক)'}`}
                        value={member}
                        onChange={(e) => {
                          setMember(i, e.target.value);
                          clearError('members');
                          clearError('fullName');
                        }}
                      />
                    </div>
                  ))}
                </div>
                <FieldError message={errors.members || errors.fullName} />
              </div>

              <div className="mt-5">
                <label className="field-label" htmlFor="teamLeader">টিম লিডার নির্বাচন করুন *</label>
                <select
                  id="teamLeader"
                  className="field-input"
                  value={form.teamLeader}
                  onChange={(e) => setField('teamLeader', Number(e.target.value))}
                >
                  {form.members.map((member, i) => (
                    <option key={i} value={i}>
                      সদস্য {i + 1}{member.trim() ? ` — ${member.trim()}` : ' (খালি)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ---------------- Full name (solo) ---------------- */}
          {!isTeam && (
            <div className="mt-7">
              <label className="field-label" htmlFor="fullName">পুরো নাম *</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="fullName"
                  className="field-input !pl-11"
                  placeholder="আপনার পুরো নাম"
                  value={form.fullName}
                  onChange={(e) => setField('fullName', e.target.value)}
                  aria-invalid={!!errors.fullName}
                />
              </div>
              <FieldError message={errors.fullName} />
            </div>
          )}

          {/* ---------------- Institution & class ---------------- */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="institution">প্রতিষ্ঠানের নাম *</label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="institution"
                  className="field-input !pl-11"
                  placeholder="স্কুল / কলেজ / বিশ্ববিদ্যালয়"
                  value={form.institution}
                  onChange={(e) => setField('institution', e.target.value)}
                />
              </div>
              <FieldError message={errors.institution} />
            </div>
            <div>
              <label className="field-label" htmlFor="className">শ্রেণি / সেমিস্টার *</label>
              <div className="relative">
                <GraduationCap className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="className"
                  className="field-input !pl-11"
                  placeholder="যেমন: Class 12 / 3rd Semester"
                  value={form.className}
                  onChange={(e) => setField('className', e.target.value)}
                />
              </div>
              <FieldError message={errors.className} />
            </div>
          </div>

          {/* ---------------- Contact ---------------- */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="whatsapp">WhatsApp নম্বর *</label>
              <div className="relative">
                <MessageCircle className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="whatsapp"
                  className="field-input !pl-11"
                  placeholder="01XXXXXXXXX"
                  inputMode="numeric"
                  value={form.whatsapp}
                  onChange={(e) => setField('whatsapp', e.target.value)}
                />
              </div>
              <FieldError message={errors.whatsapp} />
            </div>
            <div>
              <label className="field-label" htmlFor="email">ইমেইল ঠিকানা *</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  className="field-input !pl-11"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                />
              </div>
              <FieldError message={errors.email} />
            </div>
          </div>

          {/* ---------------- GitHub & product ---------------- */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="github">GitHub ইউজারনেম *</label>
              <div className="relative">
                <GitBranch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="github"
                  className="field-input !pl-11"
                  placeholder="your-github-username"
                  value={form.github}
                  onChange={(e) => setField('github', e.target.value)}
                />
              </div>
              <FieldError message={errors.github} />
            </div>
            <div>
              <label className="field-label" htmlFor="productName">প্রোডাক্টের নাম *</label>
              <div className="relative">
                <Lightbulb className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="productName"
                  className="field-input !pl-11"
                  placeholder="আপনার প্রোডাক্টের নাম"
                  value={form.productName}
                  onChange={(e) => setField('productName', e.target.value)}
                />
              </div>
              <FieldError message={errors.productName} />
            </div>
          </div>

          {/* ---------------- Idea textareas ---------------- */}
          <div className="mt-6">
            <label className="field-label" htmlFor="problem">কোন সমস্যার সমাধান করবে? *</label>
            <div className="relative">
              <Target className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-500" />
              <textarea
                id="problem"
                rows={3}
                className="field-input !pl-11 resize-y"
                placeholder="বিস্তারিত লিখুন—কে, কী সমস্যার সম্মুখীন হচ্ছে?"
                value={form.problem}
                onChange={(e) => setField('problem', e.target.value)}
              />
            </div>
            <FieldError message={errors.problem} />
          </div>

          <div className="mt-6">
            <label className="field-label" htmlFor="users">কারা এটি ব্যবহার করবে? *</label>
            <div className="relative">
              <Users className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-500" />
              <textarea
                id="users"
                rows={3}
                className="field-input !pl-11 resize-y"
                placeholder="যেমন: গ্রামীণ শিক্ষার্থী, ছোট দোকানদার ইত্যাদি"
                value={form.users}
                onChange={(e) => setField('users', e.target.value)}
              />
            </div>
            <FieldError message={errors.users} />
          </div>

          <div className="mt-6">
            <label className="field-label" htmlFor="features">প্রধান ৩–৫টি ফিচার *</label>
            <div className="relative">
              <ListChecks className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-500" />
              <textarea
                id="features"
                rows={4}
                className="field-input !pl-11 resize-y"
                placeholder="১. লগইন ২. ড্যাশবোর্ড ৩. রিপোর্ট …"
                value={form.features}
                onChange={(e) => setField('features', e.target.value)}
              />
            </div>
            <FieldError message={errors.features} />
          </div>

          {/* ---------------- Honeypot (hidden from humans) ---------------- */}
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="website">Leave this field empty</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => setField('website', e.target.value)}
            />
          </div>

          {/* ---------------- Rulebook agreement ---------------- */}
          <div className="mt-7">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => {
                  setField('agree', e.target.checked);
                  clearError('agree');
                }}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/30 bg-navy-950 accent-indigo-500"
              />
              <span>
                আমি{' '}
                <Link href="/rulebook" target="_blank" className="font-semibold text-indigo-300 underline underline-offset-2 hover:text-indigo-200">
                  রুলবুক
                </Link>{' '}
                পড়েছি এবং সব নিয়ম মেনে চলব *
              </span>
            </label>
            <FieldError message={errors.agree} />
          </div>

          {/* ---------------- Submit ---------------- */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={submitting || closed}
              className="btn-primary w-full !py-3.5 text-base"
            >
              {closed ? (
                <>Registration Closed</>
              ) : submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> পাঠানো হচ্ছে…
                </>
              ) : (
                <>
                  রেজিস্ট্রেশন জমা দিন <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
            <p className="mt-3 text-center text-xs text-slate-500">
              আপনার তথ্য শুধুমাত্র {event.organizer} আয়োজক কমিটি দেখতে পাবে।
            </p>
          </div>

          {/* ---------------- Status messages ---------------- */}
          {status === 'success' && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-5 text-sm text-emerald-200" role="status">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold">রেজিস্ট্রেশন সফল! 🎉</p>
                <p className="mt-1 leading-relaxed">
                  আপনার রেজিস্ট্রেশন গ্রহণ করা হয়েছে। ২৫ নভেম্বর কনফার্মড তালিকা ঘোষণা করা হবে।
                  একটি নিশ্চিতকরণ ইমেইল আপনার ইনবক্সে যাচাই করুন (স্প্যাম ফোল্ডও দেখে নিন)।
                </p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-5 text-sm text-rose-200" role="alert">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold">কিছু সমস্যা হয়েছে।</p>
                <p className="mt-1 leading-relaxed">{serverMessage}</p>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
