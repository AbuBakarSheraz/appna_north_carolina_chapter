'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { captureEventPayment } from '../../../../../lib/events';

export default function EventPaymentReturnPage() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Confirming your event payment...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('token');
    const requestId = params.get('requestId');

    if (!orderId || !requestId) {
      setStatus('error');
      setMessage('PayPal did not return the expected payment details.');
      return;
    }

    (async () => {
      try {
        await captureEventPayment({ orderId, requestId });
        setStatus('success');
        setMessage('Payment received. APPNA NC will review your registration and email your ticket after approval.');
      } catch (err) {
        setStatus('error');
        setMessage(err?.response?.data?.message || 'We could not verify this payment.');
      }
    })();
  }, []);

  const Icon = status === 'loading' ? Loader2 : status === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <section className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <Icon className={`mx-auto mb-4 ${status === 'loading' ? 'animate-spin text-[#7a1f3d]' : status === 'success' ? 'text-green-600' : 'text-red-600'}`} size={38} />
        <h1 className="text-2xl font-semibold text-gray-950">{status === 'success' ? 'Payment Received' : status === 'error' ? 'Payment Needs Review' : 'Finalizing Payment'}</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">{message}</p>
        {status !== 'loading' && <Link href="/events" className="mt-6 inline-flex rounded-lg bg-[#7a1f3d] px-5 py-3 text-sm font-semibold text-white">Back to Events</Link>}
      </section>
    </main>
  );
}
