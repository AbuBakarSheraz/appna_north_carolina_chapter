'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, Loader2, QrCode, Search, Ticket } from 'lucide-react';
import { getMyTickets } from '../../../lib/events';

function formatDate(value) {
  if (!value) return 'Not available';
  return new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function statusClass(status) {
  const value = String(status || '').toLowerCase();
  if (value.includes('confirm') || value.includes('checked')) return 'bg-green-50 text-green-700 border-green-200';
  if (value.includes('reject') || value.includes('failed')) return 'bg-red-50 text-red-700 border-red-200';
  if (value.includes('expire') || value.includes('cancel')) return 'bg-gray-100 text-gray-600 border-gray-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
}

async function loadImage(src) {
  if (!src) return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function downloadPass(ticket, type) {
  const W = 1400;
  const H = 820;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const qr = await loadImage(ticket.qrCodeDataUrl);
  const banner = await loadImage(ticket.event?.bannerImage);

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ffffff';
  ctx.roundRect(44, 44, W - 88, H - 88, 24);
  ctx.fill();
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (banner) ctx.drawImage(banner, 44, 44, W - 88, 190);
  ctx.fillStyle = 'rgba(122,31,61,.88)';
  ctx.fillRect(44, 44, W - 88, 190);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 34px Arial';
  ctx.fillText('APPNA NC Event Pass', 90, 104);
  ctx.font = '700 52px Arial';
  ctx.fillText(ticket.event?.title || 'Event Registration', 90, 178, 760);

  ctx.fillStyle = '#111827';
  ctx.font = '700 30px Arial';
  ctx.fillText(ticket.attendeeName || 'Attendee', 90, 300);
  ctx.font = '18px Arial';
  ctx.fillStyle = '#4b5563';
  ctx.fillText(ticket.attendeeEmail || '', 90, 332);

  const rows = [
    ['Date', formatDate(ticket.event?.date)],
    ['Time', `${ticket.event?.startTime || ''} - ${ticket.event?.endTime || ''}`],
    ['Location', ticket.event?.venue || 'Not available'],
    ['Ticket', ticket.ticketNumber],
    ['Status', ticket.status],
    ['Purchased', formatDate(ticket.purchaseDate)],
  ];
  rows.forEach(([label, value], i) => {
    const x = 90 + (i % 2) * 400;
    const y = 420 + Math.floor(i / 2) * 90;
    ctx.fillStyle = '#7a1f3d';
    ctx.font = '700 16px Arial';
    ctx.fillText(label.toUpperCase(), x, y);
    ctx.fillStyle = '#111827';
    ctx.font = '22px Arial';
    ctx.fillText(String(value || 'Not available'), x, y + 32, 340);
  });

  ctx.fillStyle = '#f8fafc';
  ctx.roundRect(1020, 285, 260, 260, 18);
  ctx.fill();
  if (qr) ctx.drawImage(qr, 1045, 310, 210, 210);
  else {
    ctx.fillStyle = '#9ca3af';
    ctx.font = '20px Arial';
    ctx.fillText('QR pending', 1100, 420);
  }
  ctx.fillStyle = '#6b7280';
  ctx.font = '16px Arial';
  ctx.fillText('Scan at check-in after approval', 1042, 585);

  const mime = type === 'jpg' ? 'image/jpeg' : 'image/png';
  const link = document.createElement('a');
  link.download = `APPNA-NC-${ticket.ticketNumber}.${type}`;
  link.href = canvas.toDataURL(mime, 0.95);
  link.click();
}

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyTickets();
        setTickets(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return tickets;
    return tickets.filter((ticket) =>
      [ticket.event?.title, ticket.ticketNumber, ticket.attendeeName, ticket.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [query, tickets]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#7a1f3d]">Member Portal</p>
            <h1 className="mt-1 text-3xl font-semibold text-gray-950">My Tickets</h1>
            <p className="mt-1 text-sm text-gray-500">All event registrations stay visible here, including pending approvals and history.</p>
          </div>
          <label className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 sm:w-80">
            <Search size={16} className="text-gray-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tickets" className="w-full bg-transparent text-sm outline-none" />
          </label>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#7a1f3d]" /></div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-gray-500">
            <Ticket className="mx-auto mb-3 text-gray-300" size={38} />
            No ticket registrations found.
          </div>
        ) : (
          <div className="grid gap-5">
            {filtered.map((ticket) => (
              <article key={ticket.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="h-28 bg-[#7a1f3d] bg-cover bg-center" style={{ backgroundImage: ticket.event?.bannerImage ? `linear-gradient(rgba(122,31,61,.72),rgba(122,31,61,.72)),url(${ticket.event.bannerImage})` : undefined }}>
                  <div className="flex h-full items-end justify-between gap-3 p-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-white/70">APPNA NC Event Pass</p>
                      <h2 className="mt-1 text-2xl font-semibold text-white">{ticket.event?.title}</h2>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(ticket.status)}`}>{ticket.status}</span>
                  </div>
                </div>

                <div className="grid gap-5 p-5 lg:grid-cols-[1fr_230px]">
                  <div className="grid gap-4 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-3">
                    <div><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Date</p><p className="mt-1 font-semibold text-gray-950">{formatDate(ticket.event?.date)}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Time</p><p className="mt-1 font-semibold text-gray-950">{ticket.event?.startTime} - {ticket.event?.endTime}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Location</p><p className="mt-1 font-semibold text-gray-950">{ticket.event?.venue}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Ticket Number</p><p className="mt-1 font-semibold text-gray-950">{ticket.ticketNumber}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Name</p><p className="mt-1 font-semibold text-gray-950">{ticket.attendeeName}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Email</p><p className="mt-1 font-semibold text-gray-950">{ticket.attendeeEmail}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Purchase Date</p><p className="mt-1 font-semibold text-gray-950">{formatDate(ticket.purchaseDate)}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Payment</p><p className="mt-1 font-semibold text-gray-950">{ticket.paymentStatus}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Approval</p><p className="mt-1 font-semibold text-gray-950">{ticket.approvalStatus}</p></div>
                  </div>

                  <aside className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-center">
                    {ticket.qrCodeDataUrl ? (
                      <img src={ticket.qrCodeDataUrl} alt={`QR for ${ticket.ticketNumber}`} className="mx-auto h-36 w-36 rounded-lg bg-white object-contain p-2" />
                    ) : (
                      <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-lg bg-white text-gray-300">
                        <QrCode size={60} />
                      </div>
                    )}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button onClick={() => downloadPass(ticket, 'png')} className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#7a1f3d] px-3 py-2 text-xs font-semibold text-white">
                        <Download size={13} /> PNG
                      </button>
                      <button onClick={() => downloadPass(ticket, 'jpg')} className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700">
                        <Download size={13} /> JPG
                      </button>
                    </div>
                  </aside>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
