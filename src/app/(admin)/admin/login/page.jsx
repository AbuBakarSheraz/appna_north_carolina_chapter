'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import { adminLogin } from '../../../../lib/admin';
import { setAccessToken } from '../../../../store/auth';

function FloatingInput({ id, label, type, value, onChange, placeholder, rightSlot }) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || !!value;
  return (
    <div className="relative">
      <input id={id} type={type || 'text'} value={value}
        placeholder={focused ? (placeholder || '') : ''}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onChange={onChange}
        style={{ paddingTop: lifted ? '1.4rem' : '0.95rem', paddingBottom: lifted ? '0.4rem' : '0.95rem', paddingRight: rightSlot ? '3rem' : '1rem' }}
        className={'w-full rounded-xl border bg-white px-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 ' + (focused ? 'border-[#1a2744] shadow-[0_0_0_3px_rgba(26,39,68,0.1)]' : 'border-gray-200 hover:border-gray-300')}
      />
      <label htmlFor={id}
        style={{ top: lifted ? '0.42rem' : '50%', transform: lifted ? 'translateY(0) scale(0.75)' : 'translateY(-50%) scale(1)', color: focused ? '#1a2744' : '#9ca3af', transformOrigin: 'left center' }}
        className="pointer-events-none absolute left-4 text-sm font-medium transition-all duration-200">
        {label}
      </label>
      {rightSlot && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>}
    </div>
  );
}

export default function AdminLoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const router = useRouter();

  const submit = async () => {
    if (!email || !password) { setError('Email and password are required.'); return; }
    setError(''); setLoading(true);
    try {
      const { data } = await adminLogin({ email, password });
      setAccessToken(data.access_token);
      router.push('/admin/dashboard');
    } catch (err) {
      const status = err?.response?.status;
      setError(status === 403 ? 'Access denied. Admin privileges required.' : 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600&display=swap');
        .admin-root   { font-family: 'Outfit', sans-serif; }
        .display-font { font-family: 'Cormorant Garamond', serif; }
        .admin-btn { background: linear-gradient(135deg, #1a2744 0%, #2d4070 100%); box-shadow: 0 4px 20px rgba(26,39,68,0.4); transition: all 0.25s ease; }
        .admin-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(26,39,68,0.5); }
        .admin-btn:active:not(:disabled) { transform: translateY(0); }
        .grid-bg { background-color: #f0f2f7; background-image: linear-gradient(rgba(26,39,68,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,39,68,0.04) 1px, transparent 1px); background-size: 32px 32px; }
      `}</style>

      <div className="admin-root min-h-screen grid-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2.5 bg-[#1a2744] text-white rounded-2xl px-5 py-3 shadow-lg">
              <ShieldCheck size={18} />
              <span className="text-sm font-semibold tracking-wide">APPNA NC Admin Portal</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #1a2744, #2d4070, #4a6fa5)' }} />
            <div className="p-8">
              <div className="mb-7">
                <h1 className="display-font text-3xl font-semibold text-gray-900 mb-1">Administrator Login</h1>
                <p className="text-sm text-gray-400">Restricted to authorised personnel only.</p>
              </div>
              <div className="space-y-4">
                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                    <span>&#9888;</span> {error}
                  </div>
                )}
                <FloatingInput id="email" label="Admin email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} placeholder="admin@appnanc.org" />
                <FloatingInput id="password" label="Password" type={showPass ? 'text' : 'password'}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  rightSlot={
                    <button type="button" tabIndex={-1} onClick={() => setShowPass(v => !v)}
                      className="text-gray-400 hover:text-gray-600 transition-colors">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
                <button onClick={submit} disabled={loading || !email || !password}
                  className="admin-btn w-full rounded-xl text-white py-3.5 text-sm font-semibold tracking-wide disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
                  {loading ? <><Loader2 size={15} className="animate-spin" /> Signing in...</> : 'Sign in to Admin'}
                </button>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            Not an admin? <a href="/login" className="text-[#1a2744] font-semibold hover:underline">Member login</a>
          </p>
        </div>
      </div>
    </>
  );
}