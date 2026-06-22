'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { CalendarDays, CreditCard, Loader2, MapPin, Ticket } from 'lucide-react';
import { getEvent, registerForEvent } from '../../../../lib/events';

const BASE_FIELDS = [
  { key: 'fullName', label: 'Full Name', type: 'TEXT', required: true },
  { key: 'email', label: 'Email Address', type: 'EMAIL', required: true },
  { key: 'phone', label: 'Phone Number', type: 'PHONE', required: true },
  { key: 'cnic', label: 'CNIC / ID Number', type: 'TEXT' },
  { key: 'city', label: 'City', type: 'TEXT' },
  { key: 'organization', label: 'Organization', type: 'TEXT' },
  { key: 'designation', label: 'Designation', type: 'TEXT' },
];

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
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

  return <input className={common} type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} required={field.required} />;
}

export default function EventDetailPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

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

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const payload = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        cnic: values.cnic,
        city: values.city,
        organization: values.organization,
        designation: values.designation,
        answers: customFields.reduce((acc, field) => ({ ...acc, [field.key]: values[field.key] }), {}),
      };
      const { data } = await registerForEvent(event.id, payload);
      if (data.approveUrl) {
        window.location.assign(data.approveUrl);
        return;
      }
      if (event.ticketPrice > 0) {
        setMessage('Unable to start PayPal checkout. Please try again or contact support.');
        return;
      }
      setMessage('Registration received. APPNA NC will review your request and email your ticket after approval.');
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Registration could not be submitted.');
    } finally {
      setSubmitting(false);
    }
  };

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
        <form onSubmit={submit} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-xl font-semibold text-gray-950">Registration</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[...BASE_FIELDS, ...customFields].map((field) => (
              <label key={field.key} className={field.type === 'TEXTAREA' ? 'sm:col-span-2' : ''}>
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">{field.label}{field.required ? ' *' : ''}</span>
                <Field field={field} value={values[field.key]} onChange={(value) => setValues((current) => ({ ...current, [field.key]: value }))} />
              </label>
            ))}
          </div>
          {message && <div className="mt-5 rounded-lg border border-[#7a1f3d]/20 bg-[#7a1f3d]/5 p-3 text-sm text-[#7a1f3d]">{message}</div>}
          <button disabled={submitting} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#7a1f3d] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
            {event.ticketPrice > 0 ? `Pay $${event.ticketPrice} with PayPal` : 'Submit Registration'}
          </button>
        </form>

        <aside className="h-fit rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Ticket Price</p>
          <p className="mt-2 text-4xl font-semibold text-gray-950">${event.ticketPrice}</p>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">After payment, your request goes to APPNA NC for verification. Approved tickets are emailed and available in the member dashboard.</p>
        </aside>
      </section>
    </main>
  );
}
