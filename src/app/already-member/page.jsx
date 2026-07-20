'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Check, User, Phone, GraduationCap, Stethoscope,
  MapPin, CreditCard, Loader2, AlertCircle, Eye, EyeOff,
} from 'lucide-react';
import { registerAlreadyMember } from '../../lib/profile';

/* ── Shared floating input (same design language as your other pages) ── */
function FloatingInput({ id, label, type = 'text', placeholder = '', value, onChange, required, rightSlot, min, max }) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || !!value;
  return (
    <div className="relative">
      <input
        id={id} type={type} value={value ?? ''} placeholder={focused ? placeholder : ''}
        required={required} min={min} max={max}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onChange={onChange}
        style={{ paddingTop: lifted ? '1.4rem' : '0.95rem', paddingBottom: lifted ? '0.4rem' : '0.95rem' }}
        className={`w-full rounded-xl border bg-white px-4 ${rightSlot ? 'pr-12' : 'pr-4'} text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 ${focused ? 'border-[#7a1f3d] shadow-[0_0_0_3px_rgba(122,31,61,0.1)]' : 'border-gray-200 hover:border-gray-300'}`}
      />
      <label htmlFor={id}
        style={{ top: lifted ? '0.42rem' : '50%', transform: lifted ? 'translateY(0) scale(0.75)' : 'translateY(-50%) scale(1)', color: focused ? '#7a1f3d' : '#9ca3af', transformOrigin: 'left center' }}
        className="pointer-events-none absolute left-4 text-sm font-medium transition-all duration-200">
        {label}{required && <span className="text-[#7a1f3d] ml-0.5">*</span>}
      </label>
      {rightSlot && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>}
    </div>
  );
}

function FloatingSelect({ id, label, value, onChange, options, required }) {
  const lifted = !!value;
  return (
    <div className="relative">
      <select id={id} value={value ?? ''} onChange={onChange} required={required}
        style={{ paddingTop: lifted ? '1.4rem' : '0.95rem', paddingBottom: lifted ? '0.4rem' : '0.95rem' }}
        className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 outline-none transition-all duration-200 cursor-pointer hover:border-gray-300 focus:border-[#7a1f3d] focus:shadow-[0_0_0_3px_rgba(122,31,61,0.1)]">
        <option value="" disabled />
        {options.map(({ value: v, label: l }) => <option key={v} value={v}>{l}</option>)}
      </select>
      <label htmlFor={id}
        style={{ top: lifted ? '0.42rem' : '50%', transform: lifted ? 'translateY(0) scale(0.75)' : 'translateY(-50%) scale(1)', color: '#9ca3af', transformOrigin: 'left center' }}
        className="pointer-events-none absolute left-4 text-sm font-medium transition-all duration-200">
        {label}{required && <span className="text-[#7a1f3d] ml-0.5">*</span>}
      </label>
    </div>
  );
}

function SectionLabel({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 mb-3 mt-1">
      <Icon size={13} className="text-[#7a1f3d]" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#7a1f3d]">{text}</span>
      <div className="flex-1 h-px bg-[#7a1f3d]/10 ml-1" />
    </div>
  );
}

function Grid2({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

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
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      style={{ borderColor: dragging ? '#7a1f3d' : '#e5e7eb', backgroundColor: dragging ? 'rgba(122,31,61,0.04)' : '#fafafa' }}
      className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 transition-all hover:border-[#7a1f3d] hover:bg-[rgba(122,31,61,0.03)]"
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
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
            <p className="text-sm font-medium text-gray-700"><span className="text-[#7a1f3d]">Upload photo</span> or drag here</p>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP · max 5 MB (optional)</p>
          </div>
        </>
      )}
    </div>
  );
}

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
      <AlertCircle size={15} className="mt-0.5 flex-shrink-0" /><span>{message}</span>
    </div>
  );
}

function SuccessModal({ open, message }) {
  const router = useRouter();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg viewBox="0 0 52 52" className="h-12 w-12">
            <circle cx="26" cy="26" r="24" fill="none" stroke="#16a34a" strokeWidth="3"
              style={{ strokeDasharray: 151, strokeDashoffset: 151, animation: 'am-circle 0.5s ease-out forwards' }} />
            <path d="M14 27l7 7 17-17" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 36, strokeDashoffset: 36, animation: 'am-check 0.3s 0.5s ease-out forwards' }} />
          </svg>
        </div>
        <h3 className="mt-5 text-lg font-semibold text-green-700">Request submitted</h3>
        <p className="mt-2 text-sm leading-relaxed text-green-700">{message}</p>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
        >
          Got it — take me to sign in
        </button>
      </div>
      <style jsx global>{`
        @keyframes am-circle { to { stroke-dashoffset: 0; } }
        @keyframes am-check  { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
}

const EMPTY = {
  email: '', username: '', password: '', prefix: 'DR', suffix: 'MD',
  firstName: '', lastName: '', phoneNumber: '', referredBy: '',
  institutionName: '', graduationYear: '', primarySpecialty: '', secondarySpecialty: '',
  currentlyPracticing: '', internship: '', residency: '', fellowship1: '', fellowship2: '',
  street: '', city: '', state: '',
  membershipType: 'ANNUAL',
};

export default function AlreadyMemberPage() {
  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    // street and state aren't shown as required in the UI, but the backend
    // still expects a value — fall back to sensible defaults when left blank.
    const street = form.street.trim() || 'Not entered by user';
    const state = form.state.trim() || 'North Carolina';

    const required = ['email', 'username', 'password', 'firstName', 'lastName', 'phoneNumber',
      'institutionName', 'graduationYear', 'primarySpecialty', 'city'];
    if (required.some((k) => !form[k])) {
      setError('Please fill in all required fields, marked with *.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries({ ...form, street, state }).forEach(([k, v]) => { if (v !== '') fd.append(k, v); });
      if (image) fd.append('image', image);
      await registerAlreadyMember(fd);
      setSubmitted(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Image Size must be less than 5 MB.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
        .am-root { font-family: 'Outfit', sans-serif; }
        .display-font { font-family: 'Cormorant Garamond', serif; }
        .step-enter { animation: fadeSlideIn 0.35s cubic-bezier(.16,1,.3,1) both; }
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }
        .accent-btn { background: linear-gradient(135deg, #7a1f3d 0%, #9b2d51 100%); box-shadow: 0 4px 20px rgba(122,31,61,0.35); transition: all .25s ease; }
        .accent-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(122,31,61,0.45); }
        .panel-bg { background: linear-gradient(160deg, #4a0e22 0%, #7a1f3d 50%, #9b3855 100%); }
        .noise-overlay::after {
          content:''; position:absolute; inset:0; pointer-events:none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        }
      `}</style>

      <section className="am-root min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row bg-white">

          {/* Left panel */}
          <aside className="panel-bg noise-overlay relative lg:w-[38%] flex flex-col justify-between p-8 sm:p-10 text-white">
            <div>
              <div className="inline-flex items-center gap-2 mb-10">
                <div className="h-8 w-8 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center text-xs font-bold">A</div>
                <span className="text-sm font-semibold tracking-widest uppercase opacity-80">APPNA NC</span>
              </div>
              <h2 className="display-font text-4xl sm:text-5xl font-semibold leading-tight mb-4">
                Already a<br />member?
              </h2>
              <p className="text-white/65 text-sm leading-relaxed max-w-xs">
                If you already hold an Annual or Lifetime APPNA NC membership, fill this out once and we'll verify and issue your portal access and card — no payment needed.
              </p>
              <div className="mt-6 space-y-2.5">
                {['One form, no separate registration step', 'No payment required for existing members', 'We verify and email your confirmation'].map((t) => (
                  <div key={t} className="flex items-start gap-2.5">
                    <div className="mt-0.5 h-4 w-4 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0"><Check size={9} strokeWidth={3} /></div>
                    <p className="text-xs text-white/70 leading-relaxed">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Right form */}
          <main className="flex-1 flex flex-col" style={{ maxHeight: '92vh' }}>
            <div className="px-8 sm:px-10 pt-8 pb-5 border-b border-gray-100 flex-shrink-0">
              <Link href="/" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-[#7a1f3d] text-sm transition-colors mb-4 w-fit">
                <ArrowLeft size={15} /><span>Back to home</span>
              </Link>
              <h1 className="display-font text-2xl sm:text-3xl font-semibold text-gray-900">Existing member registration</h1>
              <p className="text-gray-400 text-xs mt-0.5">Fill everything in once — account, profile, and membership.</p>
            </div>

            <div className="flex-1 overflow-y-auto px-8 sm:px-10 py-7 space-y-5 step-enter">
              <ErrorBanner message={error} />

              <SectionLabel icon={User} text="Account" />
              <Grid2>
                <FloatingInput id="email" label="Email address" type="email" value={form.email} onChange={set('email')} required />
                <FloatingInput id="username" label="Username" value={form.username} onChange={set('username')} required />
              </Grid2>
              <FloatingInput
                id="password" label="Password" type={showPassword ? 'text' : 'password'}
                value={form.password} onChange={set('password')} required placeholder="Min. 8 characters"
                rightSlot={
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-gray-400 hover:text-gray-600" tabIndex={-1}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <Grid2>
                <FloatingSelect id="prefix" label="Title / Prefix" value={form.prefix} onChange={set('prefix')}
                  options={[['DR','Dr.'],['MISS','Miss'],['MR','Mr.'],['MRS','Mrs.'],['MS','Ms.']].map(([value,label]) => ({ value, label }))} />
                <FloatingSelect id="suffix" label="Credential / Suffix" value={form.suffix} onChange={set('suffix')}
                  options={[['MD','M.D.'],['DO','D.O.'],['DDS','D.D.S.'],['DMD','D.M.D.'],['NA','N/A']].map(([value,label]) => ({ value, label }))} />
              </Grid2>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Profile photo</label>
                <AvatarUploader onFileChange={setImage} />
              </div>

              <SectionLabel icon={Phone} text="Identity & contact" />
              <Grid2>
                <FloatingInput id="firstName" label="First name" value={form.firstName} onChange={set('firstName')} required />
                <FloatingInput id="lastName" label="Last name" value={form.lastName} onChange={set('lastName')} required />
              </Grid2>
              <Grid2>
                <FloatingInput id="phone" label="Phone number" value={form.phoneNumber} onChange={set('phoneNumber')} required placeholder="+1 (800) 555-0199" />
                <FloatingInput id="ref" label="Referred by (optional)" value={form.referredBy} onChange={set('referredBy')} />
              </Grid2>

              <SectionLabel icon={GraduationCap} text="Medical education" />
              <FloatingInput id="inst" label="Medical school / institution" value={form.institutionName} onChange={set('institutionName')} required />
              <Grid2>
                <FloatingInput id="gradYear" label="Graduation year" type="number" value={form.graduationYear} onChange={set('graduationYear')} min="1950" max={String(new Date().getFullYear())} required />
                <FloatingSelect id="practicing" label="Currently practicing" value={form.currentlyPracticing} onChange={set('currentlyPracticing')}
                  options={[{ value: 'ACADEMICS', label: 'Academics' }, { value: 'NON_ACADEMICS', label: 'Non-Academics' }]} />
              </Grid2>
              <Grid2>
                <FloatingInput id="primary" label="Primary specialty" value={form.primarySpecialty} onChange={set('primarySpecialty')} required />
                <FloatingInput id="secondary" label="Secondary specialty" value={form.secondarySpecialty} onChange={set('secondarySpecialty')} />
              </Grid2>
              <Grid2>
                <FloatingInput id="intern" label="Internship" value={form.internship} onChange={set('internship')} />
                <FloatingInput id="residency" label="Residency" value={form.residency} onChange={set('residency')} />
                <FloatingInput id="fellow1" label="Fellowship 1" value={form.fellowship1} onChange={set('fellowship1')} />
                <FloatingInput id="fellow2" label="Fellowship 2" value={form.fellowship2} onChange={set('fellowship2')} />
              </Grid2>

              <SectionLabel icon={MapPin} text="Home address" />
              <FloatingInput id="street" label="Street address" value={form.street} onChange={set('street')} />
              <Grid2>
                <FloatingInput id="city" label="City" value={form.city} onChange={set('city')} required />
                <FloatingInput id="state" label="State" value={form.state} onChange={set('state')} />
              </Grid2>

              <SectionLabel icon={CreditCard} text="Membership type" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { type: 'ANNUAL', label: 'Annual', desc: 'Renews Dec 31', accent: '#7a1f3d' },
                  { type: 'LIFETIME', label: 'Lifetime', desc: 'One-time, never expires', accent: '#1a3a5c' },
                ].map((plan) => (
                  <button key={plan.type} type="button" onClick={() => setForm((p) => ({ ...p, membershipType: plan.type }))}
                    style={{ borderColor: form.membershipType === plan.type ? plan.accent : '#e5e7eb' }}
                    className="relative text-left rounded-xl border-2 p-4 transition-all hover:border-gray-300 bg-white">
                    <p className="font-semibold text-sm text-gray-900">{plan.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{plan.desc}</p>
                    {form.membershipType === plan.type && (
                      <div className="absolute top-3 right-3 h-5 w-5 rounded-full flex items-center justify-center" style={{ background: plan.accent }}>
                        <Check size={10} strokeWidth={3} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700 leading-relaxed">
                No payment is collected here. APPNA NC will verify your existing membership and email your confirmation — after that you can sign in and download your card.
              </div>

              <button
                type="button" onClick={submit} disabled={loading}
                className="accent-btn w-full rounded-xl text-white py-3.5 text-sm font-semibold tracking-wide disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Submit request'}
              </button>
            </div>
          </main>
        </div>
      </section>

      <SuccessModal
        open={submitted}
        message="APPNA NC will verify your existing membership and email your confirmation shortly. Once confirmed, sign in to view and download your membership card."
      />
    </>
  );
}