'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, ArrowLeft, Check,
  Building2, MapPin, CreditCard,
  Stethoscope, Phone, Heart, ChevronDown,
  SkipForward, Loader2, AlertCircle, User,
  GraduationCap,
} from 'lucide-react';
import {
  getFullProfile,
  saveBasicInfo,
  saveMedicalEducation,
  saveAddress,
  saveOfficeInfo,
  skipOfficeInfo,
  selectMembership,
  createSquareCheckout,
  payMembershipWithSquareToken,
} from '../../../lib/profile';
import SquarePaymentOptions from '../../../components/payments/SquarePaymentOptions';

const STEPS = [
  { id: 1, label: 'Basic Info',  icon: User        },
  { id: 2, label: 'Medical',     icon: Stethoscope },
  { id: 3, label: 'Address',     icon: MapPin      },
  { id: 4, label: 'Office',      icon: Building2   },
  { id: 5, label: 'Membership',  icon: CreditCard  },
];

const STEP_HEADERS = {
  1: { label: 'Personal details',  sub: 'Your name, contact info and background.' },
  2: { label: 'Medical education', sub: 'Training history and specialty.'           },
  3: { label: 'Home address',      sub: 'Location for chapter assignment.'           },
  4: { label: 'Office & practice', sub: 'Where you see patients.'                   },
  5: { label: 'Choose your plan',  sub: 'Select a membership tier to finish.'        },
};

const PANEL_CONTENT = {
  1: {
    heading: 'Tell us\nabout yourself.',
    sub: 'Your personal details help us verify your identity and connect you with the right members.',
    tips: ['All information is encrypted and secure', 'You can update this anytime from your profile'],
  },
  2: {
    heading: 'Your medical\nbackground.',
    sub: 'Help the community understand your training. This builds trust among peers.',
    tips: ['Specialty information is used for event matching', 'Optional fields can be added later'],
  },
  3: {
    heading: 'Where are\nyou located?',
    sub: 'Your address connects you with local events, chapter meetings, and nearby physicians.',
    tips: ['Address is only shared with chapter leadership', 'Used for chapter assignment and local events'],
  },
  4: {
    heading: 'Your practice\ndetails.',
    sub: 'Add your office info so members can refer patients and connect professionally.',
    tips: ['This step is completely optional', 'Shown on your member directory listing'],
  },
  5: {
    heading: 'Choose your\nmembership.',
    sub: 'Select the plan that fits your career stage. All plans include full chapter access.',
    tips: ['Annual memberships expire on December 31', 'Secure checkout through Square'],
  },
};

const MEMBERSHIP_PLANS = [
  {
    type: 'STUDENT', label: 'Resident / Fellow in Training', price: 'Free', period: 'through Dec 31',
    desc: 'For Pakistani-origin physicians currently in residency or fellowship training', accent: '#4a7c59',
    perks: ['Community access', 'Educational events', 'Mentorship program'],
  },
  {
    type: 'ANNUAL', label: 'Annual', price: 50, period: 'through Dec 31',
    desc: 'Full access for active physicians', accent: '#7a1f3d', popular: true,
    perks: ['All community features', 'CME events & workshops', 'Networking dinners', 'Voting rights'],
  },
  {
    type: 'LIFETIME', label: 'Lifetime', price: 500, period: 'one-time',
    desc: 'Lifetime commitment to the chapter', accent: '#1a3a5c',
    perks: ['Everything in Annual', 'Lifetime recognition', 'Legacy board access', 'Priority invitations'],
  },
];

function FloatingInput({ id, label, type = 'text', placeholder = '', value, onChange, required, min, max }) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || !!value;
  return (
    <div className="relative">
      <input id={id} type={type} value={value ?? ''} placeholder={focused ? placeholder : ''}
        required={required} min={min} max={max}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onChange={onChange}
        style={{ paddingTop: lifted ? '1.4rem' : '0.95rem', paddingBottom: lifted ? '0.4rem' : '0.95rem' }}
        className={`w-full rounded-xl border bg-white px-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 ${focused ? 'border-[#7a1f3d] shadow-[0_0_0_3px_rgba(122,31,61,0.1)]' : 'border-gray-200 hover:border-gray-300'}`}
      />
      <label htmlFor={id} style={{ top: lifted ? '0.42rem' : '50%', transform: lifted ? 'translateY(0) scale(0.75)' : 'translateY(-50%) scale(1)', color: focused ? '#7a1f3d' : '#9ca3af', transformOrigin: 'left center' }}
        className="pointer-events-none absolute left-4 text-sm font-medium transition-all duration-200">
        {label}{required && <span className="text-[#7a1f3d] ml-0.5">*</span>}
      </label>
    </div>
  );
}

function FloatingSelect({ id, label, value, onChange, options, required }) {
  const lifted = !!value;
  return (
    <div className="relative">
      <select id={id} value={value ?? ''} onChange={onChange} required={required}
        style={{ paddingTop: lifted ? '1.4rem' : '0.95rem', paddingBottom: lifted ? '0.4rem' : '0.95rem' }}
        className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 outline-none transition-all duration-200 cursor-pointer hover:border-gray-300 focus:border-[#7a1f3d] focus:shadow-[0_0_0_3px_rgba(122,31,61,0.1)]"
      >
        <option value="" disabled />
        {options.map(({ value: v, label: l }) => <option key={v} value={v}>{l}</option>)}
      </select>
      <label htmlFor={id} style={{ top: lifted ? '0.42rem' : '50%', transform: lifted ? 'translateY(0) scale(0.75)' : 'translateY(-50%) scale(1)', color: '#9ca3af', transformOrigin: 'left center' }}
        className="pointer-events-none absolute left-4 text-sm font-medium transition-all duration-200">
        {label}{required && <span className="text-[#7a1f3d] ml-0.5">*</span>}
      </label>
      <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
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

function PrimaryBtn({ children, onClick, loading, disabled }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled || loading}
      className="accent-btn flex items-center justify-center gap-2 w-full rounded-xl text-white py-3.5 text-sm font-semibold tracking-wide disabled:opacity-40 disabled:cursor-not-allowed">
      {loading ? <Loader2 size={16} className="animate-spin" /> : children}
    </button>
  );
}

function GhostBtn({ children, onClick, icon: Icon }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-600 hover:border-[#7a1f3d]/40 hover:text-[#7a1f3d] transition-all duration-200">
      {Icon && <Icon size={14} />}{children}
    </button>
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

function LeftPanel({ step, completedSteps }) {
  const content = PANEL_CONTENT[step];
  return (
    <aside className="panel-bg noise-overlay relative lg:w-[40%] flex flex-col justify-between p-8 sm:p-10 text-white">
      <div>
        <div className="inline-flex items-center gap-2 mb-10">
          <div className="h-8 w-8 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center text-xs font-bold">A</div>
          <span className="text-sm font-semibold tracking-widest uppercase opacity-80">APPNA NC</span>
        </div>
        <p className="text-[10px] font-bold tracking-widest uppercase text-white/50 mb-3">Step {step} of {STEPS.length}</p>
        <h2 className="display-font text-4xl sm:text-5xl font-semibold leading-tight mb-4" style={{ whiteSpace: 'pre-line' }}>{content.heading}</h2>
        <p className="text-white/60 text-sm leading-relaxed max-w-xs">{content.sub}</p>
        <div className="mt-6 space-y-2.5">
          {content.tips.map((tip) => (
            <div key={tip} className="flex items-start gap-2.5">
              <div className="mt-0.5 h-4 w-4 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0"><Check size={9} strokeWidth={3} /></div>
              <p className="text-xs text-white/70 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 lg:mt-0">
        <div className="flex items-center gap-1.5 mb-3">
          {STEPS.map((s) => {
            const done = completedSteps.includes(s.id);
            const active = s.id === step;
            return (
              <div key={s.id} className="flex items-center gap-1.5">
                <div style={{ background: done ? 'white' : active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)', color: done || active ? '#7a1f3d' : 'transparent', width: active ? '2rem' : '1.5rem', height: active ? '2rem' : '1.5rem' }}
                  className="rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300">
                  {done ? <Check size={11} strokeWidth={3} /> : active ? s.id : ''}
                </div>
                {s.id < STEPS.length && <div className="h-px w-3 transition-all duration-500" style={{ background: done ? 'white' : 'rgba(255,255,255,0.2)' }} />}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-white/50">{completedSteps.length} of {STEPS.length} sections completed</p>
      </div>
    </aside>
  );
}

// ── STEP 1 — BASIC INFO (image/prefix/suffix removed — collected at registration) ──
function Step1Basic({ onNext, initialData }) {
  const EMPTY = { firstName: '', lastName: '', dateOfBirth: '', phoneNumber: '', maritalStatus: '', spouse: '', referredBy: '' };
  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Hydrate from server data when available (covers back-navigation & resume)
  useEffect(() => {
    if (!initialData) return;
    setForm({
      firstName:     initialData.firstName     ?? '',
      lastName:      initialData.lastName      ?? '',
      dateOfBirth:   initialData.dateOfBirth
        ? new Date(initialData.dateOfBirth).toISOString().split('T')[0]
        : '',
      phoneNumber:   initialData.phoneNumber   ?? '',
      maritalStatus: initialData.maritalStatus ?? '',
      spouse:        initialData.spouse        ?? '',
      referredBy:    initialData.referredBy    ?? '',
    });
  }, [initialData]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    if (!form.firstName || !form.lastName || !form.phoneNumber) {
      setError('First name, last name, and phone number are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload = { ...form };
      Object.keys(payload).forEach((k) => { if (!payload[k]) delete payload[k]; });
      const { data } = await saveBasicInfo(payload);
      onNext(data.profileStep);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 step-enter">
      <ErrorBanner message={error} />
      <SectionLabel icon={User} text="Name" />
      <Grid2>
        <FloatingInput id="firstName" label="First name" value={form.firstName} onChange={set('firstName')} required />
        <FloatingInput id="lastName"  label="Last name"  value={form.lastName}  onChange={set('lastName')}  required />
      </Grid2>
      <SectionLabel icon={Phone} text="Contact" />
      <Grid2>
        <FloatingInput id="phone" label="Phone number" value={form.phoneNumber} onChange={set('phoneNumber')} required placeholder="+1 (800) 555-0199" />
        {/* <FloatingInput id="dob"   label="Date of birth" type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} /> */}
      </Grid2>
      {/* <SectionLabel icon={Heart} text="Personal" /> */}
      {/* <Grid2>
        <FloatingSelect id="marital" label="Marital status" value={form.maritalStatus} onChange={set('maritalStatus')}
          options={[{value:'SINGLE',label:'Single'},{value:'MARRIED',label:'Married'},{value:'DIVORCED',label:'Divorced'},{value:'WIDOWED',label:'Widowed'}]} />
        {form.maritalStatus === 'MARRIED' && (
          <FloatingInput id="spouse" label="Spouse name" value={form.spouse} onChange={set('spouse')} />
        )}
      </Grid2> */}
      <FloatingInput id="ref" label="Referred by (optional)" value={form.referredBy} onChange={set('referredBy')} />
      <PrimaryBtn onClick={submit} loading={loading}>Save & Continue <ArrowRight size={15} /></PrimaryBtn>
    </div>
  );
}

// ── STEP 2 — MEDICAL EDUCATION ──
function Step2Medical({ onNext, onBack, initialData }) {
  const EMPTY = { institutionName:'', graduationYear:'', primarySpecialty:'', secondarySpecialty:'', internship:'', residency:'', fellowship1:'', fellowship2:'', currentlyPracticing:'' };
  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!initialData) return;
    setForm({
      institutionName:     initialData.institutionName     ?? '',
      graduationYear:      initialData.graduationYear      ? String(initialData.graduationYear) : '',
      primarySpecialty:    initialData.primarySpecialty    ?? '',
      secondarySpecialty:  initialData.secondarySpecialty  ?? '',
      internship:          initialData.internship          ?? '',
      residency:           initialData.residency           ?? '',
      fellowship1:         initialData.fellowship1         ?? '',
      fellowship2:         initialData.fellowship2         ?? '',
      currentlyPracticing: initialData.currentlyPracticing ?? '',
    });
  }, [initialData]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    if (!form.institutionName || !form.graduationYear || !form.primarySpecialty) {
      setError('Institution, graduation year, and primary specialty are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, graduationYear: Number(form.graduationYear) };
      Object.keys(payload).forEach((k) => { if (payload[k] === '') delete payload[k]; });
      payload.graduationYear = Number(form.graduationYear);
      const { data } = await saveMedicalEducation(payload);
      onNext(data.profileStep);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 step-enter">
      <ErrorBanner message={error} />
      <SectionLabel icon={GraduationCap} text="Medical school" />
      <FloatingInput id="inst" label="Medical school / institution" value={form.institutionName} onChange={set('institutionName')} required />
      <Grid2>
        <FloatingInput id="gradYear" label="Graduation year" type="number" value={form.graduationYear}
          onChange={set('graduationYear')} min="1950" max={String(new Date().getFullYear())} required placeholder="e.g. 2005" />
        <FloatingSelect id="practicing" label="Currently practicing" value={form.currentlyPracticing} onChange={set('currentlyPracticing')}
          options={[{value:'ACADEMICS',label:'Academics'},{value:'NON_ACADEMICS',label:'Non-Academics'}]} />
      </Grid2>
      <SectionLabel icon={Stethoscope} text="Specialty" />
      <Grid2>
        <FloatingInput id="primary"   label="Primary specialty"   value={form.primarySpecialty}   onChange={set('primarySpecialty')}   required />
        <FloatingInput id="secondary" label="Secondary specialty" value={form.secondarySpecialty} onChange={set('secondarySpecialty')} />
      </Grid2>
      <SectionLabel icon={GraduationCap} text="Training (all optional)" />
      <Grid2>
        <FloatingInput id="intern"    label="Internship"   value={form.internship}  onChange={set('internship')}  />
        <FloatingInput id="residency" label="Residency"    value={form.residency}   onChange={set('residency')}   />
        <FloatingInput id="fellow1"   label="Fellowship 1" value={form.fellowship1} onChange={set('fellowship1')} />
        <FloatingInput id="fellow2"   label="Fellowship 2" value={form.fellowship2} onChange={set('fellowship2')} />
      </Grid2>
      <div className="flex gap-3 pt-1">
        <GhostBtn onClick={onBack} icon={ArrowLeft}>Back</GhostBtn>
        <PrimaryBtn onClick={submit} loading={loading}>Save & Continue <ArrowRight size={15} /></PrimaryBtn>
      </div>
    </div>
  );
}

// ── STEP 3 — HOME ADDRESS ──
function Step3Address({ onNext, onBack, initialData }) {
  const EMPTY = { street:'', city:'', state:'', homePhone:'' };
  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!initialData) return;
    setForm({
      street:    initialData.street    ?? '',
      city:      initialData.city      ?? '',
      state:     initialData.state     ?? '',
      zipCode:   initialData.zipCode   ?? '',
      homePhone: initialData.homePhone ?? '',
    });
  }, [initialData]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    if (!form.street || !form.city || !form.state ) {
      setError('Street, city, state are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const home = { ...form };
      if (!home.homePhone) delete home.homePhone;
      const { data } = await saveAddress({ home });
      onNext(data.profileStep);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 step-enter">
      <ErrorBanner message={error} />
      <SectionLabel icon={MapPin} text="Home address" />
      <FloatingInput id="street"  label="Street address" value={form.street}  onChange={set('street')}  />
      <Grid2>
        <FloatingInput id="city"    label="City"     value={form.city}    onChange={set('city')}    required />
        <FloatingInput id="state"   label="State"    value={form.state}   onChange={set('state')}   required />
        {/* <FloatingInput id="zip"     label="ZIP code" value={form.zipCode} onChange={set('zipCode')} required />
        <FloatingInput id="country" label="Country"  value={form.country} onChange={set('country')} required /> */}
      </Grid2>
      {/* <SectionLabel icon={Phone} text="Contact" />
      <FloatingInput id="homePhone" label="Home phone (optional)" value={form.homePhone} onChange={set('homePhone')} placeholder="+1 (800) 555-0199" /> */}
      <div className="flex gap-3 pt-1">
        <GhostBtn onClick={onBack} icon={ArrowLeft}>Back</GhostBtn>
        <PrimaryBtn onClick={submit} loading={loading}>Save & Continue <ArrowRight size={15} /></PrimaryBtn>
      </div>
    </div>
  );
}

// ── STEP 4 — OFFICE INFO (optional) ──
function Step4Office({ onNext, onBack, initialData }) {
  const EMPTY = { officeName:'', street:'', city:'', state:'', zipCode:'', country:'', officePhone:'' };
  const [form, setForm]         = useState(EMPTY);
  const [loading, setLoading]   = useState(false);
  const [skipping, setSkipping] = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    if (!initialData) return;
    setForm({
      officeName:  initialData.officeName  ?? '',
      street:      initialData.street      ?? '',
      city:        initialData.city        ?? '',
      state:       initialData.state       ?? '',
      zipCode:     initialData.zipCode     ?? '',
      country:     initialData.country     ?? '',
      officePhone: initialData.officePhone ?? '',
    });
  }, [initialData]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    if (!form.officeName || !form.street || !form.city || !form.state || !form.zipCode || !form.country) {
      setError('Fill all required office fields, or use the Skip button below.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.officePhone) delete payload.officePhone;
      const { data } = await saveOfficeInfo(payload);
      onNext(data.profileStep);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const skip = async () => {
    setSkipping(true);
    try {
      const { data } = await skipOfficeInfo();
      onNext(data.profileStep);
    } catch {
      onNext(4);
    } finally {
      setSkipping(false);
    }
  };

  return (
    <div className="space-y-5 step-enter">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700">
        <SkipForward size={11} /> Optional — you can skip this step
      </span>
      <ErrorBanner message={error} />
      <SectionLabel icon={Building2} text="Office / practice" />
      <FloatingInput id="offName"   label="Practice / office name" value={form.officeName} onChange={set('officeName')} />
      <FloatingInput id="offStreet" label="Street address"         value={form.street}     onChange={set('street')}     />
      <Grid2>
        <FloatingInput id="offCity"    label="City"     value={form.city}    onChange={set('city')}    />
        <FloatingInput id="offState"   label="State"    value={form.state}   onChange={set('state')}   />
        <FloatingInput id="offZip"     label="ZIP code" value={form.zipCode} onChange={set('zipCode')} />
        <FloatingInput id="offCountry" label="Country"  value={form.country} onChange={set('country')} />
      </Grid2>
      <SectionLabel icon={Phone} text="Office contact" />
      <FloatingInput id="offPhone" label="Office phone (optional)" value={form.officePhone} onChange={set('officePhone')} placeholder="+1 (800) 555-0199" />
      <div className="flex gap-3 pt-1 flex-wrap">
        <GhostBtn onClick={onBack} icon={ArrowLeft}>Back</GhostBtn>
        <button onClick={skip} disabled={skipping}
          className="flex items-center gap-1.5 rounded-xl border-2 border-dashed border-gray-200 px-4 py-3.5 text-sm font-semibold text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-all disabled:opacity-40">
          {skipping ? <Loader2 size={14} className="animate-spin" /> : <SkipForward size={14} />} Skip
        </button>
        <div className="flex-1"><PrimaryBtn onClick={submit} loading={loading}>Save & Continue <ArrowRight size={15} /></PrimaryBtn></div>
      </div>
    </div>
  );
}

const SQUARE_AMOUNTS = {
  STUDENT: 0,
  ANNUAL: 50,
  LIFETIME: 500,
};
function PaymentSuccessModal({ open, onClose, message }) {
    const router = useRouter();
    if (!open) return null;
    const handleGotIt = () => {
    onClose(); // Close the modal
    router.push("/dashboard"); // Navigate to dashboard
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg viewBox="0 0 52 52" className="h-12 w-12">
            <circle
              cx="26" cy="26" r="24" fill="none" stroke="#16a34a" strokeWidth="3"
              style={{ strokeDasharray: 151, strokeDashoffset: 151, animation: 'appna-circle-draw 0.5s ease-out forwards' }}
            />
            <path
              d="M14 27l7 7 17-17" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 36, strokeDashoffset: 36, animation: 'appna-check-draw 0.3s 0.5s ease-out forwards' }}
            />
          </svg>
        </div>
        <h3 className="mt-5 text-lg font-semibold text-green-700">Payment Successful</h3>
        <p className="mt-2 text-sm leading-relaxed text-green-700">{message}</p>
        <button
          type="button"
          onClick={handleGotIt}
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
        >
          Got it
        </button>
      </div>
      <style jsx global>{`
        @keyframes appna-circle-draw { to { stroke-dashoffset: 0; } }
        @keyframes appna-check-draw { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
}

function Step5Membership({ onBack, initialData }) {
  const router = useRouter();
  const [selected, setSelected] = useState(initialData?.type ?? 'ANNUAL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false); // add this

  useEffect(() => {
    if (initialData?.type) setSelected(initialData.type);
  }, [initialData]);

  const selectedPlan = MEMBERSHIP_PLANS.find((plan) => plan.type === selected);
  const selectedAmount = SQUARE_AMOUNTS[selected];

  const startHostedCheckout = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await selectMembership({ type: selected });
      const responseData = res?.data?.data ?? res?.data;

      if (responseData?.isActive === true) {
        router.push('/dashboard');
        return;
      }

      const { data } = await createSquareCheckout();
      window.location.href = data.approveUrl;
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Failed to start Square checkout. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const completeSquareMembershipPayment = useCallback(async ({ sourceId, idempotencyKey }) => {
    setError('');
    setSuccess('');
    const res = await selectMembership({ type: selected });
    const responseData = res?.data?.data ?? res?.data;

    if (responseData?.isActive === true) {
      router.push('/dashboard');
      return null;
    }

    await payMembershipWithSquareToken({ sourceId, idempotencyKey });
    setSuccess('Payment received. APPNA NC will review it and email your login confirmation within 24 hours.');
    setShowSuccessModal(true);
  }, [router, selected]);

  const handlePaymentError = useCallback((err) => {
    setError(err?.response?.data?.message || err?.message || 'Payment could not be completed.');
  }, []);

  return (
    <div className="space-y-4 step-enter">
      <ErrorBanner message={error} />
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-relaxed text-green-700">
          {success}
        </div>
      )}

      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        <p className="font-semibold">Annual memberships expire on December 31.</p>
        <p className="text-xs mt-0.5 text-blue-700 leading-relaxed">
          Paid plans can be completed with debit or credit card, Apple Pay, and Cash App Pay through Square.
        </p>
      </div>

      {MEMBERSHIP_PLANS.map((plan) => (
        <button
          key={plan.type}
          type="button"
          onClick={() => setSelected(plan.type)}
          style={{ borderColor: selected === plan.type ? plan.accent : '#e5e7eb' }}
          className="relative w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 hover:border-gray-300 bg-white"
        >
          {plan.popular && (
            <span
              className="absolute -top-2.5 left-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
              style={{ background: plan.accent }}
            >
              Most Popular
            </span>
          )}

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 pr-7">
              <p className="font-semibold text-gray-900 text-sm mb-0.5">{plan.label}</p>
              <p className="text-xs text-gray-500 mb-2">{plan.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {plan.perks.map((perk) => (
                  <span
                    key={perk}
                    className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 rounded-full px-2 py-0.5"
                  >
                    <Check size={8} strokeWidth={3} className="text-green-500" />
                    {perk}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xl font-bold" style={{ color: plan.accent }}>
                {SQUARE_AMOUNTS[plan.type] === 0 ? 'Free' : `$${SQUARE_AMOUNTS[plan.type]}`}
              </div>
              <div className="text-[10px] text-gray-400">{plan.period}</div>
            </div>
          </div>

          {selected === plan.type && (
            <div
              className="absolute top-3 right-3 h-5 w-5 rounded-full flex items-center justify-center"
              style={{ background: plan.accent }}
            >
              <Check size={10} strokeWidth={3} className="text-white" />
            </div>
          )}
        </button>
      ))}

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700 leading-relaxed">
        After Square confirms a paid membership, APPNA NC will review it and email your login confirmation within 24 hours.
      </div>

      {selectedAmount > 0 ? (
        <SquarePaymentOptions
          amount={selectedAmount}
          description={`${selectedPlan?.label} membership`}
          disabled={loading || !!success}
          onToken={completeSquareMembershipPayment}
          onError={handlePaymentError}
          // fallbackLabel={`Pay $${selectedAmount} with hosted Square checkout`}
          // onFallbackCheckout={startHostedCheckout}
        />
      ) : null}

      <div className="flex gap-3 pt-1">
        <GhostBtn onClick={onBack} icon={ArrowLeft}>Back</GhostBtn>
        {selectedAmount === 0 ? (
          <PrimaryBtn onClick={startHostedCheckout} loading={loading}>
            Activate Free Membership <ArrowRight size={15} />
          </PrimaryBtn>
        ) : null}
      </div>
       <PaymentSuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Payment received. APPNA NC will review it and email your login confirmation within 24 hours."
      />
    </div>
  );
}

// ── MAIN PAGE ──
export default function CompleteProfilePage() {
  const router = useRouter();
  const [step, setStep]                 = useState(1);
  const [completedSteps, setCompleted]  = useState([]);
  const [initializing, setInitializing] = useState(true);
  const [profile, setProfile]           = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getFullProfile();
        if (data.isProfileCompleted) { router.replace('/dashboard'); return; }
        setProfile(data);
        const serverStep = data.profileStep ?? 0;
        setCompleted(Array.from({ length: serverStep }, (_, i) => i + 1));
        setStep(Math.min(serverStep + 1, 5));
      } catch {
        setStep(1);
      } finally {
        setInitializing(false);
      }
    })();
  }, [router]);

  const advance = useCallback((serverStep) => {
    setCompleted((prev) => [...new Set([...prev, serverStep])]);
    if (serverStep >= 5) { router.push('/payment'); return; }
    setStep(serverStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [router]);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (initializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-[#7a1f3d]" />
          <p className="text-sm text-gray-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const header = STEP_HEADERS[step];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .profile-root { font-family: 'Outfit', sans-serif; }
        .display-font { font-family: 'Cormorant Garamond', serif; }
        .step-enter { animation: stepIn 0.38s cubic-bezier(.16,1,.3,1) both; }
        @keyframes stepIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .accent-btn {
          background: linear-gradient(135deg, #7a1f3d 0%, #9b2d51 100%);
          box-shadow: 0 4px 20px rgba(122,31,61,0.3);
          transition: all 0.25s ease;
        }
        .accent-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(122,31,61,0.42); }
        .accent-btn:active:not(:disabled) { transform: translateY(0); }
        .panel-bg { background: linear-gradient(160deg, #4a0e22 0%, #7a1f3d 50%, #9b3855 100%); }
        .noise-overlay::after {
          content:''; position:absolute; inset:0; pointer-events:none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        }
        .right-scroll::-webkit-scrollbar { width:4px; }
        .right-scroll::-webkit-scrollbar-track { background:transparent; }
        .right-scroll::-webkit-scrollbar-thumb { background:#e5e7eb; border-radius:99px; }
      `}</style>

      <section className="profile-root min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row bg-white">
          <LeftPanel key={`panel-${step}`} step={step} completedSteps={completedSteps} />
          <main className="flex-1 flex flex-col" style={{ maxHeight: '92vh' }}>
            <div className="px-8 sm:px-10 pt-8 pb-5 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[#7a1f3d] text-[10px] font-bold tracking-widest uppercase mb-1">Step {step} / {STEPS.length}</p>
                  <h1 className="display-font text-2xl sm:text-3xl font-semibold text-gray-900 leading-tight">{header.label}</h1>
                  <p className="text-gray-400 text-xs mt-0.5">{header.sub}</p>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[10px] text-gray-400 font-medium">{Math.round((completedSteps.length / STEPS.length) * 100)}% complete</span>
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(completedSteps.length / STEPS.length) * 100}%`, background: 'linear-gradient(90deg, #7a1f3d, #9b2d51)' }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="right-scroll flex-1 overflow-y-auto px-8 sm:px-10 py-7">
              {step === 1 && <Step1Basic       key="s1" onNext={advance}            initialData={profile?.basicInfo}         />}
              {step === 2 && <Step2Medical     key="s2" onNext={advance} onBack={goBack} initialData={profile?.medicalEducation}  />}
              {step === 3 && <Step3Address     key="s3" onNext={advance} onBack={goBack} initialData={profile?.address}           />}
              {step === 4 && <Step4Office      key="s4" onNext={advance} onBack={goBack} initialData={profile?.officeInformation}  />}
              {step === 5 && <Step5Membership  key="s5" onNext={advance} onBack={goBack} initialData={profile?.membership}        />}
            </div>
          </main>
        </div>
      </section>
    </>
  );
}
