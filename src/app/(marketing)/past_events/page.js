import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import PageHeader from "../../../components/shared/PageHeader";
import Section from "../../../components/shared/Section";

export const metadata = {
  title: "Past Events | APPNA NC 2022–2024 Memories",
  description: "Explore archived events of the APPNA North Carolina chapter, including professional, cultural, and community gatherings from 2022 to 2024. Relive our chapter's milestones, celebrations, and initiatives that strengthened our community as one family.",
};

const pastEvents = [
  {
    title: "Meet & Greet",
    href: "/past_events/meet",
    date: "7-Feb-2026",
    location: "The Palm, North Carolina",
    image: "/future_events/meet.jpeg",
    description: "An informal evening gathering bringing together physicians and healthcare professionals to connect, network, and build meaningful relationships in a relaxed and welcoming environment.",
  },
  {
    title: "Pickleball Tournament 2026",
    href: "/past_events/pickleball_tournament",
    date: "08-March-2026",
    location: "North Carolina",
    image: "/past_events/pickleBall_poster.jpeg",
    description: "An informal evening gathering bringing together physicians and healthcare professionals to connect, network, and build meaningful relationships in a relaxed and welcoming environment.",
  },
];

// Edit this line to restyle every event card
const eventCard = "group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-card shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md";

export default function PastEventsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Memories"
        title="Past Events"
        subtitle="Revisit the professional, cultural, and community gatherings that have brought our chapter together."
      />

      <Section flushTop>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pastEvents.map((event) => (
            <div key={event.href} className={eventCard}>
              {/* Image */}
              <div className="relative h-52 overflow-hidden bg-grove-soft">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-2xl font-medium text-grove-dark">{event.title}</h3>

                <div className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
                  <CalendarDays className="h-4 w-4 text-grove" aria-hidden="true" />
                  {event.date}
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
                  <MapPin className="h-4 w-4 text-grove" aria-hidden="true" />
                  {event.location}
                </div>

                <p className="mt-3 line-clamp-4 text-sm leading-6 text-ink-soft">{event.description}</p>

                <div className="mt-auto pt-6">
                  <Link href={event.href} className="text-sm font-semibold uppercase tracking-wide text-grove transition hover:text-grove-dark">
                    Learn More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}