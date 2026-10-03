import Link from "next/link";
import { Award, CheckCircle2, Mail, Medal, Monitor, Star, Ticket, Trophy, Users } from "lucide-react";
import PageHeader from "../../../components/shared/PageHeader";
import Section, { SectionCard, SectionGrid } from "../../../components/shared/Section";

export const metadata = {
  title: "Sponsorship | APPNA NC Annual Banquet, Entertainment & CME 2026",
  description: "Sponsor the APPNA NC Annual Banquet, Entertainment & CME 2026. Choose from Platinum, Gold, Silver, or Bronze packages and connect physicians and healthcare professionals.",
};

// Edit the packages here: prices, perks, and each tier's colors
const packages = [
  {
    tier: "Platinum",
    price: "$10,000",
    icon: Trophy,
    badge: "Most Prestigious",
    border: "border-t-grove-dark",
    text: "text-grove-dark",
    soft: "bg-grove-dark/10",
    solid: "bg-grove-dark",
    perks: [
      "10-minute stage presentation",
      "Advertisement on event screen",
      "Dedicated booth space",
      "Featured in event brochure",
      "Included in promotional emails",
      "3 complimentary event tickets",
    ],
  },
  {
    tier: "Gold",
    price: "$5,000",
    icon: Star,
    badge: "Popular Choice",
    border: "border-t-amber-600",
    text: "text-amber-700",
    soft: "bg-amber-600/10",
    solid: "bg-amber-700",
    perks: [
      "5-minute stage time",
      "Advertisement on event screen",
      "Dedicated booth space",
      "Featured in event brochure",
      "Included in promotional emails",
      "2 complimentary event tickets",
    ],
  },
  {
    tier: "Silver",
    price: "$3,000",
    icon: Medal,
    badge: null,
    border: "border-t-slate-500",
    text: "text-slate-600",
    soft: "bg-slate-500/10",
    solid: "bg-slate-600",
    perks: [
      "Advertisement on event screen",
      "Booth presence",
      "Mention in event brochure",
      "Included in promotional emails",
      "1 complimentary event ticket",
    ],
  },
  {
    tier: "Bronze",
    price: "$1,000",
    icon: Award,
    badge: null,
    border: "border-t-orange-800",
    text: "text-orange-800",
    soft: "bg-orange-800/10",
    solid: "bg-orange-800",
    perks: [
      "Booth presence",
      "1 complimentary event ticket",
    ],
  },
];

const benefits = [
  {
    title: "Brand Visibility & Promotion",
    description: "Showcase your brand through event advertising, email inclusion, and brochure placement reaching hundreds of healthcare professionals.",
    icon: Monitor,
  },
  {
    title: "Direct Audience Engagement",
    description: "Connect with attendees through dedicated booth engagement and stage presentation sessions in front of a highly qualified audience.",
    icon: Users,
  },
  {
    title: "Exclusive Event Access",
    description: "Enjoy premium access with complimentary tickets and on-site recognition at the APPNA NC Annual Banquet, Entertainment & CME 2026.",
    icon: Ticket,
  },
];

// Edit these two lines to restyle the page buttons
const primaryButton = "inline-flex items-center gap-2 rounded-full bg-grove px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-grove-dark";
const outlineButton = "inline-flex items-center gap-2 rounded-full border border-grove px-7 py-3 text-sm font-semibold uppercase tracking-wide text-grove transition hover:bg-grove-soft";

export default function SponsorshipPage() {
  return (
    <>
      <PageHeader
        eyebrow="October 10th, 2026 · Embassy Suites, Raleigh"
        title="Sponsorship Opportunities"
        subtitle="Partner with APPNA North Carolina and connect your brand with physicians and their families at our Annual Banquet & Entertainment 2026."
      />

      {/* Why sponsor */}
      <Section
        flushTop
        eyebrow="Why sponsor"
        title="Why Sponsor Us?"
        intro="Gain meaningful visibility and forge lasting connections with North Carolina’s most distinguished medical community."
      >
        <SectionGrid>
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <SectionCard key={benefit.title}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-grove-soft text-grove">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-medium text-grove-dark">{benefit.title}</h3>
                <p className="mt-3 grow text-sm leading-6 text-ink-soft">{benefit.description}</p>
              </SectionCard>
            );
          })}
        </SectionGrid>
      </Section>

      {/* Packages */}
      <Section
        tone="soft"
        eyebrow="Packages"
        title="Sponsorship Packages"
        intro="Choose the tier that best fits your goals. Every package delivers real impact for your brand."
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {packages.map((pkg) => {
            const Icon = pkg.icon;

            return (
              <div
                key={pkg.tier}
                className={`relative flex h-full flex-col overflow-hidden rounded-xl border border-t-4 border-line bg-card shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${pkg.border}`}
              >
                {/* Badge */}
                {pkg.badge ? (
                  <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ${pkg.solid}`}>
                    {pkg.badge}
                  </span>
                ) : null}

                {/* Tier and price */}
                <div className="p-6 pb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${pkg.soft} ${pkg.text}`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className={`mt-4 font-display text-3xl font-medium ${pkg.text}`}>{pkg.tier}</h3>
                  <p className="mt-1 text-3xl font-bold text-ink">{pkg.price}</p>
                </div>

                {/* Perks and button */}
                <div className="mx-6 flex grow flex-col border-t border-line pb-6 pt-5">
                  <ul className="grow space-y-3">
                    {pkg.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-3 text-sm leading-6 text-ink-soft">
                        <CheckCircle2 className={`mt-1 h-4 w-4 shrink-0 ${pkg.text}`} aria-hidden="true" />
                        {perk}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/sponsorship"
                    className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90 ${pkg.solid}`}
                  >
                    Buy Sponsorship
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Questions */}
      <Section
        eyebrow="Need help?"
        title="Have Questions About Sponsoring?"
        intro="Our team is happy to walk you through the packages and tailor a sponsorship experience that works for you."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/contact_us" className={primaryButton}>
            <Mail size={18} aria-hidden="true" />
            Get in Touch
          </Link>
          <Link href="/sponsorship" className={outlineButton}>
            <Ticket size={18} aria-hidden="true" />
            Buy Sponsorship
          </Link>
        </div>
      </Section>
    </>
  );
}