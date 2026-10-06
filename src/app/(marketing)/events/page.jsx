'use client';

import { CalendarDays } from 'lucide-react';

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fb] px-4 py-10 sm:px-8">
      <section className="mx-auto flex max-w-6xl flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <CalendarDays className="h-7 w-7 text-gray-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Closed</h1>
        <p className="mt-2 text-gray-600">
          Registration is currently closed.
        </p>
      </section>
    </main>
  );
}