'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Loader2, MapPin, Ticket } from 'lucide-react';
import { listEvents } from '../../../lib/events';

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await listEvents();
        setEvents(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f9fb] px-4 py-10 sm:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#7a1f3d]">APPNA NC</p>
          <h1 className="mt-1 text-3xl font-semibold text-gray-950 sm:text-4xl">Event Tickets</h1>
        </div>

        {loading ? (
          <div className="flex h-56 items-center justify-center">
            <Loader2 className="animate-spin text-[#7a1f3d]" />
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-gray-500">
            No published ticketed events yet.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="aspect-[16/9] bg-gray-100">
                  {event.bannerImage ? (
                    <img src={event.bannerImage} alt={event.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#7a1f3d]/10 text-[#7a1f3d]">
                      <Ticket size={38} />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="mb-3 inline-flex rounded-full bg-[#7a1f3d]/10 px-3 py-1 text-xs font-semibold text-[#7a1f3d]">
                    ${event.ticketPrice} USD
                  </div>
                  <h2 className="text-lg font-semibold text-gray-950">{event.title}</h2>
                  <div className="mt-3 space-y-2 text-sm text-gray-500">
                    <p className="flex items-center gap-2"><CalendarDays size={15} />{formatDate(event.date)} | {event.startTime}</p>
                    <p className="flex items-center gap-2"><MapPin size={15} />{event.venue}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
