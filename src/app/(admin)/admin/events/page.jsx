'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight, Ban, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight,
  ClipboardList, DollarSign, Download, FileText, Loader2, MapPin, Plus, RefreshCw, ScanLine,
  Search, Send, Settings2, Ticket, Trash2, Users, XCircle,
} from 'lucide-react';
import {
  approveTicketRequest, cancelTicketRequest, createAdminEvent, createCashTicket,
  deleteTicketRequest, getAdminEvent, getAdminEvents, getEventAnalytics,
  getAdminTicketsByEmail, getTicketRequests, rejectTicketRequest, setAdminEventStatus,
} from '../../../../lib/events';

const emptyEvent = {
  title: '', description: '', category: 'Community', bannerImage: '', date: '',
  startTime: '', endTime: '', venue: '', googleMapsUrl: '', capacity: 100,
  ticketPrice: 0, status: 'DRAFT',
  registrationFields: [
    { key: 'city', label: 'City', type: 'TEXT', required: false, position: 0 },
    { key: 'organization', label: 'Organization', type: 'TEXT', required: false, position: 1 },
    { key: 'designation', label: 'Designation', type: 'TEXT', required: false, position: 2 },
  ],
};

const emptyCashTicket = {
  fullName: '', email: '', phone: '', cnic: '', city: '', organization: '',
  designation: '', ticketQuantity: 1, answers: {},
};

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#1a2744] focus:ring-4 focus:ring-[#1a2744]/10';
const statusColors = {
  DRAFT: 'border-slate-200 bg-slate-100 text-slate-600',
  PUBLISHED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  COMPLETED: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  CANCELLED: 'border-rose-200 bg-rose-50 text-rose-700',
  AWAITING_ADMIN_CONFIRMATION: 'border-amber-200 bg-amber-50 text-amber-800',
  PAYMENT_COMPLETED: 'border-sky-200 bg-sky-50 text-sky-700',
  CONFIRMED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  REJECTED: 'border-rose-200 bg-rose-50 text-rose-700',
};

const formatDate = (date, compact = false) => date ? new Date(date).toLocaleDateString('en-US', compact ? { month: 'short', day: 'numeric' } : { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date to be confirmed';
const readableStatus = (status) => String(status || 'Unknown').replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const exportDateTime = (date) => date ? new Date(date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
const csvCell = (value) => {
  const text = value === null || value === undefined ? '' : String(value);
  // Prevent spreadsheet applications from treating attendee data as a formula.
  const safeText = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
};
const ticketTypeFor = (request) => {
  const answers = request.answers;
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) return 'Standard';
  const match = Object.entries(answers).find(([key]) => key.toLowerCase().replaceAll(/[_\s-]/g, '') === 'tickettype');
  const value = match?.[1];
  return value === null || value === undefined || value === '' ? 'Standard' : Array.isArray(value) ? value.join(', ') : String(value);
};
const downloadCsv = (filename, headers, rows) => {
  const csv = `\uFEFF${[headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
const pdfText = (value) => String(value ?? '').normalize('NFKD').replaceAll(/[^\x20-\x7E]/g, '?').replaceAll(/([\\()])/g, '\\$1');
const downloadPdf = (filename, title, subtitle, headers, rows) => {
  const pageWidth = 792;
  const pageHeight = 612;
  const margin = 24;
  const columnWidth = (pageWidth - margin * 2) / headers.length;
  const rowChunks = Array.from({ length: Math.ceil(rows.length / 34) }, (_, index) => rows.slice(index * 34, index * 34 + 34));
  const objects = {};
  const pageRefs = [];
  let nextObject = 4;
  rowChunks.forEach((pageRows, pageIndex) => {
    const pageObject = nextObject++;
    const contentObject = nextObject++;
    pageRefs.push(`${pageObject} 0 R`);
    const textAt = (text, x, y, size, color = '0.10 0.15 0.27') => `BT /F1 ${size} Tf ${color} rg 1 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)} Tm (${pdfText(text)}) Tj ET`;
    const commands = [textAt(title, margin, 574, 17), textAt(subtitle, margin, 556, 8, '0.35 0.39 0.45')];
    let y = 534;
    headers.forEach((header, index) => commands.push(textAt(header.toUpperCase().slice(0, Math.max(5, Math.floor(columnWidth / 4.2))), margin + index * columnWidth + 2, y, 6, '0.10 0.15 0.27')));
    commands.push(`0.75 G ${margin} ${y - 4} m ${pageWidth - margin} ${y - 4} l S`);
    pageRows.forEach((row) => {
      y -= 14;
      row.forEach((cell, index) => commands.push(textAt(String(cell).slice(0, Math.max(6, Math.floor(columnWidth / 3.8))), margin + index * columnWidth + 2, y, 6.2, '0.13 0.16 0.21')));
      commands.push(`0.88 G ${margin} ${y - 4} m ${pageWidth - margin} ${y - 4} l S`);
    });
    commands.push(textAt(`APPNA North Carolina - page ${pageIndex + 1} of ${rowChunks.length}`, margin, 18, 7, '0.45 0.49 0.55'));
    const stream = commands.join('\n');
    objects[pageObject] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObject} 0 R >>`;
    objects[contentObject] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = `<< /Type /Pages /Kids [${pageRefs.join(' ')}] /Count ${pageRefs.length} >>`;
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  let pdf = '%PDF-1.4\n%APPNA\n';
  const offsets = [0];
  for (let object = 1; object < nextObject; object += 1) {
    offsets[object] = pdf.length;
    pdf += `${object} 0 obj\n${objects[object]}\nendobj\n`;
  }
  const xref = pdf.length;
  pdf += `xref\n0 ${nextObject}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${nextObject} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
const exportFileName = (label, extension) => `${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/^-|-$/g, '')}-${new Date().toISOString().slice(0, 10)}.${extension}`;

function StatusBadge({ status }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] ${statusColors[status] || statusColors.DRAFT}`}>{readableStatus(status)}</span>;
}

function Field({ label, value, onChange, type = 'text', textarea = false, required = false, hint }) {
  return <label className="block"><span className="mb-1.5 flex gap-1 text-xs font-bold text-slate-700">{label}{required && <span className="text-rose-600">*</span>}</span>{textarea ? <textarea value={value} required={required} onChange={(event) => onChange(event.target.value)} rows={5} className={`${inputClass} resize-y`} /> : <input type={type} value={value} required={required} onChange={(event) => onChange(type === 'number' ? Number(event.target.value) : event.target.value)} className={inputClass} />}{hint && <span className="mt-1.5 block text-xs text-slate-400">{hint}</span>}</label>;
}

function Metric({ icon: Icon, label, value, detail, tone }) {
  const toneClass = { navy: 'bg-[#1a2744]', teal: 'bg-teal-600', gold: 'bg-amber-500', green: 'bg-emerald-600', purple: 'bg-violet-600' }[tone];
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-2xl font-bold tracking-tight text-slate-950">{value ?? '—'}</p><p className="mt-1 text-sm font-bold text-slate-700">{label}</p></div><span className={`grid h-9 w-9 place-items-center rounded-xl text-white shadow-sm ${toneClass}`}><Icon size={17} /></span></div><p className="mt-3 text-xs text-slate-400">{detail}</p></div>;
}

function PageHeading({ eyebrow, title, description, action }) {
  return <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7a1f3d]">{eyebrow}</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{title}</h2><p className="mt-1.5 text-sm text-slate-500">{description}</p></div>{action}</div>;
}

function EventImage({ event }) {
  return <div className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a2744] via-[#354a78] to-[#7a1f3d] shadow-sm">{event.bannerImage && <img src={event.bannerImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />}<CalendarDays className="relative text-white" size={20} /></div>;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [requestFilter, setRequestFilter] = useState('ALL');
  const [requestSearch, setRequestSearch] = useState('');
  const [ticketPage, setTicketPage] = useState(1);
  const [ticketPagination, setTicketPagination] = useState({ page: 1, total: 0, totalPages: 1, limit: 20 });
  const [activeView, setActiveView] = useState('manage');
  const [analytics, setAnalytics] = useState(null);
  const [form, setForm] = useState(emptyEvent);
  const [cashTicket, setCashTicket] = useState(emptyCashTicket);
  const [loading, setLoading] = useState(true);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cashSaving, setCashSaving] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveredTickets, setRecoveredTickets] = useState([]);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState('');
  const ticketRequestVersion = useRef(0);

  const requestParams = (eventId = selectedEventId) => ({
    eventId: eventId || undefined,
    status: requestFilter === 'PENDING' ? 'AWAITING_ADMIN_CONFIRMATION' : requestFilter,
    search: requestSearch,
    page: ticketPage,
    limit: 20,
  });
  const setTicketData = (data) => {
    setRequests(data.items ?? data);
    setTicketPagination(data.items ? data : { page: 1, total: data.length, totalPages: 1, limit: data.length });
  };
  const loadOverview = async () => {
    setLoading(true);
    try {
      const [eventsRes, analyticsRes] = await Promise.all([getAdminEvents(), getEventAnalytics()]);
      setEvents(eventsRes.data);
      setAnalytics(analyticsRes.data);
      setSelectedEventId((current) => current || eventsRes.data.find((event) => event.title === 'APPNA NC Annual Banquet, Entertainment & CME 2026')?.id || eventsRes.data[0]?.id || '');
    } finally {
      setLoading(false);
    }
  };
  const loadTickets = async (eventId = selectedEventId) => {
    const version = ++ticketRequestVersion.current;
    setTicketsLoading(true);
    try {
      const [eventResponse, requestsResponse] = await Promise.all([
        eventId ? getAdminEvent(eventId, { status: requestFilter === 'PENDING' ? 'AWAITING_ADMIN_CONFIRMATION' : requestFilter, search: requestSearch }) : Promise.resolve({ data: null }),
        getTicketRequests(requestParams(eventId)),
      ]);
      if (version !== ticketRequestVersion.current) return;
      setSelectedEvent(eventResponse.data);
      setTicketData(requestsResponse.data);
    } finally {
      if (version === ticketRequestVersion.current) setTicketsLoading(false);
    }
  };

  useEffect(() => { loadOverview(); }, []);
  useEffect(() => {
    const timeout = setTimeout(() => { loadTickets(); }, selectedEventId ? 200 : 0);
    return () => clearTimeout(timeout);
  }, [selectedEventId, requestFilter, requestSearch, ticketPage]);
  useEffect(() => { if (activeView === 'cme') window.location.assign('/admin/cme'); }, [activeView]);

  const show = (message) => { setToast(message); setTimeout(() => setToast(''), 3000); };
  const selectEvent = (eventId) => { setTicketPage(1); setSelectedEventId(eventId); };
  const refresh = async () => { await loadOverview(); await loadTickets(); };
  const create = async (event) => {
    event.preventDefault(); setSaving(true);
    try { await createAdminEvent(form); setForm(emptyEvent); await loadOverview(); show('Event created.'); }
    catch (error) { show(error?.response?.data?.message || 'Could not create event.'); }
    finally { setSaving(false); }
  };
  const review = async (id, action) => {
    try { if (action === 'approve') await approveTicketRequest(id); else await rejectTicketRequest(id); await loadOverview(); await loadTickets(); show(action === 'approve' ? 'Ticket approved and emailed.' : 'Request rejected.'); }
    catch (error) { show(error?.response?.data?.message || 'Review action failed.'); }
  };
  const manageTicket = async (id, action) => {
    const label = action === 'cancel' ? 'cancel' : 'permanently delete';
    if (!window.confirm(`Are you sure you want to ${label} this ticket request?`)) return;
    try { if (action === 'cancel') await cancelTicketRequest(id); else await deleteTicketRequest(id); await loadOverview(); await loadTickets(); show(action === 'cancel' ? 'Ticket request cancelled.' : 'Ticket request deleted.'); }
    catch (error) { show(error?.response?.data?.message || `Could not ${action} the ticket request.`); }
  };
  const issueCashTicket = async (event) => {
    event.preventDefault();
    if (!selectedEventId) { show('Select an event before creating a cash ticket.'); return; }
    setCashSaving(true);
    try { await createCashTicket(selectedEventId, cashTicket); setCashTicket(emptyCashTicket); await loadOverview(); await loadTickets(); show('Cash ticket approved, generated, and emailed.'); }
    catch (error) { show(error?.response?.data?.message || 'Could not generate the cash ticket.'); }
    finally { setCashSaving(false); }
  };
  const recoverTickets = async (event) => {
    event.preventDefault();
    setRecoveryLoading(true);
    setRecoveredTickets([]);
    try {
      const { data } = await getAdminTicketsByEmail(recoveryEmail);
      setRecoveredTickets(data);
      show(data.length ? `${data.length} ticket${data.length === 1 ? '' : 's'} found.` : 'No issued tickets found for that email.');
    } catch (error) {
      show(error?.response?.data?.message || 'Could not look up tickets.');
    } finally { setRecoveryLoading(false); }
  };
  const exportTicketData = async (report, format) => {
    setExporting(true);
    try {
      const exportRequests = [];
      let page = 1;
      let totalPages = 1;
      do {
        const response = await getTicketRequests({
          eventId: selectedEventId || undefined,
          status: requestFilter === 'PENDING' ? 'AWAITING_ADMIN_CONFIRMATION' : requestFilter,
          search: requestSearch || undefined,
          page,
          limit: 100,
        });
        const data = response.data;
        exportRequests.push(...(data.items ?? data));
        totalPages = data.totalPages ?? 1;
        page += 1;
      } while (page <= totalPages);

      if (!exportRequests.length) {
        show('There is no ticket data matching the current filters.');
        return;
      }

      const eventName = selectedEvent?.title || 'All events';
      const scope = `${eventName} · ${readableStatus(requestFilter)} · ${requestSearch ? `Search: ${requestSearch}` : 'All matching registrations'}`;
      let title;
      let headers;
      let rows;

      if (report === 'holders') {
        title = 'Ticket holders';
        headers = ['Event', 'Ticket type', 'Ticket number', 'Holder name', 'Email', 'Phone', 'Tickets in order', 'Ticket status', 'Order status', 'Check-in time', 'Order date'];
        rows = exportRequests.flatMap((request) => {
          const tickets = request.tickets?.length ? request.tickets : [null];
          return tickets.map((ticket) => [
            request.event?.title || eventName,
            ticketTypeFor(request),
            ticket?.ticketNumber || request.requestNumber,
            ticket?.attendeeName || request.fullName,
            ticket?.attendeeEmail || request.email,
            request.phone || '—',
            request.ticketQuantity ?? 1,
            ticket?.status ? readableStatus(ticket.status) : 'Not issued',
            readableStatus(request.approvalStatus),
            exportDateTime(ticket?.usedAt),
            exportDateTime(request.createdAt),
          ]);
        });
      } else {
        title = 'Ticket sales summary';
        headers = ['Event', 'Ticket type', 'Tickets sold', 'Gross sales (USD)', 'Pending tickets', 'Rejected / cancelled tickets', 'Checked in'];
        const sales = new Map();
        exportRequests.forEach((request) => {
          const key = `${request.event?.id || request.eventId}|${ticketTypeFor(request)}`;
          const row = sales.get(key) ?? {
            event: request.event?.title || eventName, type: ticketTypeFor(request), sold: 0, revenue: 0, pending: 0, unavailable: 0, checkedIn: 0,
          };
          const quantity = Number(request.ticketQuantity ?? 1);
          if (request.approvalStatus === 'CONFIRMED') {
            row.sold += quantity;
            row.revenue += Number(request.paymentAmount ?? 0);
            row.checkedIn += (request.tickets?.filter((ticket) => ticket.status === 'USED').length ?? 0);
          } else if (['REJECTED', 'CANCELLED'].includes(request.approvalStatus)) {
            row.unavailable += quantity;
          } else {
            row.pending += quantity;
          }
          sales.set(key, row);
        });
        rows = [...sales.values()].map((row) => [row.event, row.type, row.sold, row.revenue.toFixed(2), row.pending, row.unavailable, row.checkedIn]);
      }

      if (format === 'csv') {
        downloadCsv(exportFileName(title, 'csv'), headers, rows);
        show(`${title} exported for Excel.`);
      } else {
        downloadPdf(exportFileName(title, 'pdf'), title, scope, headers, rows);
        show(`${title} downloaded as a PDF.`);
      }
    } catch (error) {
      show(error?.response?.data?.message || 'Could not export ticket data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const navigation = [
    { id: 'manage', label: 'Event portfolio', icon: Settings2 },
    { id: 'create', label: 'Create event', icon: Plus },
    { id: 'tickets', label: 'Ticket requests', icon: ClipboardList },
    { id: 'recovery', label: 'Ticket recovery', icon: Download },
    { id: 'cash', label: 'Cash ticket', icon: Ticket },
    { id: 'cme', label: 'CME submissions', icon: ClipboardList },
  ];
  const viewCopy = {
    manage: ['Event workspace', 'Events at a glance', 'A focused view of event health, registrations, and publishing state.'],
    create: ['Event workspace', 'Create an event', 'Add an event without leaving the operations console.'],
    tickets: ['Registration operations', 'Ticket requests', 'Review attendee access, payment details, and registration history.'],
    recovery: ['Attendee support', 'Ticket recovery', 'Find issued tickets by email and download their original PNG cards.'],
    cash: ['Registration operations', 'Issue a cash ticket', 'Record an offline payment and issue a scannable pass immediately.'],
    cme: ['Registration operations', 'CME submissions', 'Opening the CME submission register.'],
  }[activeView];

  return <main className="min-h-screen bg-[#f4f6fa] px-4 py-5 text-slate-900 sm:px-6 lg:px-8"><section className="mx-auto max-w-[1440px]"><header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5"><div><p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7a1f3d]">APPNA North Carolina · Admin</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-[#1a2744]">Event operations</h1></div><div className="flex items-center gap-2"><a href="/admin/scanner" className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-[#1a2744]/30 hover:text-[#1a2744] sm:inline-flex"><ScanLine size={16} /> QR check-in</a><button type="button" onClick={refresh} disabled={loading || ticketsLoading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-[#1a2744]/30 hover:text-[#1a2744] disabled:opacity-60"><RefreshCw size={16} className={loading || ticketsLoading ? 'animate-spin' : ''} /> Refresh</button></div></header><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><Metric icon={CalendarDays} label="Events" value={analytics?.totalEvents} detail="Across every status" tone="navy" /><Metric icon={Users} label="Registrations" value={analytics?.totalRegistrations} detail="All attendee requests" tone="teal" /><Metric icon={Ticket} label="Approved tickets" value={analytics?.totalApprovedTickets} detail="Ready for check-in" tone="green" /><Metric icon={DollarSign} label="Revenue" value={`$${analytics?.totalRevenue ?? 0}`} detail="Recorded ticket sales" tone="gold" /><Metric icon={CheckCircle2} label="Attendance" value={`${analytics?.attendance?.attendanceRate ?? 0}%`} detail="Checked-in ticket holders" tone="purple" /></div><div className="mt-6 grid gap-6 lg:grid-cols-[238px_minmax(0,1fr)]"><aside className="h-fit overflow-hidden rounded-2xl bg-[#1a2744] p-3 shadow-xl shadow-[#1a2744]/15 lg:sticky lg:top-5"><div className="border-b border-white/10 px-3 pb-4 pt-2"><p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-white/45">Workspace</p><p className="mt-1 text-sm font-bold text-white">Event management</p></div><nav className="mt-3 space-y-1" aria-label="Event operations">{navigation.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${activeView === id ? 'bg-white text-[#1a2744] shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}><Icon size={17} />{label}</button>)}</nav><a href="/admin/scanner" className="mt-3 flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm font-bold text-white transition hover:bg-white/10 sm:hidden"><span className="flex items-center gap-3"><ScanLine size={17} /> QR check-in</span><ArrowUpRight size={16} /></a><div className="mt-5 rounded-xl border border-white/10 bg-white/5 px-3 py-3"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/45">Quick note</p><p className="mt-1 text-xs leading-5 text-white/75">Use QR check-in on event day to keep attendance accurate in real time.</p></div></aside><section className="min-w-0"><PageHeading eyebrow={viewCopy[0]} title={viewCopy[1]} description={viewCopy[2]} action={activeView === 'manage' ? <button type="button" onClick={() => setActiveView('create')} className="inline-flex items-center gap-2 rounded-xl bg-[#1a2744] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-[#1a2744]/15 transition hover:bg-[#2c3e67]"><Plus size={16} /> New event</button> : null} /><div className="mt-5">{activeView === 'manage' && <EventPortfolio events={events} loading={loading} selectedEventId={selectedEventId} onSelect={(id) => { selectEvent(id); setActiveView('tickets'); }} onStatusChange={(id, status) => setAdminEventStatus(id, status).then(loadOverview)} />}{activeView === 'create' && <EventForm form={form} setForm={setForm} saving={saving} onSubmit={create} />}{activeView === 'tickets' && <TicketTable selectedEvent={selectedEvent} requests={requests} loading={ticketsLoading} filter={requestFilter} onFilter={(value) => { setTicketPage(1); setRequestFilter(value); }} search={requestSearch} onSearch={(value) => { setTicketPage(1); setRequestSearch(value); }} pagination={ticketPagination} setPage={setTicketPage} review={review} manageTicket={manageTicket} onExport={exportTicketData} exporting={exporting} />}{activeView === 'recovery' && <TicketRecovery email={recoveryEmail} setEmail={setRecoveryEmail} tickets={recoveredTickets} loading={recoveryLoading} onSubmit={recoverTickets} />}{activeView === 'cash' && <CashTicketForm events={events} selectedEvent={selectedEvent} selectedEventId={selectedEventId} onSelect={selectEvent} ticket={cashTicket} setTicket={setCashTicket} saving={cashSaving} onSubmit={issueCashTicket} />}</div></section></div></section>{toast && <div role="status" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-2xl">{toast}</div>}</main>;
}

function TicketRecovery({ email, setEmail, tickets, loading, onSubmit }) {
  const downloadTicket = (ticket) => {
    if (!ticket.ticketImageDataUrl) return;
    const link = document.createElement('a');
    link.href = ticket.ticketImageDataUrl;
    link.download = `${ticket.ticketNumber || 'appna-ticket'}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  return <div className="space-y-5"><form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h3 className="font-bold text-slate-950">Find issued tickets</h3><p className="mt-1 text-sm text-slate-500">Search the ticket database by the attendee email. Downloaded files are the original QR-ready PNG cards.</p><div className="mt-5 flex flex-col gap-3 sm:flex-row"><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="attendee@example.com" className={inputClass} /><button disabled={loading} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1a2744] px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />} Find tickets</button></div></form>{tickets.length > 0 && <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><h3 className="font-bold text-slate-950">Issued tickets</h3><p className="mt-1 text-xs text-slate-500">Only tickets that have already been created appear here.</p></div><div className="divide-y divide-slate-100">{tickets.map((ticket) => <div key={ticket.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"><div><p className="font-bold text-slate-900">{ticket.event.title}</p><p className="mt-1 text-sm text-slate-600">{ticket.attendeeName} · {ticket.ticketNumber}</p><p className="mt-1 text-xs text-slate-400">Issued {formatDate(ticket.issueDate)} · {readableStatus(ticket.status)}</p></div><button type="button" disabled={!ticket.ticketImageDataUrl} onClick={() => downloadTicket(ticket)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"><Download size={16} /> Download PNG</button></div>)}</div></section>}</div>;
}

function EventPortfolio({ events, loading, selectedEventId, onSelect, onStatusChange }) {
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4"><div><h3 className="font-bold text-slate-950">Event catalogue</h3><p className="mt-1 text-xs text-slate-500">Select an event to work with its registration queue.</p></div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">{events.length} total</span></div>{loading ? <div className="grid min-h-80 place-items-center text-center text-sm text-slate-400"><div><Loader2 className="mx-auto mb-3 animate-spin text-[#1a2744]" size={22} />Loading events…</div></div> : events.length === 0 ? <EmptyState icon={CalendarDays} title="No events yet" description="Create your first event to start accepting registrations." /> : <div className="divide-y divide-slate-100">{events.map((event) => <article key={event.id} className={`flex flex-col gap-4 px-5 py-4 transition hover:bg-slate-50/70 xl:flex-row xl:items-center ${selectedEventId === event.id ? 'bg-[#f7f8fc]' : ''}`}><div className="flex min-w-0 flex-1 items-center gap-3"><EventImage event={event} /><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h4 className="truncate font-bold text-slate-950">{event.title}</h4><StatusBadge status={event.status} /></div><div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><CalendarDays size={13} />{formatDate(event.date)}</span><span className="inline-flex items-center gap-1.5"><MapPin size={13} />{event.venue || 'Venue not set'}</span></div></div></div><div className="grid grid-cols-3 rounded-xl border border-slate-100 bg-white text-center xl:w-72"><EventCount value={event.registrationCount ?? 0} label="Registered" /><EventCount value={event.pendingCount ?? 0} label="Pending" tone="amber" /><EventCount value={event.approvedCount ?? 0} label="Approved" tone="green" /></div><div className="flex gap-2 xl:w-52"><button type="button" onClick={() => onSelect(event.id)} className="flex-1 rounded-xl bg-[#1a2744] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#2c3e67]">Tickets</button><select aria-label={`Set status for ${event.title}`} value={event.status} onChange={(change) => onStatusChange(event.id, change.target.value)} className="w-24 rounded-xl border border-slate-200 bg-white px-2 text-xs font-bold text-slate-600 outline-none focus:border-[#1a2744]"><option>DRAFT</option><option>PUBLISHED</option><option>COMPLETED</option><option>CANCELLED</option></select></div></article>)}</div>}</section>;
}

function EventCount({ value, label, tone = 'slate' }) { const color = tone === 'amber' ? 'text-amber-700' : tone === 'green' ? 'text-emerald-700' : 'text-slate-900'; return <div className="border-r border-slate-100 px-3 py-2.5 last:border-0"><p className={`text-sm font-bold ${color}`}>{value}</p><p className="mt-0.5 text-[9px] font-extrabold uppercase tracking-wide text-slate-400">{label}</p></div>; }
function EmptyState({ icon: Icon, title, description }) { return <div className="grid min-h-80 place-items-center px-5 text-center"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400"><Icon size={22} /></span><h3 className="mt-4 font-bold text-slate-700">{title}</h3><p className="mt-1 text-sm text-slate-400">{description}</p></div></div>; }

function EventForm({ form, setForm, saving, onSubmit }) {
  const update = (key, value) => setForm({ ...form, [key]: value });
  return <form onSubmit={onSubmit} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-5"><h3 className="font-bold text-slate-950">Event details</h3><p className="mt-1 text-sm text-slate-500">Define the schedule, venue, and ticketing information in one place.</p></div><div className="space-y-7 p-5 sm:p-6"><FormSection title="Event information"><div className="grid gap-5"><Field label="Event title" value={form.title} onChange={(value) => update('title', value)} /><Field label="Description" textarea value={form.description} onChange={(value) => update('description', value)} hint="Use this space for the program, audience, and key attendee information." /></div></FormSection><FormSection title="Schedule & venue"><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"><Field label="Category" value={form.category} onChange={(value) => update('category', value)} /><Field label="Event date" type="date" value={form.date} onChange={(value) => update('date', value)} /><Field label="Venue" value={form.venue} onChange={(value) => update('venue', value)} /><Field label="Start time" type="time" value={form.startTime} onChange={(value) => update('startTime', value)} /><Field label="End time" type="time" value={form.endTime} onChange={(value) => update('endTime', value)} /><Field label="Google Maps URL" value={form.googleMapsUrl} onChange={(value) => update('googleMapsUrl', value)} /></div></FormSection><FormSection title="Ticketing & visibility"><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"><Field label="Capacity" type="number" value={form.capacity} onChange={(value) => update('capacity', value)} /><Field label="Ticket price (USD)" type="number" value={form.ticketPrice} onChange={(value) => update('ticketPrice', value)} /><label><span className="mb-1.5 block text-xs font-bold text-slate-700">Initial status</span><select value={form.status} onChange={(event) => update('status', event.target.value)} className={inputClass}><option>DRAFT</option><option>PUBLISHED</option><option>COMPLETED</option><option>CANCELLED</option></select></label><div className="sm:col-span-2 xl:col-span-3"><Field label="Banner image URL" value={form.bannerImage} onChange={(value) => update('bannerImage', value)} hint="Optional image URL used on the member-facing event page." /></div></div></FormSection></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-6"><p className="text-xs text-slate-500">You can change publishing status later from the event catalogue.</p><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#1a2744] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#1a2744]/15 transition hover:bg-[#2c3e67] disabled:opacity-60">{saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Create event</button></div></form>;
}

function FormSection({ title, children }) { return <section className="border-b border-slate-100 pb-7 last:border-0 last:pb-0"><p className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">{title}</p>{children}</section>; }

function TicketTable({ onExport, exporting, ...tableProps }) {
  return <div className="space-y-4"><section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#7a1f3d]">Reports & exports</p><p className="mt-1 text-sm text-slate-500">Exports include every result that matches the current event, status, and search filters.</p></div><div className="flex flex-wrap gap-2"><button type="button" disabled={exporting} onClick={() => onExport('holders', 'csv')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-[#1a2744]/30 hover:text-[#1a2744] disabled:opacity-50"><Download size={14} />Holders · Excel</button><button type="button" disabled={exporting} onClick={() => onExport('holders', 'pdf')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-[#1a2744]/30 hover:text-[#1a2744] disabled:opacity-50"><FileText size={14} />Holders · PDF</button><button type="button" disabled={exporting} onClick={() => onExport('sales', 'csv')} className="inline-flex items-center gap-1.5 rounded-lg bg-[#1a2744] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#2c3e67] disabled:opacity-50"><Download size={14} />Sales · Excel</button><button type="button" disabled={exporting} onClick={() => onExport('sales', 'pdf')} className="inline-flex items-center gap-1.5 rounded-lg bg-[#1a2744] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#2c3e67] disabled:opacity-50"><FileText size={14} />Sales · PDF</button></div></section><LegacyTicketTable {...tableProps} /></div>;
}

function LegacyTicketTable({ selectedEvent, requests, loading, filter, onFilter, search, onSearch, pagination, setPage, review, manageTicket }) {
  const filters = [['ALL', 'All'], ['PENDING', 'Needs review'], ['CONFIRMED', 'Approved'], ['REJECTED', 'Rejected'], ['CANCELLED', 'Cancelled']];
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-5"><div className="flex flex-col justify-between gap-4 xl:flex-row"><div className="min-w-0">{selectedEvent ? <div className="flex items-center gap-3"><EventImage event={selectedEvent} /><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-bold text-slate-950">{selectedEvent.title}</h3><StatusBadge status={selectedEvent.status} /></div><p className="mt-1 text-xs text-slate-500">{formatDate(selectedEvent.date)} · {selectedEvent.venue || 'Venue not set'}</p></div></div> : <><h3 className="font-bold text-slate-950">All ticket requests</h3><p className="mt-1 text-sm text-slate-500">Choose an event from the catalogue to narrow this queue.</p></>}</div><div className="flex h-fit flex-wrap gap-1 rounded-xl bg-slate-100 p-1.5">{filters.map(([value, label]) => <button key={value} type="button" onClick={() => onFilter(value)} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${filter === value ? 'bg-white text-[#1a2744] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{label}</button>)}</div></div><label className="mt-5 flex max-w-xl items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm focus-within:border-[#1a2744] focus-within:ring-4 focus-within:ring-[#1a2744]/10"><Search size={16} className="text-slate-400" /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search attendee, email, or ticket number" className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400" /></label></div><div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 text-xs text-slate-500"><span>{loading ? 'Refreshing ticket queue…' : `${pagination.total} request${pagination.total === 1 ? '' : 's'} · Page ${pagination.page} of ${pagination.totalPages}`}</span><div className="flex gap-1.5"><button type="button" aria-label="Previous ticket page" disabled={loading || pagination.page <= 1} onClick={() => setPage((page) => Math.max(1, page - 1))} className="rounded-lg border border-slate-200 p-1.5 disabled:opacity-40"><ChevronLeft size={16} /></button><button type="button" aria-label="Next ticket page" disabled={loading || pagination.page >= pagination.totalPages} onClick={() => setPage((page) => Math.min(pagination.totalPages, page + 1))} className="rounded-lg border border-slate-200 p-1.5 disabled:opacity-40"><ChevronRight size={16} /></button></div></div><div className="overflow-x-auto"><table className="min-w-[950px] w-full text-left text-sm"><thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-[0.13em] text-slate-400"><tr><th className="px-5 py-3.5">Attendee</th><th className="px-4 py-3.5">Ticket</th><th className="px-4 py-3.5">Payment</th><th className="px-4 py-3.5">Status</th><th className="px-5 py-3.5 text-right">Actions</th></tr></thead><tbody className={`divide-y divide-slate-100 transition-opacity ${loading ? 'opacity-45' : ''}`}>{requests.length === 0 ? <tr><td colSpan={5}><EmptyState icon={Ticket} title={loading ? 'Loading requests' : 'No ticket requests found'} description={loading ? 'Getting the latest registration data.' : 'Try another status or search term.'} /></td></tr> : requests.map((request) => <TicketRow key={request.id} request={request} disabled={loading} review={review} manageTicket={manageTicket} />)}</tbody></table></div></section>;
}

function TicketRow({ request, disabled, review, manageTicket }) {
  const needsReview = ['AWAITING_ADMIN_CONFIRMATION', 'PAYMENT_COMPLETED'].includes(request.approvalStatus);
  const numbers = request.tickets?.map((ticket) => ticket.ticketNumber).join(', ') || request.requestNumber;
  const initials = String(request.fullName || '?').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  return <tr className="transition hover:bg-slate-50/70"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#1a2744]/10 text-xs font-extrabold text-[#1a2744]">{initials}</span><div><p className="font-bold text-slate-900">{request.fullName}</p><p className="mt-0.5 text-xs text-slate-500">{request.email}</p><p className="mt-1 text-xs text-slate-400">{request.event?.title}</p></div></div></td><td className="px-4 py-4"><p className="font-semibold text-slate-700">{request.ticketQuantity ?? 1} {(request.ticketQuantity ?? 1) === 1 ? 'ticket' : 'tickets'}</p><p className="mt-1 max-w-40 truncate text-xs text-slate-400" title={numbers}>{numbers}</p></td><td className="px-4 py-4"><p className="font-semibold text-slate-700">${request.paymentAmount}</p><p className="mt-1 text-xs text-slate-400">{request.paymentProvider ?? 'N/A'} · {request.paymentStatus}</p></td><td className="px-4 py-4"><StatusBadge status={request.approvalStatus} /><p className="mt-2 text-xs text-slate-400">{formatDate(request.createdAt)}</p></td><td className="px-5 py-4"><div className="flex min-w-64 flex-wrap justify-end gap-2">{needsReview && <><button disabled={disabled} type="button" onClick={() => review(request.id, 'approve')} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"><CheckCircle2 size={14} />Approve</button><button disabled={disabled} type="button" onClick={() => review(request.id, 'reject')} className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"><XCircle size={14} />Reject</button></>}{request.approvalStatus !== 'CANCELLED' && <button disabled={disabled} type="button" onClick={() => manageTicket(request.id, 'cancel')} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-2 text-xs font-bold text-amber-800 transition hover:bg-amber-100 disabled:opacity-50"><Ban size={14} />Cancel</button>}<button disabled={disabled} type="button" onClick={() => manageTicket(request.id, 'delete')} className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"><Trash2 size={14} />Delete</button></div></td></tr>;
}

function CashTicketForm({ events, selectedEvent, selectedEventId, onSelect, ticket, setTicket, saving, onSubmit }) {
  const update = (key, value) => setTicket({ ...ticket, [key]: value });
  const extras = (selectedEvent?.registrationFields ?? []).filter((field) => !['fullName', 'email', 'phone', 'city', 'organization', 'designation'].includes(field.key));
  return <form onSubmit={onSubmit} className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-emerald-100 bg-emerald-50/70 px-5 py-5"><div><h3 className="flex items-center gap-2 font-bold text-slate-950"><Ticket size={18} className="text-emerald-700" />Cash ticket details</h3><p className="mt-1 text-sm text-slate-600">Creates an approved, QR-ready ticket and sends it by email immediately.</p></div><StatusBadge status="CONFIRMED" /></div><div className="space-y-7 p-5 sm:p-6"><FormSection title="Event & attendee"><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"><label><span className="mb-1.5 block text-xs font-bold text-slate-700">Event <span className="text-rose-600">*</span></span><select required value={selectedEventId} onChange={(event) => onSelect(event.target.value)} className={inputClass}><option value="">Select event</option>{events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}</select></label><Field required label="Full name" value={ticket.fullName} onChange={(value) => update('fullName', value)} /><Field required label="Email address" type="email" value={ticket.email} onChange={(value) => update('email', value)} /><Field required label="Phone number" type="tel" value={ticket.phone} onChange={(value) => update('phone', value)} /><Field label="Quantity" type="number" value={ticket.ticketQuantity} onChange={(value) => update('ticketQuantity', Math.max(1, value))} /><Field label="City" value={ticket.city} onChange={(value) => update('city', value)} /><Field label="Organization" value={ticket.organization} onChange={(value) => update('organization', value)} /><Field label="Designation" value={ticket.designation} onChange={(value) => update('designation', value)} /></div></FormSection>{extras.length > 0 && <FormSection title="Additional event questions"><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{extras.map((field) => <Field key={field.id ?? field.key} required={field.required} label={field.label} type={field.type === 'EMAIL' ? 'email' : field.type === 'NUMBER' ? 'number' : field.type === 'DATE' ? 'date' : 'text'} value={ticket.answers[field.key] ?? ''} onChange={(value) => setTicket({ ...ticket, answers: { ...ticket.answers, [field.key]: value } })} />)}</div></FormSection>}</div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-6"><p className="text-xs text-slate-500">Review attendee details before issuing a ticket.</p><button disabled={saving || !selectedEventId} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-60">{saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}Generate cash ticket</button></div></form>;
}
