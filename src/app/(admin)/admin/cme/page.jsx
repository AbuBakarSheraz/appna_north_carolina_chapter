'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Loader2, Stethoscope } from 'lucide-react';
import { getCmeEntries } from '../../../../lib/cme';

const formatDate = (value) => new Date(value).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

export default function AdminCmePage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { getCmeEntries().then((response) => setEntries(response.data)).catch((requestError) => setError(requestError?.response?.data?.message || 'Could not load CME submissions.')).finally(() => setLoading(false)); }, []);

  return <main className="min-h-screen bg-[#f4f6fa] px-4 py-5 text-slate-900 sm:px-6 lg:px-8"><section className="mx-auto max-w-[1440px]"><Link href="/admin/events" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1a2744] transition hover:text-[#7a1f3d]"><ChevronLeft size={16} />Event operations</Link><header className="mt-5 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5"><div><p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7a1f3d]">Event operations</p><h1 className="mt-1 flex items-center gap-2 text-3xl font-bold tracking-tight text-[#1a2744]"><Stethoscope size={26} />CME submissions</h1><p className="mt-1.5 text-sm text-slate-500">Continuing medical education interest forms from the website.</p></div><span className="rounded-full bg-white px-3 py-2 text-sm font-bold text-slate-600 shadow-sm">{entries.length} total</span></header><section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">{loading ? <div className="grid min-h-64 place-items-center text-sm text-slate-500"><span className="inline-flex items-center gap-2"><Loader2 className="animate-spin" size={18} />Loading CME submissions…</span></div> : error ? <p className="m-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : entries.length === 0 ? <p className="px-5 py-16 text-center text-sm text-slate-500">No CME forms have been submitted yet.</p> : <div className="overflow-x-auto"><table className="min-w-[1000px] w-full text-left text-sm"><thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-[0.13em] text-slate-400"><tr><th className="px-5 py-3.5">Applicant</th><th className="px-4 py-3.5">University</th><th className="px-4 py-3.5">Specialty</th><th className="px-4 py-3.5">Phone</th><th className="px-4 py-3.5">Location</th><th className="px-5 py-3.5">Submitted</th></tr></thead><tbody className="divide-y divide-slate-100">{entries.map((entry) => <tr key={entry.id} className="transition hover:bg-slate-50"><td className="px-5 py-4"><p className="font-bold text-slate-900">{entry.fullName}</p><a href={`mailto:${entry.email}`} className="mt-1 text-xs text-[#7a1f3d] hover:underline">{entry.email}</a></td><td className="px-4 py-4 text-slate-700">{entry.university}</td><td className="px-4 py-4 text-slate-700">{entry.specialty}</td><td className="px-4 py-4 text-slate-700">{entry.phone}</td><td className="px-4 py-4 text-slate-700">{entry.city}, {entry.state}</td><td className="px-5 py-4 text-slate-500">{formatDate(entry.createdAt)}</td></tr>)}</tbody></table></div>}</section></section></main>;
}
