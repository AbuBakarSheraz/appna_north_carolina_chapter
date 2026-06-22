'use client';

import { useEffect, useState } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { getMyNotifications } from '../../../lib/events';

export default function NotificationsPage() {
  const [data, setData] = useState({ items: [], unreadCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyNotifications();
        setData(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <section className="mx-auto max-w-4xl">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#7a1f3d]">Member Portal</p>
          <h1 className="mt-1 text-3xl font-semibold text-gray-950">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">{data.unreadCount} unread updates</p>
        </div>

        {loading ? (
          <div className="flex h-56 items-center justify-center"><Loader2 className="animate-spin text-[#7a1f3d]" /></div>
        ) : data.items.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-gray-500">
            <Bell className="mx-auto mb-3 text-gray-300" size={36} />
            No notifications yet.
          </div>
        ) : (
          <div className="space-y-3">
            {data.items.map((item) => (
              <article key={item.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-950">{item.title}</p>
                    <p className="mt-1 text-sm text-gray-600">{item.message}</p>
                  </div>
                  {!item.readAt && <span className="mt-1 rounded-full bg-[#7a1f3d] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">New</span>}
                </div>
                <p className="mt-3 text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
