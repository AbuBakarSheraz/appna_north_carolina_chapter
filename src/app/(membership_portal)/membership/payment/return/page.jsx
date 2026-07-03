'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { verifySquareMembershipPayment } from '../../../../../lib/profile';

export default function SquareMembershipReturnPage() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Confirming your Square payment...');

  useEffect(() => {
    (async () => {
      try {
        await verifySquareMembershipPayment();
        setStatus('success');
        setMessage('Payment received. APPNA NC will review it and email your login confirmation within 24 hours.');
      } catch (err) {
        setStatus('error');
        setMessage(err?.response?.data?.message || 'We could not confirm your Square payment. Please contact APPNA NC.');
      }
    })();
  }, []);

  const isSuccess = status === 'success';
  const Icon = status === 'loading' ? Loader2 : isSuccess ? CheckCircle2 : AlertCircle;

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: isSuccess ? '#dcfce7' : status === 'error' ? '#fee2e2' : '#fdf2f5' }}
        >
          <Icon
            size={28}
            className={status === 'loading' ? 'animate-spin text-[#7a1f3d]' : isSuccess ? 'text-green-600' : 'text-red-600'}
          />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {status === 'loading' ? 'Finalizing Payment' : isSuccess ? 'Payment Received' : 'Payment Needs Attention'}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">{message}</p>
        {status !== 'loading' && (
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#7a1f3d] px-5 py-3 text-sm font-semibold text-white"
          >
            Go to Dashboard <ArrowRight size={15} />
          </Link>
        )}
      </section>
    </main>
  );
}
