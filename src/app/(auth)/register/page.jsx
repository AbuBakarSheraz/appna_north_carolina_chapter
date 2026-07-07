'use client';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { register } from '../../../lib/auth';
import { setAccessToken } from '../../../store/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Upload, Eye, EyeOff, Check, X, User } from 'lucide-react';

/* ─── Floating-label input ─────────────────────────────────────── */
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
          w-full rounded-xl border bg-white px-4 pr-${rightSlot ? '12' : '4'}
          text-sm text-gray-900 placeholder-gray-400
          transition-all duration-200 outline-none
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

/* ─── Strength bar ──────────────────────────────────────────────── */
function PasswordStrength({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: i <= score ? colors[score] : '#e5e7eb',
              transition: 'background-color 0.3s ease',
            }}
            className="h-1 flex-1 rounded-full"
          />
        ))}
      </div>
      <p style={{ color: colors[score] }} className="text-xs font-medium">
        {labels[score]}
      </p>
    </div>
  );
}

/* ─── Avatar uploader ───────────────────────────────────────────── */
function AvatarUploader({ onFileChange }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    onFileChange(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      style={{
        borderColor: dragging ? '#7a1f3d' : '#e5e7eb',
        backgroundColor: dragging ? 'rgba(122,31,61,0.04)' : '#fafafa',
      }}
      className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 transition-all hover:border-[#7a1f3d] hover:bg-[rgba(122,31,61,0.03)]"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {preview ? (
        <>
          <img src={preview} alt="preview" className="h-16 w-16 rounded-full object-cover ring-2 ring-[#7a1f3d]/20" />
          <p className="text-xs text-gray-500">Click to change photo</p>
        </>
      ) : (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7a1f3d]/8">
            <User size={22} className="text-[#7a1f3d]/60" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              <span className="text-[#7a1f3d]">Upload photo</span> or drag here
            </p>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP · max 5 MB</p>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────── */
export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [prefix, setPrefix] = useState('DR');
  const [suffix, setSuffix] = useState('MD');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = identity, 2 = credentials
  const router = useRouter();

  const submit = async () => {
    try {
      if (!agreedToTerms) { alert('Please agree to the terms & policy'); return; }
      setLoading(true);
      const formData = new FormData();
      formData.append('email', email);
      formData.append('username', username);
      formData.append('password', password);
      formData.append('prefix', prefix);
      formData.append('suffix', suffix);
      if (image) formData.append('image', image);
      const { data } = await register(formData);
      setAccessToken(data.access_token);
      router.push('/dashboard');
    } catch (error) {
      alert(error?.response?.data?.message || 'Registration failed');
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

        .step-enter { animation: fadeSlideIn 0.35s cubic-bezier(.16,1,.3,1) both; }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
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

        .select-field {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
        }

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

        .progress-track { background: rgba(255,255,255,0.2); }
        .progress-fill {
          background: white;
          transition: width 0.4s cubic-bezier(.16,1,.3,1);
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
                Join our<br />community of<br />physicians.
              </h2>
              <p className="text-white/65 text-sm leading-relaxed max-w-xs">
                Connect with fellow healthcare professionals, access exclusive resources, and make an impact together.
              </p>
            </div>

            {/* Progress */}
            <div className="mt-10 lg:mt-0">
              <div className="flex items-center gap-3 mb-3">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div style={{
                      background: step >= s ? 'white' : 'rgba(255,255,255,0.25)',
                      color: step >= s ? '#7a1f3d' : 'white',
                    }}
                      className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                    >
                      {step > s ? <Check size={13} /> : s}
                    </div>
                    <span className={`text-xs font-medium transition-opacity ${step >= s ? 'opacity-100' : 'opacity-40'}`}>
                      {s === 1 ? 'Identity' : 'Credentials'}
                    </span>
                    {s < 2 && <div className="w-8 h-px bg-white/30 mx-1" />}
                  </div>
                ))}
              </div>
              <div className="progress-track h-1 rounded-full overflow-hidden">
                <div className="progress-fill h-full rounded-full" style={{ width: step === 1 ? '50%' : '100%' }} />
              </div>
            </div>
          </aside>

          {/* ── Right form panel ── */}
          <main className="flex-1 p-8 sm:p-10 flex flex-col">

            {/* Back */}
            <Link href="/" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-[#7a1f3d] text-sm transition-colors mb-8 w-fit">
              <ArrowLeft size={15} />
              <span>Back to home</span>
            </Link>

            <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">

              <div className="mb-8 step-enter" key={`header-${step}`}>
                <p className="text-[#7a1f3d] text-xs font-semibold tracking-widest uppercase mb-2">
                  Step {step} of 2
                </p>
                <h1 className="display-font text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
                  {step === 1 ? 'Your identity' : 'Secure access'}
                </h1>
                <p className="text-gray-500 text-sm mt-1.5">
                  {step === 1
                    ? 'Tell us who you are and upload your photo.'
                    : 'Set your login credentials and finalize.'}
                </p>
              </div>

              {/* ── Step 1: Identity ── */}
              {step === 1 && (
                <div className="space-y-5 step-enter">

                  {/* Prefix + Suffix */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: 'Title / Prefix', value: prefix, onChange: setPrefix,
                        options: [['DR', 'Dr.'], ['MISS', 'Miss'], ['MR', 'Mr.'], ['MRS', 'Mrs.'], ['MS', 'Ms.']]
                      },
                      {
                        label: 'Credential / Suffix', value: suffix, onChange: setSuffix,
                        options: [['MD', 'M.D.'], ['DO', 'D.O.'], ['DDS', 'D.D.S.'], ['DMD', 'D.M.D.'], ['NA', 'N/A']]
                      },
                    ].map(({ label, value, onChange, options }) => (
                      <div key={label}>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                        <select
                          value={value}
                          onChange={(e) => onChange(e.target.value)}
                          className="select-field w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#7a1f3d] focus:shadow-[0_0_0_3px_rgba(122,31,61,0.1)] transition-all cursor-pointer"
                        >
                          {options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>

                  {/* Full name */}
                  <FloatingInput
                    id="username"
                    label="Username"
                    placeholder="John Doe"
                    onChange={(e) => setUsername(e.target.value)}
                  />

                  {/* Avatar */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Profile photo</label>
                    <AvatarUploader onFileChange={setImage} />
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!username}
                    className="accent-btn w-full rounded-xl text-white py-3.5 text-sm font-semibold tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* ── Step 2: Credentials ── */}
              {step === 2 && (
                <div className="space-y-5 step-enter">

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
                      placeholder="Min. 8 characters"
                      onChange={(e) => setPassword(e.target.value)}
                      rightSlot={
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      }
                    />
                    <PasswordStrength password={password} />
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div
                      onClick={() => setAgreedToTerms((v) => !v)}
                      style={{
                        background: agreedToTerms ? '#7a1f3d' : 'white',
                        borderColor: agreedToTerms ? '#7a1f3d' : '#d1d5db',
                      }}
                      className="mt-0.5 shrink-0 h-4.5 w-4.5 rounded border-2 flex items-center justify-center transition-all"
                    >
                      {agreedToTerms && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-sm text-gray-600 leading-relaxed">
                      I agree to the{' '}
                      <Link href="/organization"  target="_blank" className="text-[#7a1f3d] font-medium hover:underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link href="/organization"  target="_blank" className="text-[#7a1f3d] font-medium hover:underline">Privacy Policy</Link>
                    </span>
                  </label>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => setStep(1)}
                      className="shrink-0 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={submit}
                      disabled={loading || !email || !password || !agreedToTerms}
                      className="accent-btn flex-1 rounded-xl text-white py-3.5 text-sm font-semibold tracking-wide disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Creating account…
                        </>
                      ) : 'Create account'}
                    </button>
                  </div>
                </div>
              )}

              <p className="text-center text-sm text-gray-500 mt-8">
                Already have an account?{' '}
                <Link href="/login" className="text-[#7a1f3d] font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </main>
        </div>
      </section>
    </>
  );
}