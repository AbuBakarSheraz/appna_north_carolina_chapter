'use client';

import { useState } from 'react';
import {
  CalendarDays, Clock, MapPin, Mic2, UtensilsCrossed, Store,
  Ticket, ChevronDown, Music, Sparkles, ArrowRight,
} from 'lucide-react';
import Image from 'next/image';
// import concert.jpg from '../../../public/concert.jpg';
const SCHEDULE = [
  { time: '[REPLACE: 5:00 PM]', title: 'Doors Open and Bazaar Preview', desc: 'Arrive early to browse the APPNA NC Bazaar stalls before dinner service begins.', icon: Store },
  { time: '[REPLACE: 6:30 PM]', title: 'Gala Dinner Service', desc: 'A full multi-course dinner served to all registered guests.', icon: UtensilsCrossed },
  { time: '[REPLACE: 8:00 PM]', title: 'Welcome and Community Remarks', desc: 'A short address from APPNA NC leadership on the year\'s community impact.', icon: Sparkles },
  { time: '[REPLACE: 8:30 PM]', title: 'Live Performance - Amanat Ali', desc: 'An evening of live music from acclaimed vocalist Amanat Ali.', icon: Music },
  { time: '[REPLACE: 10:00 PM]', title: 'Bazaar Continues and Closing', desc: 'Stalls remain open as the evening winds down.', icon: Store },
];

const BAZAAR_CATEGORIES = [
  { label: 'Fashion and Jewelry', desc: 'Local boutiques and designers showcasing apparel and accessories.' },
  { label: 'Food and Sweets', desc: 'Desserts, snacks, and specialty treats from community vendors.' },
  { label: 'Arts and Home', desc: 'Handmade goods, decor, and gift items from independent sellers.' },
  { label: 'Community Groups', desc: 'Local organizations and initiatives with tables at the event.' },
];

const FAQS = [
  {
    q: 'Where can I buy tickets?',
    a: 'Tickets are available exclusively through appnanc.org/events. Purchasing there confirms your seat for dinner and reserves your place for the evening.',
  },
  {
    q: 'Is the Bazaar open to ticket holders only?',
    a: 'The Bazaar is included with your event ticket and runs throughout the evening, alongside dinner and the performance.',
  },
  {
    q: 'Do I need a separate ticket for the performance?',
    a: 'No, the Amanat Ali performance is included as part of your Banquet ticket.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-semibold text-gray-900 text-sm sm:text-base">{q}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-[#7a1f3d] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm text-gray-500 leading-relaxed pr-8">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function BanquetEventPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');

        .banquet-root { font-family: 'Outfit', sans-serif; }
        .display-font { font-family: 'Cormorant Garamond', serif; }

        .panel-bg {
          background: linear-gradient(160deg, #4a0e22 0%, #7a1f3d 50%, #9b3855 100%);
        }
        .bazaar-bg {
          background: linear-gradient(160deg, #052e16 0%, #14532d 55%, #166534 100%);
        }
        .noise-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .fade-up { animation: fadeUp 0.6s cubic-bezier(.16,1,.3,1) both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }

        .accent-btn {
          background: linear-gradient(135deg, #7a1f3d 0%, #9b2d51 100%);
          box-shadow: 0 4px 20px rgba(122,31,61,0.35);
          transition: all 0.25s ease;
        }
        .accent-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(122,31,61,0.45); }

        .timeline-line {
          background: linear-gradient(to bottom, #7a1f3d 0%, #7a1f3d 100%);
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up { animation: none; }
        }
      `}</style>

      <main className="banquet-root bg-white">

        <section className="panel-bg noise-overlay relative overflow-hidden text-white">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5" />

          <div className="relative max-w-5xl mx-auto px-6 sm:px-10 py-20 sm:py-28 text-center">
            <p className="fade-up text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-white/60 mb-5">
              APPNA North Carolina Presents
            </p>
            <h1 className="fade-up display-font text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.05] mb-6">
              The Annual Banquet 
<br />& Entertainment
            </h1>
            <p className="fade-up text-white/70 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10" style={{ animationDelay: '0.1s' }}>
              An evening of community, celebration, and live music, featuring dinner,
              the APPNA NC Bazaar, and a special performance by <strong className="text-white">Amanat Ali</strong>.
            </p>

            <div className="fade-up flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-10 text-sm" style={{ animationDelay: '0.15s' }}>
              <span className="inline-flex items-center gap-2 text-white/85">
                <CalendarDays size={16} /> Saturday, Oct 10, 2026
              </span>
              <span className="inline-flex items-center gap-2 text-white/85">
                <Clock size={16} />  5:00 PM
              </span>
              <span className="inline-flex items-center gap-2 text-white/85">
                <MapPin size={16} />201 Harrison Oaks Blvd, Cary, NC27513
              </span>
            </div>

            <div className="fade-up flex flex-col sm:flex-row items-center justify-center gap-3" style={{ animationDelay: '0.2s' }}>
              <a
                href="https://appnanc.org/events"
                className="accent-btn inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold tracking-wide"
              >
                <Ticket size={16} /> Get Tickets
              </a>
              <a
                href="#schedule"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-8 py-4 text-sm font-semibold tracking-wide text-white/90 hover:bg-white/10 transition-colors"
              >
                See the Schedule <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 sm:px-10 -mt-10 sm:-mt-14 relative z-10 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: UtensilsCrossed, title: 'Gala Dinner', desc: 'A full seated dinner for every ticket holder.', accent: '#7a1f3d' },
              { icon: Music, title: 'Amanat Ali Live', desc: 'A live musical performance to close out the night.', accent: '#7a1f3d' },
              { icon: Store, title: 'APPNA NC Bazaar', desc: 'Local stalls: fashion, food, art, and more.', accent: '#166534' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-6">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${item.accent}12`, color: item.accent }}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="schedule" className="max-w-4xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#7a1f3d] mb-2">The Evening</p>
            <h2 className="display-font text-3xl sm:text-4xl font-semibold text-gray-900">How the night unfolds</h2>
          </div>

          <div className="relative pl-8 sm:pl-10">
            <div className="timeline-line absolute left-[11px] sm:left-[13px] top-2 bottom-2 w-px opacity-15" />
            <div className="space-y-10">
              {SCHEDULE.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="relative">
                    <div className="absolute -left-8 sm:-left-10 top-0 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-[#7a1f3d] flex items-center justify-center ring-4 ring-white">
                      <Icon size={12} className="text-white" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#7a1f3d] mb-1">{item.time}</p>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-lg">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="panel-bg noise-overlay relative overflow-hidden text-white">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 py-20 sm:py-24 grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 items-center">
            <div className="flex justify-center md:justify-start">
  <div className="relative h-56 w-56 sm:h-72 sm:w-72 rounded-2xl bg-white/10 border border-white/15 overflow-hidden backdrop-blur-sm">
    <Image src="/concert.jpg" alt="Amanat Ali performing" fill className="object-cover" />
  </div>
</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Special Performance</p>
              <h2 className="display-font text-3xl sm:text-4xl font-semibold mb-4">Amanat Ali, Live</h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Closing out the evening, acclaimed vocalist Amanat Ali brings his signature sound
                to the APPNA NC Banquet stage, a highlight moment for the whole community to enjoy together.
                expand with a short artist bio and notable songs or credits.
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-white/60">
                <Music size={15} /> Performance included with every Banquet ticket
              </div>
            </div>
          </div>
        </section>

        <section className="bazaar-bg noise-overlay relative overflow-hidden text-white">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 py-20 sm:py-24">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Open All Evening</p>
              <h2 className="display-font text-3xl sm:text-4xl font-semibold mb-3">The APPNA NC Bazaar</h2>
              <p className="text-white/70 max-w-xl mx-auto leading-relaxed">
                Browse stalls from local businesses and community vendors throughout the night,
                open before dinner and staying open through the performance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BAZAAR_CATEGORIES.map((cat) => (
                <div key={cat.label} className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm p-6">
                  <div className="h-9 w-9 rounded-lg bg-white/15 flex items-center justify-center mb-3">
                    <Store size={16} />
                  </div>
                  <h3 className="font-semibold mb-1">{cat.label}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-white/50 text-xs mt-8">
              Interested in hosting a stall? Contact appnanc@gmail.com for vendor details.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 sm:px-10 py-20 sm:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#7a1f3d] mb-2">Venue</p>
              <h2 className="display-font text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
                Embassy Suites By Hilton, North Carolina
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 text-[#7a1f3d] flex-shrink-0" />
                  201 Harrison Oaks Blvd, Cary, NC27513
                </p>
                <p className="flex items-start gap-2">
                  <CalendarDays size={16} className="mt-0.5 text-[#7a1f3d] flex-shrink-0" />
                  Saturday, October 10, 2026
                </p>
                <p className="flex items-start gap-2">
                  <Clock size={16} className="mt-0.5 text-[#7a1f3d] flex-shrink-0" />
                  Doors open 5:00 PM
                </p>
              </div>
            </div>
            <a
            href="https://share.google/DV86cBeBwkaENtZe0"
  target="_blank"
  rel="noopener noreferrer"
  className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm aspect-video bg-gray-50 flex flex-col items-center justify-center gap-3 hover:border-[#7a1f3d]/30 transition-colors"
>
  <div className="h-12 w-12 rounded-xl bg-[#7a1f3d]/10 flex items-center justify-center text-[#7a1f3d] group-hover:bg-[#7a1f3d]/15 transition-colors">
    <MapPin size={22} />
  </div>
  <p className="text-sm font-semibold text-gray-700">Open in Google Maps</p>
  <p className="text-xs text-gray-400">Get directions to the venue</p>
</a>
          </div>
        </section>

        <section className="bg-gray-50 py-20 sm:py-24">
          <div className="max-w-3xl mx-auto px-6 sm:px-10">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[#7a1f3d] mb-2">Good to Know</p>
              <h2 className="display-font text-3xl sm:text-4xl font-semibold text-gray-900">Frequently asked questions</h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 sm:px-8">
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

        <section className="panel-bg noise-overlay relative overflow-hidden text-white text-center py-20 sm:py-24">
          <div className="max-w-2xl mx-auto px-6 sm:px-10">
            <h2 className="display-font text-3xl sm:text-4xl font-semibold mb-4">Join us for the evening</h2>
            <p className="text-white/70 mb-8 leading-relaxed">
              Dinner, the Bazaar, and a live performance from Amanat Ali: one ticket, one evening,
              the whole community together.
            </p>
            <a
              href="https://appnanc.org/events"
              className="accent-btn inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold tracking-wide"
            >
              <Ticket size={16} /> Get Your Tickets
            </a>
          </div>
        </section>

      </main>
    </>
  );
}