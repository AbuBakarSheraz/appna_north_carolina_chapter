'use client';

import Link from 'next/link';
import { ArrowLeft, CreditCard } from 'lucide-react';

export default function SquareCancelPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
          <CreditCard size={28} className="text-amber-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Payment Cancelled</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          No payment was captured. You can return to membership selection whenever you are ready.
        </p>
        <Link
          href="/complete-profile"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#7a1f3d] px-5 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft size={15} /> Back to Membership
        </Link>
      </section>
    </main>
  );
}
