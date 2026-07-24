'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Loader2, AlertCircle, Building2, User, Download } from 'lucide-react';
import { paySponsorship } from '../../lib/sponsorship';
import dynamic from 'next/dynamic';

const SquarePaymentOptions = dynamic(
  () => import('../../components/payments/SquarePaymentOptions'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
        <Loader2 size={16} className="animate-spin" />
        Loading payment options...
      </div>
    ),
  }
);

const TIERS = [
  {
    type: 'PLATINUM', label: 'Platinum', price: 10000, accent: '#1a3a5c',
    perks: ['10-minute stage presentation', 'Advertisement on event screen', 'Dedicated booth space', 'Featured in event brochure', 'Included in promotional emails', '3 complimentary event tickets'],
  },
  {
    type: 'GOLD', label: 'Gold', price: 5000, accent: '#7a1f3d', popular: true,
    perks: ['5-minute stage time', 'Advertisement on event screen', 'Dedicated booth space', 'Featured in event brochure', 'Included in promotional emails', '2 complimentary event tickets'],
  },
  {
    type: 'SILVER', label: 'Silver', price: 3000, accent: '#4a7c59',
    perks: ['Advertisement on event screen', 'Booth presence', 'Mention in event brochure', 'Included in promotional emails', '1 complimentary event ticket'],
  },
  {
    type: 'BRONZE', label: 'Bronze', price: 1000, accent: '#8a6d3b',
    perks: ['Booth presence', '1 complimentary event ticket'],
  },
];

function FloatingInput({ id, label, type = 'text', value, onChange, required }) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || !!value;
  return (
    <div className="relative">
      <input id={id} type={type} value={value ?? ''} required={required}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onChange={onChange}
        style={{ paddingTop: lifted ? '1.4rem' : '0.95rem', paddingBottom: lifted ? '0.4rem' : '0.95rem' }}
        className={`w-full rounded-xl border bg-white px-4 text-sm text-gray-900 outline-none transition-all duration-200 ${focused ? 'border-[#7a1f3d] shadow-[0_0_0_3px_rgba(122,31,61,0.1)]' : 'border-gray-200 hover:border-gray-300'}`}
      />
      <label htmlFor={id}
        style={{ top: lifted ? '0.42rem' : '50%', transform: lifted ? 'translateY(0) scale(0.75)' : 'translateY(-50%) scale(1)', color: focused ? '#7a1f3d' : '#9ca3af', transformOrigin: 'left center' }}
        className="pointer-events-none absolute left-4 text-sm font-medium transition-all duration-200">
        {label}{required && <span className="text-[#7a1f3d] ml-0.5">*</span>}
      </label>
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

function SuccessModal({ open, receiptDataUrl, message }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <Check size={32} className="text-green-600" strokeWidth={3} />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-green-700">Payment received</h3>
        <p className="mt-2 text-sm leading-relaxed text-green-700">{message}</p>
        {receiptDataUrl && (
          <a href={receiptDataUrl} download="appna-nc-sponsorship-receipt.png"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-green-300 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50">
            <Download size={14} /> Download receipt
          </a>
        )}
        <Link href="/" className="mt-6 block w-full rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700">
          Back to home
        </Link>
      </div>
    </div>
  );
}

function SponsorPageInner() {
  const params = useSearchParams();
  const preselect = (params.get('tier') || 'GOLD').toUpperCase();

  const [selected, setSelected] = useState(TIERS.some(t => t.type === preselect) ? preselect : 'GOLD');
  const [form, setForm] = useState({ businessName: '', businessType: '', contactName: '', contactEmail: '', contactPhone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // { message, receiptDataUrl }

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const plan = TIERS.find((t) => t.type === selected);

  const handlePayment = async ({ sourceId, idempotencyKey }) => {
    if (!form.businessName || !form.businessType || !form.contactName || !form.contactEmail || !form.contactPhone) {
      setError('Please fill in all business and contact fields before paying.');
      throw new Error('validation');
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await paySponsorship({ ...form, tier: selected, sourceId, idempotencyKey });
      setSuccess({ message: data.message, receiptDataUrl: data.data?.receiptDataUrl });
    } catch (err) {
      setError(err?.response?.data?.message || 'Payment failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
        .spn-root { font-family: 'Outfit', sans-serif; }
        .display-font { font-family: 'Cormorant Garamond', serif; }
        .accent-btn { background: linear-gradient(135deg, #7a1f3d 0%, #9b2d51 100%); box-shadow: 0 4px 20px rgba(122,31,61,0.35); }
      `}</style>

      <section className="spn-root min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-[#7a1f3d] text-sm mb-6">
            <ArrowLeft size={15} /> Back to home
          </Link>

          <h1 className="display-font text-3xl sm:text-4xl font-semibold text-gray-900 mb-1">Become a Sponsor</h1>
          <p className="text-gray-500 text-sm mb-8">Choose a tier, tell us about your business, and complete payment securely through Square.</p>

          <ErrorBanner message={error} />

          {/* Tier selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 mb-8">
            {TIERS.map((t) => (
              <button key={t.type} type="button" onClick={() => setSelected(t.type)}
                style={{ borderColor: selected === t.type ? t.accent : '#e5e7eb' }}
                className="relative text-left rounded-2xl border-2 bg-white p-5 transition-all hover:border-gray-300">
                {t.popular && (
                  <span className="absolute -top-2.5 left-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ background: t.accent }}>Popular Choice</span>
                )}
                <div className="flex items-start justify-between">
                  <p className="font-semibold text-gray-900">{t.label}</p>
                  <p className="text-xl font-bold" style={{ color: t.accent }}>${t.price.toLocaleString()}</p>
                </div>
                <ul className="mt-2 space-y-1">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-1.5 text-xs text-gray-500">
                      <Check size={11} className="mt-0.5 text-green-500 flex-shrink-0" strokeWidth={3} />{p}
                    </li>
                  ))}
                </ul>
                {selected === t.type && (
                  <div className="absolute top-4 right-4 h-5 w-5 rounded-full flex items-center justify-center" style={{ background: t.accent }}>
                    <Check size={10} strokeWidth={3} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Business + contact form */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={13} className="text-[#7a1f3d]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#7a1f3d]">Business details</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FloatingInput id="businessName" label="Business name" value={form.businessName} onChange={set('businessName')} required />
              <FloatingInput id="businessType" label="Business type" value={form.businessType} onChange={set('businessType')} required />
            </div>

            <div className="flex items-center gap-2 mb-1 mt-2">
              <User size={13} className="text-[#7a1f3d]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#7a1f3d]">Contact information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FloatingInput id="contactName" label="Contact name" value={form.contactName} onChange={set('contactName')} required />
              <FloatingInput id="contactEmail" label="Contact email" type="email" value={form.contactEmail} onChange={set('contactEmail')} required />
            </div>
            <FloatingInput id="contactPhone" label="Contact phone" value={form.contactPhone} onChange={set('contactPhone')} required />

            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
              You'll receive a payment confirmation and transaction receipt by email immediately. APPNA NC will confirm your sponsorship within 24–48 hours.
            </div>

            <SquarePaymentOptions
              amount={plan.price}
              description={`${plan.label} Sponsorship — ${form.businessName || 'APPNA NC'}`}
              disabled={loading}
              onToken={handlePayment}
              onError={(err) => setError(err?.response?.data?.message || err?.message || 'Payment could not be completed.')}
            />
          </div>
        </div>
      </section>

      <SuccessModal
        open={!!success}
        receiptDataUrl={success?.receiptDataUrl}
        message={success?.message}
      />
    </>
  );
}

export default function SponsorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#7a1f3d]" />
      </div>
    }>
      <SponsorPageInner />
    </Suspense>
  );
}