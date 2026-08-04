'use client';

import {
  Store, CalendarDays, Clock, MapPin, Users,
  CheckCircle2, ArrowRight, ShoppingBag,
} from 'lucide-react';

const STALLS = [
  {
    label: 'Standard Stall',
    price: 500,
    accent: '#7a1f3d',
    perks: [
      'General floor Placement',
      'No complementry Banquet ticket',
      '1 person per booth',
      'Additional ticketed person allowed',
    ],
  },
  {
    label: 'Premium Stall',
    price: 1000,
    accent: '#1a3a5c',
    popular: true,
    perks: [
      'Priority placement near the main entrance',
      'One* complementry Banquet tickets',
      '1 person per booth',
      'Additional ticketed person allowed',     
    ],
  },
];

export default function BazaarVendorPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');

        .bazaar-root { font-family: 'Outfit', sans-serif; }
        .display-font { font-family: 'Cormorant Garamond', serif; }

        .panel-bg {
          background: linear-gradient(160deg, #4a0e22 0%, #7a1f3d 50%, #9b3855 100%);
        }
        .noise-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .accent-btn {
          background: linear-gradient(135deg, #7a1f3d 0%, #9b2d51 100%);
          box-shadow: 0 4px 20px rgba(122,31,61,0.3);
          transition: all 0.25s ease;
        }
        .accent-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(122,31,61,0.4); }
      `}</style>

      <main className="bazaar-root bg-white">

        {/* ── HERO ── */}
        <section className="panel-bg noise-overlay relative overflow-hidden text-white">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5" />
          <div className="relative max-w-4xl mx-auto px-6 sm:px-10 py-16 sm:py-20 text-center">
            <div className="inline-flex items-center gap-2 mb-5 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
              <Store size={13} /> Vendor Registration
            </div>
            <h1 className="display-font text-4xl sm:text-5xl font-semibold leading-tight mb-4">
              APPNA NC Bazaar
            </h1>
            <p className="text-white/70 max-w-xl mx-auto leading-relaxed mb-6">
              At the Annual Banquet &amp; Entertainment — a premium bazaar for event attendees
              and their families to shop during the evening.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-2 text-white/85">
                <CalendarDays size={15} /> Saturday, October 10th
              </span>
              <span className="inline-flex items-center gap-2 text-white/85">
                <Clock size={15} /> 5:00 PM
              </span>
              <span className="inline-flex items-center gap-2 text-white/85">
                <MapPin size={15} /> 201 Harrison Oaks Blvd, Cary, NC27513
              </span>
            </div>
          </div>
        </section>

        {/* ── INTRO STRIP ── */}
        <section className="max-w-4xl mx-auto px-6 sm:px-10 py-12 sm:py-16 text-center">
          <div className="inline-flex h-12 w-12 rounded-xl bg-[#7a1f3d]/10 items-center justify-center text-[#7a1f3d] mb-4">
            <ShoppingBag size={22} />
          </div>
          <h2 className="display-font text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
            Reserve your stall
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            The Bazaar runs throughout the evening alongside dinner and entertainment, giving your
            business direct access to attendees and their families.
          </p>
        </section>

        {/* ── STALL OPTIONS ── */}
        <section className="max-w-4xl mx-auto px-6 sm:px-10 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {STALLS.map((stall) => (
              <div
                key={stall.label}
                className="relative rounded-2xl border-2 bg-white p-7 flex flex-col"
                style={{ borderColor: `${stall.accent}30` }}
              >
                

                <div className="mb-5">
                  <p className="font-semibold text-gray-900 text-lg">{stall.label}</p>
                  <p className="text-3xl font-bold mt-1" style={{ color: stall.accent }}>
                    ${stall.price.toLocaleString()}
                  </p>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {stall.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0" style={{ color: stall.accent }} />
                      {perk}
                    </li>
                  ))}
                </ul>

                <a
                  href="/contact_us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="accent-btn inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white"
                  style={{ background: stall.accent, boxShadow: `0 4px 20px ${stall.accent}40` }}
                >
                  Talk to Us
                </a>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700 flex items-start gap-2.5">
            <Users size={16} className="mt-0.5 flex-shrink-0" />
            <span>
              Space is limited. Stalls are confirmed on a first-come, first-served basis once payment
              is received. You'll get a payment confirmation by email immediately after checkout.
            </span>
          </div>
        </section>

        {/* ── QUESTIONS ── */}
        <section className="bg-gray-50 py-14 sm:py-16 text-center">
          <div className="max-w-2xl mx-auto px-6 sm:px-10">
            <h3 className="font-semibold text-gray-900 mb-2">Questions before you book?</h3>
            <p className="text-sm text-gray-500 mb-4">
              Reach out and our team will help you pick the right stall for your business.
            </p>
            <a
              href="mailto:appnanc@gmail.com"
              className="text-sm font-semibold text-[#7a1f3d] hover:underline"
            >
          
              appnanc@gmail.com
            </a>
          </div>
        </section>

      </main>
    </>
  );
}