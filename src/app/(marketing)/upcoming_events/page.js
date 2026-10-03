import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import FadeInCard from "../../../components/FadeInCard";
import PageHeader from "../../../components/shared/PageHeader";
import Section from "../../../components/shared/Section";
import { events } from "../../../data/events";

export const metadata = {
  title: "Upcoming Events | Connecting APPNA NC as One Family",
  description: "Explore APPNA North Carolina’s upcoming professional, cultural, and community events designed to bring physicians and families together, strengthen relationships, promote wellness, and foster mentorship in alignment with our 2026 theme, “Connecting Our Chapter as a Family.”",
};

// Edit this line to restyle every event card
const eventCard = "group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-card shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md";

export default function UpcomingEvents() {
  return (
    <>
      <PageHeader
        eyebrow="Mark your calendar"
        title="Upcoming Events"
        subtitle="Discover our upcoming professional, cultural, and community-driven events designed to connect, inspire, and lead."
      />

      <Section flushTop>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <FadeInCard key={event.href} index={index} className={eventCard}>
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
            </FadeInCard>
          ))}
        </div>
      </Section>
    </>
  );
}