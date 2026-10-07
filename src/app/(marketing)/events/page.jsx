'use client';

import { CalendarDays } from 'lucide-react';

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fb] px-4 py-10 sm:px-8">
      <section className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <CalendarDays className="h-7 w-7 text-gray-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Thank You for Your Interest!
        </h1>
        <p className="mt-2 text-gray-600">
          Thank you for visiting to register for tickets. Registration is
          currently closed, but we truly appreciate your support of APPNA North
          Carolina Chapter.
        </p>
        <p className="mt-1 text-gray-600">
          Please stay tuned for our upcoming events.
        </p>

        <div className="mt-8 w-full max-w-md rounded-lg bg-white p-3 shadow">
          <img
            src="/future_events/Annual_Banquet.png"
            alt="Annual Banquet flyer"
            className="h-auto w-full rounded-lg"
          />
        </div>
      </section>
    </main>
  );
}