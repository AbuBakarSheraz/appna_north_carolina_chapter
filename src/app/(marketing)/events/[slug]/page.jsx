'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { CalendarDays, CreditCard, Loader2, MapPin, Minus, Plus, Ticket } from 'lucide-react';
import { getEvent, payEventWithSquareToken, registerForEvent } from '../../../../lib/events';
import SquarePaymentOptions from '../../../../components/payments/SquarePaymentOptions';

const US_PREFIX = '+1 ';
const BASE_FIELDS = [
  { key: 'fullName', label: 'Full Name', type: 'TEXT', required: true },
  { key: 'email', label: 'Email Address', type: 'EMAIL', required: true },
  { key: 'phone', label: 'Phone Number', type: 'PHONE', required: true },
  { key: 'cnic', label: 'Speciality', type: 'TEXT' },
  { key: 'city', label: 'Address', type: 'TEXT' },
  { key: 'organization', label: 'Medical School', type: 'TEXT' },
  { key: 'designation', label: 'Office Address', type: 'TEXT' },
];

function extractUSDigits(raw)
{
  const afterPrefix = raw.startsWith(US_PREFIX) ? raw.slice(US_PREFIX.length) : raw;
  let digits = afterPrefix.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
  return digits.slice(0, 10);
}

function formatUSPhoneDisplay(digits) {
  let out = US_PREFIX;
  if (digits.length > 0) out += `(${digits.slice(0, 3)}`;
  if (digits.length >= 3) out += ')';
  if (digits.length > 3) out += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) out += `-${digits.slice(6, 10)}`;
  return out;
}

// True only when exactly 10 digits have been entered — use this for
// validation before allowing submit/payment.
function isCompleteUSPhone(value) {
  return extractUSDigits(value || '').length === 10;
}


function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function Field({ field, value, onChange }) {
  const type = field.type === 'EMAIL' ? 'email' : field.type === 'PHONE' ? 'tel' : field.type === 'NUMBER' ? 'number' : field.type === 'DATE' ? 'date' : 'text';
  const common = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#7a1f3d]';

  if (field.type === 'TEXTAREA') {
    return <textarea className={common} rows={4} value={value ?? ''} onChange={(e) => onChange(e.target.value)} required={field.required} />;
  }

  if (field.type === 'SELECT') {
    const options = Array.isArray(field.options) ? field.options : [];
    return (
      <select className={common} value={value ?? ''} onChange={(e) => onChange(e.target.value)} required={field.required}>
        <option value="">Select</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    );
  }

  if (field.type === 'CHECKBOX') {
    return (
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        Yes
      </label>
    );
  }
if (field.type === 'PHONE') {
  const digits = extractUSDigits(value || '');
  return (
    <input
      className={common}
      type="tel"
      inputMode="numeric"
      placeholder="+1 (202) 555-0123"
      value={formatUSPhoneDisplay(digits)}
      onChange={(e) => onChange(formatUSPhoneDisplay(extractUSDigits(e.target.value)))}
      onKeyDown={(e) => {
        // Block backspace/delete from eating into the "+1 " prefix
        const el = e.target;
        if ((e.key === 'Backspace' || e.key === 'Delete') && el.selectionStart <= US_PREFIX.length && el.selectionEnd <= US_PREFIX.length) {
          e.preventDefault();
        }
      }}
      required={field.required}
    />
  );
}

  return <input className={common} type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} required={field.required} />;
}
function PaymentSuccessModal({ open, onClose, message }) {
  if (!open) return null;

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
          onClick={onClose}
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

export default function EventDetailPage() {
  const { slug } = useParams();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const formRef = useRef(null);
  const [event, setEvent] = useState(null);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [checkoutContext, setCheckoutContext] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getEvent(slug);
        setEvent(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const customFields = useMemo(() => {
    const baseKeys = new Set(BASE_FIELDS.map((field) => field.key));
    return (event?.registrationFields ?? []).filter((field) => !baseKeys.has(field.key));
  }, [event]);

  const registrationPayload = useCallback(() => ({
    fullName: values.fullName,
    email: values.email,
    phone: values.phone,
    cnic: values.cnic,
    city: values.city,
    organization: values.organization,
    designation: values.designation,
    answers: customFields.reduce((acc, field) => ({ ...acc, [field.key]: values[field.key] }), {}),
    ticketQuantity,
  }), [customFields, ticketQuantity, values]);

  const ticketTotal = useMemo(
    () => Number(event?.ticketPrice || 0) * ticketQuantity,
    [event?.ticketPrice, ticketQuantity],
  );

  const submitRegistration = useCallback(async ({ redirectToHostedCheckout = false } = {}) => {
    if (!formRef.current?.reportValidity()) {
      throw new Error('Please complete the required registration fields.');
    }

    setSubmitting(true);
    setMessage('');

    try {
      if (checkoutContext && !redirectToHostedCheckout) {
        return checkoutContext;
      }
      if (checkoutContext?.approveUrl && redirectToHostedCheckout) {
        window.location.assign(checkoutContext.approveUrl);
        return;
      }

      const { data } = await registerForEvent(event.id, registrationPayload());

      if (redirectToHostedCheckout && data.approveUrl) {
        window.location.assign(data.approveUrl);
        return;
      }

      if (data.orderId) {
        const context = { orderId: data.orderId, requestId: data.requestId, approveUrl: data.approveUrl };
        setCheckoutContext(context);
        return context;
      }

      if (event.ticketPrice > 0) {
        setMessage('Unable to start Square checkout. Please try again or contact support.');
        return;
      }

      setMessage('Registration received. APPNA NC will review your request and email your ticket after approval.');
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Registration could not be submitted.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [checkoutContext, event, registrationPayload]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await submitRegistration({ redirectToHostedCheckout: true });
    } catch {}
  };

  const completeSquareTicketPayment = useCallback(async ({ sourceId, idempotencyKey }) => {
    const context = await submitRegistration();
    await payEventWithSquareToken({
      requestId: context?.requestId,
      sourceId,
      idempotencyKey,
    });
    setPaymentComplete(true);
    setShowSuccessModal(true);
    // setMessage('Payment received. APPNA NC will review your registration and email your ticket after approval.');
  }, [submitRegistration]);

  const handlePaymentError = useCallback((err) => {
    setMessage(err?.response?.data?.message || err?.message || 'Payment could not be completed.');
  }, []);

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-[#7a1f3d]" /></main>;
  }

  if (!event) {
    return <main className="min-h-screen bg-gray-50 p-8 text-center text-gray-500">Event not found.</main>;
  }

  return (
    <main className="min-h-screen bg-[#f8f9fb]">
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#7a1f3d]">{event.category}</p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-950 sm:text-5xl">{event.title}</h1>
            <p className="mt-4 max-w-2xl text-gray-600">{event.description}</p>
            <div className="mt-6 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
              <p className="flex items-center gap-2"><CalendarDays size={16} className="text-[#7a1f3d]" />{formatDate(event.date)} | {event.startTime} - {event.endTime}</p>
              <p className="flex items-center gap-2"><MapPin size={16} className="text-[#7a1f3d]" />{event.venue}</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
            {event.bannerImage ? <img src={event.bannerImage} alt={event.title} className="h-full min-h-72 w-full object-cover" /> : <div className="flex min-h-72 items-center justify-center text-[#7a1f3d]"><Ticket size={60} /></div>}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-8 lg:grid-cols-[.65fr_.35fr]">
        <form ref={formRef} onSubmit={submit} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-xl font-semibold text-gray-950">Registration</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[...BASE_FIELDS, ...customFields].map((field) => (
              <label key={field.key} className={field.type === 'TEXTAREA' ? 'sm:col-span-2' : ''}>
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">{field.label}{field.required ? ' *' : ''}</span>
                <Field
                  field={field}
                  value={values[field.key]}
                  onChange={(value) => {
                    setCheckoutContext(null);
                    setValues((current) => ({ ...current, [field.key]: value }));
                  }}
                />
              </label>
            ))}
            <div className="sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Tickets</span>
              <div className="flex w-full max-w-xs items-center justify-between rounded-lg border border-gray-200 bg-white p-2">
                <button
                  type="button"
                  onClick={() => {
                    setCheckoutContext(null);
                    setTicketQuantity((current) => Math.max(1, current - 1));
                  }}
                  disabled={ticketQuantity <= 1 || submitting || paymentComplete}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-700 disabled:opacity-40"
                  aria-label="Decrease ticket quantity"
                >
                  <Minus size={16} />
                </button>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-950">{ticketQuantity}</p>
                  <p className="text-xs text-gray-500">{ticketQuantity === 1 ? 'ticket' : 'tickets'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCheckoutContext(null);
                    setTicketQuantity((current) => Math.min(event.capacity || 99, current + 1));
                  }}
                  disabled={submitting || paymentComplete || ticketQuantity >= (event.capacity || 99)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-700 disabled:opacity-40"
                  aria-label="Increase ticket quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">${event.ticketPrice} each · ${ticketTotal} total</p>
            </div>
          </div>
          {message && !paymentComplete && (
            <div className="mt-5 rounded-lg border border-[#7a1f3d]/20 bg-[#7a1f3d]/5 p-3 text-sm text-[#7a1f3d]">{message}</div>
          )}          {event.ticketPrice > 0 ? (
            <div className="mt-6">
              <SquarePaymentOptions
                amount={ticketTotal}
                description={`${event.title} · ${ticketQuantity} ${ticketQuantity === 1 ? 'ticket' : 'tickets'}`}
                disabled={submitting || paymentComplete}
                buyer={values}
                onToken={completeSquareTicketPayment}
                onError={handlePaymentError}
                // fallbackLabel={`Pay $${ticketTotal} with hosted Square checkout`}
                // onFallbackCheckout={() => submitRegistration({ redirectToHostedCheckout: true }).catch(() => {})}
              />
            </div>
          ) : (
            <button disabled={submitting} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#7a1f3d] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
              Submit Registration
            </button>
          )}
        </form>

        <aside className="h-fit rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Ticket Price</p>
          <p className="mt-2 text-4xl font-semibold text-gray-950">${event.ticketPrice}</p>
          <p className="mt-2 text-sm font-semibold text-gray-700">{ticketQuantity} {ticketQuantity === 1 ? 'ticket' : 'tickets'} · ${ticketTotal} total</p>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">After payment, your request goes to APPNA NC for verification. Approved tickets are emailed and available in the member dashboard.</p>
          {event.ticketPrice > 0 && (
            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              Eligible buyers can pay with debit or credit card, Apple Pay, or Cash App Pay through Square.
            </p>
          )}
        </aside>
      </section>
       <PaymentSuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Payment received. APPNA NC will review your registration and email your ticket after approval."
      />
    </main>
  );
}
