'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react';
import { resetPassword } from '../../../lib/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await resetPassword({ email, password });
      setSuccess(data.message || 'Password updated. You can now sign in.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      const message = err.response?.data?.message;
      setError(Array.isArray(message) ? message[0] : message || 'Unable to reset the password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 px-4 py-10 sm:px-6"><section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-9"><Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-[#7a1f3d]"><ArrowLeft size={16} /> Back to sign in</Link><div className="mt-7 grid h-12 w-12 place-items-center rounded-2xl bg-[#7a1f3d]/10 text-[#7a1f3d]"><KeyRound size={23} /></div><h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">Reset your password</h1><p className="mt-2 text-sm leading-6 text-slate-500">Enter the email address on your APPNA NC account and choose a new password.</p><form onSubmit={submit} className="mt-7 space-y-5"><label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Email address</span><input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#7a1f3d] focus:ring-4 focus:ring-[#7a1f3d]/10" placeholder="you@example.com" /></label><label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">New password</span><div className="relative"><input required minLength={8} type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#7a1f3d] focus:ring-4 focus:ring-[#7a1f3d]/10" placeholder="At least 8 characters" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label><label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Confirm new password</span><input required minLength={8} type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#7a1f3d] focus:ring-4 focus:ring-[#7a1f3d]/10" placeholder="Repeat the new password" /></label>{error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}{success && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><p className="flex items-center gap-2 font-semibold"><CheckCircle2 size={17} /> Password updated</p><p className="mt-1">{success}</p><Link href="/login" className="mt-2 inline-block font-bold underline">Sign in now</Link></div>}<button disabled={loading || !email || !password || !confirmPassword} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7a1f3d] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#7a1f3d]/20 transition hover:bg-[#631932] disabled:cursor-not-allowed disabled:opacity-50">{loading ? <Loader2 size={17} className="animate-spin" /> : <KeyRound size={17} />} Update password</button></form></section></main>;
}
