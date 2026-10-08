'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2, Stethoscope } from 'lucide-react';
import { submitCmeEntry } from '../../../lib/cme';

const initialForm = { fullName: '', university: '', phone: '', email: '', specialty: '' };
const locationPlaceholder = 'Not entered';
const inputClass = 'w-full rounded-xl border border-appna-maroon/15 bg-white px-3.5 py-3 text-sm text-appna-ink outline-none transition focus:border-appna-maroon focus:ring-4 focus:ring-appna-maroon/10';

export default function CmePage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true); setError('');
    try {
      await submitCmeEntry({ ...form, state: locationPlaceholder, city: locationPlaceholder });
      setSubmitted(true); setForm(initialForm);
    }
    catch (requestError) { setError(requestError?.response?.data?.message || 'We could not submit your CME form. Please try again.'); }
    finally { setSubmitting(false); }
  };

  return <main className="min-h-screen bg-appna-surface px-5 py-12 sm:px-6 sm:py-16"><section className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-appna-maroon/10 bg-white shadow-xl shadow-appna-maroon/5"><header className="bg-appna-maroon px-6 py-9 text-white sm:px-10"><Link href="/" className="text-xs font-semibold uppercase tracking-[0.14em] text-white/75 transition hover:text-white">APPNA North Carolina</Link><div className="mt-6 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15"><Stethoscope size={22} /></span><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">Professional education</p><h1 className="mt-1 font-display text-3xl font-medium">CME interest form</h1></div></div><p className="mt-4 max-w-xl text-sm leading-6 text-white/85">Share your details to receive APPNA NC continuing medical education information and updates.</p></header>{submitted ? <div className="px-6 py-12 text-center sm:px-10"><CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" /><h2 className="mt-5 font-display text-3xl text-appna-maroon-dark">Thank you</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-appna-ink-soft">Your CME form was received. A confirmation email has been sent to you.</p><button type="button" onClick={() => setSubmitted(false)} className="mt-7 rounded-xl bg-appna-maroon px-5 py-3 text-sm font-semibold text-white transition hover:bg-appna-maroon-dark">Submit another response</button></div> : <form onSubmit={submit} className="space-y-6 px-6 py-8 sm:px-10"><div className="grid gap-5 sm:grid-cols-2"><FormField label="Full name" value={form.fullName} onChange={(value) => update('fullName', value)} /><FormField label="University/Organization" value={form.university} onChange={(value) => update('university', value)} /><FormField label="Phone" type="tel" value={form.phone} onChange={(value) => update('phone', value)} /><FormField label="Email" type="email" value={form.email} onChange={(value) => update('email', value)} /><FormField label="Specialty" value={form.specialty} onChange={(value) => update('specialty', value)} /></div>{error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}<div className="flex flex-wrap items-center justify-between gap-3 border-t border-appna-maroon/10 pt-6"><p className="text-xs leading-5 text-appna-ink-soft">We will use these details only for CME communication.</p><button disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-appna-maroon px-5 py-3 text-sm font-semibold text-white transition hover:bg-appna-maroon-dark disabled:opacity-60">{submitting && <Loader2 size={16} className="animate-spin" />}{submitting ? 'Submitting…' : 'Submit CME form'}</button></div></form>}</section></main>;
}

function FormField({ label, value, onChange, type = 'text' }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold text-appna-ink">{label} <span className="text-appna-maroon">*</span></span><input required type={type} value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} /></label>;
}
