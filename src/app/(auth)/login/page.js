'use client';

import { useState } from 'react';
import { login } from '../../../lib/auth';
import { setAccessToken } from '../../../store/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

/* ─── Floating-label input (shared design system) ───────────────── */
function FloatingInput({ id, label, type = 'text', placeholder, onChange, rightSlot }) {
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState(false);

  return (
    <div className="relative group">
      <input
        id={id}
        type={type}
        placeholder={focused ? placeholder : ''}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          setFilled(!!e.target.value);
        }}
        onChange={(e) => {
          setFilled(!!e.target.value);
          onChange(e);
        }}
        style={{
          paddingTop: focused || filled ? '1.5rem' : '1rem',
          paddingBottom: focused || filled ? '0.5rem' : '1rem',
        }}
        className={`
          w-full rounded-xl border bg-white px-4
          text-sm text-gray-900 placeholder-gray-400
          transition-all duration-200 outline-none
          ${rightSlot ? 'pr-12' : 'pr-4'}
          ${focused
            ? 'border-[#7a1f3d] shadow-[0_0_0_3px_rgba(122,31,61,0.1)]'
            : 'border-gray-200 hover:border-gray-300'}
        `}
      />
      <label
        htmlFor={id}
        style={{
          top: focused || filled ? '0.45rem' : '50%',
          transform: focused || filled ? 'translateY(0) scale(0.78)' : 'translateY(-50%) scale(1)',
          color: focused ? '#7a1f3d' : '#6b7280',
          transformOrigin: 'left center',
        }}
        className="pointer-events-none absolute left-4 font-medium transition-all duration-200 text-sm"
      >
        {label}
      </label>
      {rightSlot && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
      )}
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────── */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const submit = async (event) => {
    event?.preventDefault();
    setError('');
    try {
      setLoading(true);
      const { data } = await login({ email, password });
      setAccessToken(data.access_token);
      router.push('/dashboard');
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Login timed out. Please check your connection and try again.');
      } else if (!err.response) {
        setError('Unable to reach the server. Please try again in a moment.');
      } else if (err.response.status === 401) {
        setError(err.response.data?.message || 'Invalid email or password.');
      } else if (err.response.status >= 500) {
        setError('Server error. Please try again shortly.');
      } else {
        setError(err.response.data?.message || 'Unable to sign in.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');

        .reg-root { font-family: 'Outfit', sans-serif; }
        .display-font { font-family: 'Cormorant Garamond', serif; }

        .fade-in { animation: fadeSlideIn 0.4s cubic-bezier(.16,1,.3,1) both; }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .accent-btn {
          background: linear-gradient(135deg, #7a1f3d 0%, #9b2d51 100%);
          box-shadow: 0 4px 20px rgba(122,31,61,0.35);
          transition: all 0.25s ease;
        }
        .accent-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(122,31,61,0.45);
        }
        .accent-btn:active:not(:disabled) { transform: translateY(0); }

        .panel-bg {
          background: linear-gradient(160deg, #4a0e22 0%, #7a1f3d 50%, #9b3855 100%);
        }

        .noise-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          font-size: 0.75rem;
          color: rgba(255,255,255,0.85);
          font-weight: 500;
        }
      `}</style>

      <section className="reg-root min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row bg-white">

          {/* ── Left brand panel ── */}
          <aside className="panel-bg noise-overlay relative lg:w-[42%] flex flex-col justify-between p-8 sm:p-10 text-white">

            {/* Logo / brand */}
            <div>
              <div className="inline-flex items-center gap-2 mb-10">
                <div className="h-8 w-8 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center text-xs font-bold tracking-wide">A</div>
                <span className="text-sm font-semibold tracking-widest uppercase opacity-80">APPNA NC</span>
              </div>

              <h2 className="display-font text-4xl sm:text-5xl font-semibold leading-tight mb-4">
                Welcome<br />back,<br />Doctor.
              </h2>
              <p className="text-white/65 text-sm leading-relaxed max-w-xs">
                Access your network, events, and community resources — all in one place.
              </p>
            </div>

            {/* Trust badges */}
            <div className="mt-10 lg:mt-0 space-y-2.5">
              {[
                { icon: '🔒', label: 'Secure 256-bit encryption' },
                // { icon: '🏥', label: 'Verified physicians only' },
                // { icon: '🌐', label: '2,400+ members nationwide' },
              ].map(({ icon, label }) => (
                <div key={label} className="trust-badge">
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Right form panel ── */}
          <main className="flex-1 p-8 sm:p-10 flex flex-col">

            {/* Back */}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-[#7a1f3d] text-sm transition-colors mb-8 w-fit"
              aria-label="Go back"
            >
              <ArrowLeft size={15} />
              <span>Back to home</span>
            </Link>

            <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">

              {/* Header */}
              <div className="mb-8 fade-in">
                <p className="text-[#7a1f3d] text-xs font-semibold tracking-widest uppercase mb-2">
                  Member portal
                </p>
                <h1 className="display-font text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
                  Sign in to your account
                </h1>
                <p className="text-gray-500 text-sm mt-1.5">
                  Enter your credentials to continue to your dashboard.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={submit} className="space-y-5 fade-in" style={{ animationDelay: '0.08s' }}>

                <FloatingInput
                  id="email"
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div>
                  <FloatingInput
                    id="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Your password"
                    onChange={(e) => setPassword(e.target.value)}
                    rightSlot={
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />

                  {/* Forgot password */}
                  <div className="mt-2 flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-xs text-[#7a1f3d] font-semibold hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* CTA */}
                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="accent-btn w-full rounded-xl text-white py-3.5 text-sm font-semibold tracking-wide disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in…
                    </>
                  ) : 'Sign in'}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="divider-line" />
                  <span className="text-xs text-gray-400 font-medium whitespace-nowrap">New to APPNA NC?</span>
                  <div className="divider-line" />
                </div>

                {/* Register CTA */}
                <Link
                  href="/register"
                  className="block w-full rounded-xl border-2 border-gray-200 text-center py-3.5 text-sm font-semibold text-gray-700 hover:border-[#7a1f3d] hover:text-[#7a1f3d] transition-all duration-200"
                >
                  Create an account
                </Link>

              </form>
            </div>
          </main>

        </div>
      </section>
    </>
  );
}
