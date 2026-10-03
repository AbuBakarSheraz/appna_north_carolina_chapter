import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronDown, Clock, MapPin, Music, Store, Ticket, UtensilsCrossed } from "lucide-react";

export const metadata = {
  title: "Annual Banquet, Entertainment & CME 2026 | APPNA NC",
  description: "Join APPNA North Carolina for the Annual Banquet, Entertainment & CME on Saturday, October 10, 2026 in Cary, NC, with dinner, the APPNA NC Bazaar, and a live performance by Amanat Ali.",
};

const highlights = [
  { icon: UtensilsCrossed, title: "Gala Dinner", desc: "A full seated dinner for every ticket holder." },
  { icon: Music, title: "Amanat Ali Live", desc: "A live musical performance to close out the night." },
  { icon: Store, title: "APPNA NC Bazaar", desc: "Local stalls: fashion, food, art, and more." },
];

const bazaarCategories = [
  { label: "Fashion and Jewelry", desc: "Local boutiques and designers showcasing apparel and accessories." },
  { label: "Arts and Home", desc: "Art work, decor, and gift items from independent sellers." },
  { label: "Community Groups", desc: "Local organizations and initiatives with tables at the event." },
];

const faqs = [
  {
    q: "Where can I buy tickets?",
    a: "Tickets are available exclusively through appnanc.org/events. Purchasing there confirms your seat for dinner and reserves your place for the evening.",
  },
  {
    q: "Is the Bazaar open to ticket holders only?",
    a: "The Bazaar is included with your event ticket and runs throughout the evening, alongside dinner and the performance.",
  },
  {
    q: "Do I need a separate ticket for the performance?",
    a: "No, the Amanat Ali performance is included as part of your Banquet ticket.",
  },
];

// Edit these lines to restyle the whole page
const lightButton = "inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold uppercase tracking-wide text-grove-dark transition hover:bg-grove-soft";
const outlineButton = "inline-flex items-center gap-2 rounded-full border border-white/50 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/10";
const eyebrowLight = "text-xs font-semibold uppercase tracking-widest text-white/85";
const eyebrowDark = "text-xs font-semibold uppercase tracking-widest text-ridge";
const sectionTitle = "mt-3 font-display text-3xl font-medium leading-tight sm:text-4xl";

export default function BanquetEventPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-linear-to-br from-grove-dark via-grove-dark to-grove text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-3xl">
            <p className={eyebrowLight}>APPNA North Carolina Presents</p>
            <h1 className="mt-3 font-display text-5xl font-medium leading-tight sm:text-6xl lg:text-7xl">The Annual Banquet &amp; Entertainment</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
              An evening of community, celebration, and live music, featuring dinner, the APPNA NC Bazaar, and a special performance by <strong className="text-white">Amanat Ali</strong>.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/85">
              <span className="inline-flex items-center gap-2"><CalendarDays size={16} aria-hidden="true" /> Saturday, Oct 10, 2026</span>
              <span className="inline-flex items-center gap-2"><Clock size={16} aria-hidden="true" /> 5:00 PM</span>
              <span className="inline-flex items-center gap-2"><MapPin size={16} aria-hidden="true" /> 201 Harrison Oaks Blvd, Cary, NC 27513</span>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/events" className={lightButton}>
                <Ticket size={16} aria-hidden="true" /> Get Tickets
              </Link>
              <a href="#included" className={outlineButton}>
                What’s Included <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHT CARDS (overlap the hero) */}
      <section id="included" className="relative z-10 mx-auto -mt-10 max-w-7xl px-5 pb-12 sm:-mt-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="rounded-xl border border-line bg-card p-6 shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-grove-soft text-grove">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-display text-2xl font-medium text-grove-dark">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* AMANAT ALI */}
      <section className="bg-grove-dark text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 py-16 sm:px-6 sm:py-20 md:grid-cols-2 lg:px-8">
          <div className="relative mx-auto h-72 w-72 overflow-hidden rounded-2xl border border-white/20 md:mx-0">
            <Image src="/concert.jpg" alt="Amanat Ali performing" fill sizes="288px" className="object-cover" />
          </div>

          <div>
            <p className={eyebrowLight}>Special Performance</p>
            <h2 className={sectionTitle}>Amanat Ali, Live</h2>
            <p className="mt-4 leading-7 text-white/85">
              Closing out the evening, acclaimed vocalist Amanat Ali brings his signature sound to the APPNA NC Banquet stage, a highlight moment for the whole community to enjoy together.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 text-sm text-white/85">
              <Music size={15} aria-hidden="true" /> Performance included with every Banquet ticket
            </p>
          </div>
        </div>
      </section>

      {/* BAZAAR */}
      <section className="bg-linear-to-br from-ridge to-grove-dark text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/90">Open All Evening</p>
            <h2 className={sectionTitle}>The APPNA NC Bazaar</h2>
            <p className="mt-4 leading-7 text-white/90">
              Browse stalls from local businesses and community vendors throughout the night, open before dinner and staying open through the performance.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {bazaarCategories.map((cat) => (
              <div key={cat.label} className="rounded-xl border border-white/25 bg-white/10 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <Store size={18} aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{cat.label}</h3>
                <p className="mt-2 text-sm leading-6 text-white/90">{cat.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-white/90">
            Interested in hosting a stall? Contact appnanc@gmail.com for vendor details.
          </p>
        </div>
      </section>

      {/* VENUE */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 py-16 sm:px-6 sm:py-20 md:grid-cols-2 lg:px-8">
        <div>
          <p className={eyebrowDark}>Venue</p>
          <h2 className={`${sectionTitle} text-grove-dark`}>Embassy Suites By Hilton, North Carolina</h2>

          <div className="mt-6 space-y-3 text-sm text-ink-soft">
            <p className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-grove" aria-hidden="true" /> 201 Harrison Oaks Blvd, Cary, NC 27513</p>
            <p className="flex items-start gap-2"><CalendarDays size={16} className="mt-0.5 shrink-0 text-grove" aria-hidden="true" /> Saturday, October 10, 2026</p>
            <p className="flex items-start gap-2"><Clock size={16} className="mt-0.5 shrink-0 text-grove" aria-hidden="true" /> Doors open 5:00 PM</p>
          </div>
        </div>

        <a
          href="https://share.google/DV86cBeBwkaENtZe0"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex aspect-video flex-col items-center justify-center gap-3 rounded-xl border border-line bg-card shadow-sm transition hover:border-grove"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-grove-soft text-grove">
            <MapPin size={22} aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-ink">Open in Google Maps</p>
          <p className="text-xs text-ink-soft">Get directions to the venue</p>
        </a>
      </section>

      {/* FAQ (no JavaScript needed: uses the browser's built-in details/summary) */}
      <section className="bg-grove-soft py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
          <p className={eyebrowDark}>Good to Know</p>
          <h2 className={`${sectionTitle} text-grove-dark`}>Frequently asked questions</h2>

          <div className="mt-8 rounded-xl border border-line bg-card px-6 shadow-sm">
            {faqs.map((faq) => (
              <details key={faq.q} className="group border-b border-line last:border-b-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-semibold text-ink sm:text-base">
                  {faq.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-grove transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="pb-5 pr-8 text-sm leading-6 text-ink-soft">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING BAND */}
      <section className="bg-linear-to-br from-grove-dark to-grove text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-14 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div className="max-w-xl">
            <h2 className={sectionTitle}>Join us for the evening</h2>
            <p className="mt-3 leading-7 text-white/85">
              Dinner, the Bazaar, and a live performance from Amanat Ali: one ticket, one evening, the whole community together.
            </p>
          </div>
          <Link href="/events" className={lightButton}>
            <Ticket size={16} aria-hidden="true" /> Get Your Tickets
          </Link>
        </div>
      </section>
    </>
  );
}