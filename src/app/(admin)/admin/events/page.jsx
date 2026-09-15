'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock, DollarSign, Loader2, Plus, RefreshCw, Search, Send, Ticket, XCircle } from 'lucide-react';
import {
  approveTicketRequest,
  createAdminEvent,
  createCashTicket,
  getAdminEvents,
  getAdminEvent,
  getEventAnalytics,
  getTicketRequests,
  rejectTicketRequest,
  setAdminEventStatus,
} from '../../../../lib/events';

const emptyEvent = {
  title: '',
  description: '',
  category: 'Community',
  bannerImage: '',
  date: '',
  startTime: '',
  endTime: '',
  venue: '',
  googleMapsUrl: '',
  capacity: 100,
  ticketPrice: 0,
  status: 'DRAFT',
  registrationFields: [
    { key: 'city', label: 'City', type: 'TEXT', required: false, position: 0 },
    { key: 'organization', label: 'Organization', type: 'TEXT', required: false, position: 1 },
    { key: 'designation', label: 'Designation', type: 'TEXT', required: false, position: 2 },
  ],
};

const emptyCashTicket = {
  fullName: '',
  email: '',
  phone: '',
  cnic: '',
  city: '',
  organization: '',
  designation: '',
  ticketQuantity: 1,
  answers: {},
};

function Input({ label, value, onChange, type = 'text', textarea = false, required = false }) {
  return (
    <label>
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">{label}</span>
      {textarea ? (
        <textarea required={required} value={value} onChange={(e) => onChange(e.target.value)} rows={4} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1a2744]" />
      ) : (
        <input required={required} type={type} value={value} onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1a2744]" />
      )}
    </label>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <Icon className="mb-3 text-[#1a2744]" size={20} />
      <p className="text-2xl font-semibold text-gray-950">{value ?? '-'}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
    </div>
  );
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [requestFilter, setRequestFilter] = useState('ALL');
  const [requestSearch, setRequestSearch] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [form, setForm] = useState(emptyEvent);
  const [cashTicket, setCashTicket] = useState(emptyCashTicket);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cashSaving, setCashSaving] = useState(false);
  const [toast, setToast] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [eventsRes, requestsRes, analyticsRes] = await Promise.all([
        getAdminEvents(),
        getTicketRequests(),
        getEventAnalytics(),
      ]);
      setEvents(eventsRes.data);
      setRequests(requestsRes.data);
      setAnalytics(analyticsRes.data);
      setSelectedEventId((current) => current || eventsRes.data.find((event) => event.title === 'APPNA NC Annual Banquet, Entertainment & CME 2026')?.id || '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!selectedEventId) {
      setSelectedEvent(null);
      return;
    }
    const timeout = setTimeout(async () => {
      const { data } = await getAdminEvent(selectedEventId, {
        status: requestFilter === 'PENDING' ? 'AWAITING_ADMIN_CONFIRMATION' : requestFilter,
        search: requestSearch,
      });
      setSelectedEvent(data);
    }, 250);
    return () => clearTimeout(timeout);
  }, [selectedEventId, requestFilter, requestSearch]);

  const show = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const create = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createAdminEvent(form);
      setForm(emptyEvent);
      await load();
      show('Event created.');
    } catch (err) {
      show(err?.response?.data?.message || 'Could not create event.');
    } finally {
      setSaving(false);
    }
  };

  const review = async (id, action) => {
    try {
      if (action === 'approve') await approveTicketRequest(id);
      else await rejectTicketRequest(id);
      await load();
      show(action === 'approve' ? 'Ticket approved and emailed.' : 'Request rejected.');
    } catch (err) {
      show(err?.response?.data?.message || 'Review action failed.');
    }
  };

  const issueCashTicket = async (e) => {
    e.preventDefault();
    if (!selectedEventId) {
      show('Select an event before creating a cash ticket.');
      return;
    }
    setCashSaving(true);
    try {
      await createCashTicket(selectedEventId, cashTicket);
      setCashTicket(emptyCashTicket);
      await load();
      show('Cash ticket approved, generated, and emailed.');
    } catch (err) {
      show(err?.response?.data?.message || 'Could not generate the cash ticket.');
    } finally {
      setCashSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f0f2f7] px-4 py-6 sm:px-8">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#1a2744]">Admin Panel</p>
            <h1 className="text-3xl font-semibold text-gray-950">Event Ticketing</h1>
          </div>
          <button onClick={load} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
            <RefreshCw size={15} /> Refresh
          </button>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Stat icon={CalendarDays} label="Events" value={analytics?.totalEvents} />
          <Stat icon={Clock} label="Registrations" value={analytics?.totalRegistrations} />
          <Stat icon={Ticket} label="Approved Tickets" value={analytics?.totalApprovedTickets} />
          <Stat icon={DollarSign} label="Revenue" value={`$${analytics?.totalRevenue ?? 0}`} />
          <Stat icon={CheckCircle2} label="Attendance" value={`${analytics?.attendance?.attendanceRate ?? 0}%`} />
        </div>

        <form onSubmit={issueCashTicket} className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-950"><Ticket size={18} /> Create Cash Ticket</h2>
              <p className="mt-1 text-xs text-gray-600">Records a cash payment and immediately creates an approved, QR-scannable ticket.</p>
            </div>
            {selectedEvent && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Approved on creation</span>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label>
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Event</span>
              <select required value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
                <option value="">Select event</option>
                {events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
              </select>
            </label>
            <Input required label="Full Name" value={cashTicket.fullName} onChange={(value) => setCashTicket({ ...cashTicket, fullName: value })} />
            <Input required label="Email" type="email" value={cashTicket.email} onChange={(value) => setCashTicket({ ...cashTicket, email: value })} />
            <Input required label="Phone" type="tel" value={cashTicket.phone} onChange={(value) => setCashTicket({ ...cashTicket, phone: value })} />
            <Input label="Quantity" type="number" value={cashTicket.ticketQuantity} onChange={(value) => setCashTicket({ ...cashTicket, ticketQuantity: Math.max(1, value) })} />
            <Input label="City" value={cashTicket.city} onChange={(value) => setCashTicket({ ...cashTicket, city: value })} />
            <Input label="Organization" value={cashTicket.organization} onChange={(value) => setCashTicket({ ...cashTicket, organization: value })} />
            <Input label="Designation" value={cashTicket.designation} onChange={(value) => setCashTicket({ ...cashTicket, designation: value })} />
            {(selectedEvent?.registrationFields ?? []).filter((field) => !['fullName', 'email', 'phone', 'city', 'organization', 'designation'].includes(field.key)).map((field) => (
              <Input
                key={field.id ?? field.key}
                required={field.required}
                label={field.required ? `${field.label} *` : field.label}
                type={field.type === 'EMAIL' ? 'email' : field.type === 'NUMBER' ? 'number' : field.type === 'DATE' ? 'date' : 'text'}
                value={cashTicket.answers[field.key] ?? ''}
                onChange={(value) => setCashTicket({ ...cashTicket, answers: { ...cashTicket.answers, [field.key]: value } })}
              />
            ))}
          </div>
          <button disabled={cashSaving || !selectedEventId} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
            {cashSaving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />} Generate Approved Cash Ticket
          </button>
        </form>

        <div className="grid gap-6 lg:grid-cols-[.42fr_.58fr]">
          <form onSubmit={create} className="h-fit rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-950"><Plus size={18} /> Create Event</h2>
            <div className="grid gap-4">
              <Input label="Title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
              <Input label="Description" textarea value={form.description} onChange={(value) => setForm({ ...form, description: value })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Category" value={form.category} onChange={(value) => setForm({ ...form, category: value })} />
                <Input label="Banner URL" value={form.bannerImage} onChange={(value) => setForm({ ...form, bannerImage: value })} />
                <Input label="Date" type="date" value={form.date} onChange={(value) => setForm({ ...form, date: value })} />
                <Input label="Start Time" type="time" value={form.startTime} onChange={(value) => setForm({ ...form, startTime: value })} />
                <Input label="End Time" type="time" value={form.endTime} onChange={(value) => setForm({ ...form, endTime: value })} />
                <Input label="Capacity" type="number" value={form.capacity} onChange={(value) => setForm({ ...form, capacity: value })} />
                <Input label="Ticket Price" type="number" value={form.ticketPrice} onChange={(value) => setForm({ ...form, ticketPrice: value })} />
                <label>
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Status</span>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                    <option>DRAFT</option><option>PUBLISHED</option><option>COMPLETED</option><option>CANCELLED</option>
                  </select>
                </label>
              </div>
              <Input label="Venue" value={form.venue} onChange={(value) => setForm({ ...form, venue: value })} />
              <Input label="Google Maps URL" value={form.googleMapsUrl} onChange={(value) => setForm({ ...form, googleMapsUrl: value })} />
            </div>
            <button disabled={saving} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#1a2744] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} Save Event
            </button>
          </form>

          <div className="space-y-6">
            <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-950">Events</h2>
              {loading ? <Loader2 className="animate-spin text-[#1a2744]" /> : (
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4 ${selectedEventId === event.id ? 'border-[#1a2744] bg-slate-50' : 'border-gray-100'}`}>
                      <button type="button" onClick={() => setSelectedEventId(event.id)} className="text-left">
                        <p className="font-semibold text-gray-950">{event.title}</p>
                        <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()} | {event.registrationCount ?? 0} registrations | {event.pendingCount ?? 0} pending | {event.approvedCount ?? 0} approved | {event.rejectedCount ?? 0} rejected</p>
                      </button>
                      <select value={event.status} onChange={(e) => setAdminEventStatus(event.id, e.target.value).then(load)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold">
                        <option>DRAFT</option><option>PUBLISHED</option><option>COMPLETED</option><option>CANCELLED</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-950">{selectedEvent ? selectedEvent.title : 'All Ticket Requests'}</h2>
                  <p className="text-xs text-gray-500">{selectedEvent ? 'Showing registrations for the selected event only.' : 'Select an event above for event-level registration management.'}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['ALL', 'PENDING', 'CONFIRMED', 'REJECTED'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setRequestFilter(status)}
                      className={`rounded-lg px-3 py-2 text-xs font-semibold ${requestFilter === status ? 'bg-[#1a2744] text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {status === 'CONFIRMED' ? 'Approved' : status.charAt(0) + status.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
              <label className="mb-4 flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
                <Search size={15} className="text-gray-400" />
                <input value={requestSearch} onChange={(e) => setRequestSearch(e.target.value)} placeholder="Search by name, email, or ticket number" className="w-full text-sm outline-none" />
              </label>
              <div className="space-y-3">
                {(selectedEventId ? requests.filter((request) => request.eventId === selectedEventId) : requests).filter((request) => {
                  if (requestFilter !== 'ALL') {
                    const normalized = requestFilter === 'PENDING' ? 'AWAITING_ADMIN_CONFIRMATION' : requestFilter;
                    if (request.approvalStatus !== normalized) return false;
                  }
                  if (!requestSearch) return true;
                  const q = requestSearch.toLowerCase();
                  return [
                    request.fullName,
                    request.email,
                    ...(request.tickets ?? []).map((ticket) => ticket.ticketNumber),
                  ].filter(Boolean).some((value) => String(value).toLowerCase().includes(q));
                }).map((request) => (
                  <div key={request.id} className="rounded-lg border border-gray-100 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-950">{request.fullName}</p>
                        <p className="text-sm text-gray-500">{request.event.title}</p>
                        <p className="text-xs text-gray-400">{request.email} | {request.ticketQuantity ?? 1} {(request.ticketQuantity ?? 1) === 1 ? 'ticket' : 'tickets'} | ${request.paymentAmount} | {request.paymentProvider ?? 'N/A'} · {request.paymentStatus} | {request.approvalStatus}</p>
                        {(request.tickets?.length ?? 0) > 0 && (
                          <p className="mt-1 text-xs text-gray-400">
                            Tickets: {request.tickets.map((ticket) => ticket.ticketNumber).join(', ')}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-400">Membership: {request.user?.membership?.isActive ? `Active ${request.user.membership.type}` : request.user?.membership ? `Inactive ${request.user.membership.paymentStatus}` : 'No membership record'} | Registered {new Date(request.createdAt).toLocaleDateString()}</p>
                      </div>
                      {['AWAITING_ADMIN_CONFIRMATION', 'PAYMENT_COMPLETED'].includes(request.approvalStatus) && (
                        <div className="flex gap-2">
                          <button onClick={() => review(request.id, 'approve')} className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white"><CheckCircle2 size={13} /> Approve</button>
                          <button onClick={() => review(request.id, 'reject')} className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"><XCircle size={13} /> Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
      {toast && <div className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-lg bg-gray-950 px-5 py-3 text-sm font-semibold text-white shadow-lg">{toast}</div>}
    </main>
  );
}
