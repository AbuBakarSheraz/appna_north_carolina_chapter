import Link from "next/link";
import {
  Star,
  Medal,
  Award,
  Trophy,
  Monitor,
  BookOpen,
  Mail,
  Users,
  Presentation,
  Ticket,
  CheckCircle2,
} from "lucide-react";

const packages = [
  {
    tier: "Platinum",
    price: "$10,000",
    color: "#7a1f3d",
    bg: "#7a1f3d",
    lightBg: "#fdf2f5",
    border: "#7a1f3d",
    icon: Trophy,
    badge: "Most Prestigious",
    perks: [
      { icon: Presentation, label: "10-minute stage presentation" },
      { icon: Monitor, label: "Advertisement on event screen" },
      { icon: Users, label: "Dedicated booth space" },
      { icon: BookOpen, label: "Featured in event brochure" },
      { icon: Mail, label: "Included in promotional emails" },
      { icon: Ticket, label: "3 complimentary event tickets" },
    ],
  },
  {
    tier: "Gold",
    price: "$5,000",
    color: "#b8860b",
    bg: "#b8860b",
    lightBg: "#fffdf0",
    border: "#b8860b",
    icon: Star,
    badge: "Popular Choice",
    perks: [
      { icon: Presentation, label: "5-minute stage time" },
      { icon: Monitor, label: "Advertisement on event screen" },
      { icon: Users, label: "Dedicated booth space" },
      { icon: BookOpen, label: "Featured in event brochure" },
      { icon: Mail, label: "Included in promotional emails" },
      { icon: Ticket, label: "2 complimentary event tickets" },
    ],
  },
  {
    tier: "Silver",
    price: "$3,000",
    color: "#6b7280",
    bg: "#6b7280",
    lightBg: "#f9fafb",
    border: "#6b7280",
    icon: Medal,
    badge: null,
    perks: [
      { icon: Monitor, label: "Advertisement on event screen" },
      { icon: Users, label: "Booth presence" },
      { icon: BookOpen, label: "Mention in event brochure" },
      { icon: Mail, label: "Included in promotional emails" },
      { icon: Ticket, label: "1 complimentary event ticket" },
    ],
  },
  {
    tier: "Bronze",
    price: "$1,000",
    color: "#92400e",
    bg: "#92400e",
    lightBg: "#fffbf5",
    border: "#92400e",
    icon: Award,
    badge: null,
    perks: [
      { icon: Users, label: "Booth presence" },
      { icon: Ticket, label: "1 complimentary event ticket" },
    ],
  },
];

const benefits = [
  {
    title: "Brand Visibility & Promotion",
    description:
      "Showcase your brand through event advertising, email inclusion, and brochure placement reaching hundreds of healthcare professionals.",
    icon: Monitor,
  },
  {
    title: "Direct Audience Engagement",
    description:
      "Connect with attendees through dedicated booth engagement and stage presentation sessions in front of a highly qualified audience.",
    icon: Users,
  },
  {
    title: "Exclusive Event Access",
    description:
      "Enjoy premium access with complimentary tickets and on-site recognition at the APPNA NC Annual Banquet & Entertainment 2026.",
    icon: Ticket,
  },
];

export const metadata = {
  title: "Sponsorship | APPNA NC Annual Banquet & Entertainment 2026",
  description:
    "Sponsor the APPNA North Carolina Annual Banquet & Entertainment 2026. Choose from Platinum, Gold, Silver, or Bronze packages and connect physicians and healthcare professionals.",
};

export default function SponsorshipPage() {
  return (
    <div className="bg-[#f8f9fb] min-h-screen">

      {/* ── Hero Banner ── */}
      <section className="relative bg-[#7a1f3d] overflow-hidden py-16 sm:py-20">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative px-6 sm:px-10 lg:px-18 text-center max-w-3xl mx-auto">
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-white/15 text-white text-xs font-semibold uppercase tracking-widest">
            October 10th, 2026 · Embassy Suites, Raleigh
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Sponsorship Opportunities
          </h1>
          <p className="mt-5 text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Partner with APPNA North Carolina and connect your brand with {" "}
            <span className="text-white font-semibold">physicians and their families</span>{" "}
            at our Annual Banquet &amp; Entertainment 2026.
          </p>
        </div>
      </section>

      {/* ── Why Sponsor ── */}
      <section className="px-6 sm:px-10 lg:px-18 py-14">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#7a1f3d]">
            Why Sponsor Us?
          </h2>
          <p className="mt-4 text-gray-600">
            Gain meaningful visibility and forge lasting connections with North
            Carolina's most distinguished medical community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col"
              >
                <div className="mb-4 w-12 h-12 rounded-xl bg-[#7a1f3d]/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#7a1f3d]" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {b.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed grow">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Packages ── */}
      <section className="px-6 sm:px-10 lg:px-18 pb-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#7a1f3d]">
            Sponsorship Packages
          </h2>
          <p className="mt-4 text-gray-600">
            Choose the tier that best fits your goals. Every package delivers
            real impact for your brand.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <div
                key={pkg.tier}
                className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                style={{ borderTop: `4px solid ${pkg.color}` }}
              >
                {/* Badge */}
                {pkg.badge && (
                  <div
                    className="absolute top-4 right-4 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: pkg.color }}
                  >
                    {pkg.badge}
                  </div>
                )}

                {/* Header */}
                <div className="p-6 pb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${pkg.color}18` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: pkg.color }} />
                  </div>
                  <h3
                    className="text-xl font-bold mb-1"
                    style={{ color: pkg.color }}
                  >
                    {pkg.tier}
                  </h3>
                  <p className="text-3xl font-extrabold text-gray-900">
                    {pkg.price}
                  </p>
                </div>

                {/* Divider */}
                <div className="mx-6 border-t border-gray-100" />

                {/* Perks */}
                <div className="p-6 pt-5 flex flex-col grow">
                  <ul className="space-y-3 grow">
                    {pkg.perks.map((perk) => {
                      const PerkIcon = perk.icon;
                      return (
                        <li key={perk.label} className="flex items-start gap-3">
                          <CheckCircle2
                            className="w-4 h-4 mt-0.5 shrink-0"
                            style={{ color: pkg.color }}
                          />
                          <span className="text-sm text-gray-700 leading-snug">
                            {perk.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* CTA */}
                  <Link
                    href="/sponsorship"
                    className="mt-8 block text-center rounded-xl py-3 px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: pkg.color }}
                  >
                    Buy Sponsorship
                  </Link>
                  
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Bottom CTA Strip ── */}
      <section className="bg-[#7a1f3d]/5 border-t border-[#7a1f3d]/10 py-12 px-6 sm:px-10 lg:px-18 text-center">
        <h3 className="text-2xl font-semibold text-[#7a1f3d] mb-3">
          Have Questions About Sponsoring?
        </h3>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Our team is happy to walk you through the packages and tailor a
          sponsorship experience that works for you.
        </p>
        <Link
          href="/contact_us"
          className="inline-flex items-center gap-2 bg-[#7a1f3d] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#5f1730] transition"
        >
          <Mail size={18} />
          Get in Touch
        </Link>
        <Link
          href="/sponsorship"
          className="inline-flex items-center gap-2 bg-[#7a1f3d] text-white px-7 py-3 mx-4 rounded-xl font-semibold hover:bg-[#5f1730] transition"
        >
          <Mail size={18} />
          Buy Sponsorship
        </Link>
      </section>
    </div>
  );
}