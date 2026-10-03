import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock, MapPin, Users } from "lucide-react";
import PageHeader from "../../../components/shared/PageHeader";
import Section, { SectionCard } from "../../../components/shared/Section";

export const metadata = {
  title: "Vendor Registration | APPNA NC Bazaar",
  description: "Reserve a stall at the APPNA NC Bazaar during the Annual Banquet & Entertainment on Saturday, October 10, 2026 in Cary, NC. Choose a Standard or Premium stall.",
};

// Edit the stalls here: names, prices, perks, and colors
const stalls = [
  {
    label: "Standard Stall",
    price: 500,
    iconColor: "text-grove",
    priceColor: "text-grove-dark",
    button: "bg-grove hover:bg-grove-dark",
    perks: [
      "General floor placement",
      "No complimentary Banquet ticket",
      "1 person per booth",
      "Additional ticketed person allowed",
    ],
  },
  {
    label: "Premium Stall",
    price: 1000,
    iconColor: "text-ridge",
    priceColor: "text-ridge",
    button: "bg-ridge hover:opacity-90",
    perks: [
      "Priority placement near the main entrance",
      "One complimentary Banquet ticket",
      "1 person per booth",
      "Additional ticketed person allowed",
    ],
  },
];

export default function VendorRegistrationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Vendor Registration"
        title="APPNA NC Bazaar"
        subtitle="At the Annual Banquet & Entertainment — a premium bazaar for event attendees and their families to shop during the evening."
      />

      <Section
        flushTop
        eyebrow="Reserve your stall"
        title="Choose your stall"
        intro="The Bazaar runs throughout the evening alongside dinner and entertainment, giving your business direct access to attendees and their families."
      >
        {/* Event details */}
        <div className="mb-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-2"><CalendarDays size={16} className="text-grove" aria-hidden="true" /> Saturday, October 10, 2026</span>
          <span className="inline-flex items-center gap-2"><Clock size={16} className="text-grove" aria-hidden="true" /> 5:00 PM</span>
          <span className="inline-flex items-center gap-2"><MapPin size={16} className="text-grove" aria-hidden="true" /> 201 Harrison Oaks Blvd, Cary, NC 27513</span>
        </div>

        {/* Stall options */}
        <div className="grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {stalls.map((stall) => (
            <SectionCard key={stall.label} className="p-7">
              <p className="font-display text-2xl font-medium text-grove-dark">{stall.label}</p>
              <p className={`mt-1 text-4xl font-bold ${stall.priceColor}`}>${stall.price.toLocaleString()}</p>

              <ul className="mt-6 grow space-y-3">
                {stall.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm leading-6 text-ink-soft">
                    <CheckCircle2 size={16} className={`mt-1 shrink-0 ${stall.iconColor}`} aria-hidden="true" />
                    {perk}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact_us"
                className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition ${stall.button}`}
              >
                Talk to Us
              </Link>
            </SectionCard>
          ))}
        </div>

        {/* Notice */}
        <div className="mt-8 flex max-w-4xl items-start gap-3 rounded-xl border border-line bg-grove-soft px-5 py-4 text-sm leading-6 text-ink">
          <Users size={18} className="mt-0.5 shrink-0 text-grove" aria-hidden="true" />
          <span>
            Space is limited. Stalls are confirmed on a first-come, first-served basis once payment is received. You’ll get a payment confirmation by email immediately after checkout.
          </span>
        </div>
      </Section>

      <Section
        tone="soft"
        eyebrow="Need help?"
        title="Questions before you book?"
        intro="Reach out and our team will help you pick the right stall for your business."
      >
        <a href="mailto:appnanc@gmail.com" className="text-sm font-semibold text-grove transition hover:text-grove-dark">
          appnanc@gmail.com
        </a>
      </Section>
    </>
  );
}