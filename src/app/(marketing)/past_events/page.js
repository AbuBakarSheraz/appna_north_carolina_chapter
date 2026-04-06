import React from "react";
import { CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";

// ✅ Bug 1 Fixed: metadata at the top, before the component
export const metadata = {
  title: "Past Events | APPNA NC 2022–2024 Memories",
  description:
    "Explore archived events of the APPNA North Carolina chapter, including professional, cultural, and community gatherings from 2022 to 2024. Relive our chapter's milestones, celebrations, and initiatives that strengthened our community as one family.",
};

const pastEvents = [
  {
    title: "Meet & Greet",
    href: "/past_events/meet",
    date: "7-Feb-2026",
    location: "The Palm, North Carolina",
    image: "/future_events/meet.jpeg",
    description:
      "An informal evening gathering bringing together physicians and healthcare professionals to connect, network, and build meaningful relationships in a relaxed and welcoming environment.",
  },
  {
    title: "Pickleball Tournament 2026",
    href: "/past_events/pickleball_tournament",
    date: "08-March-2026",
    location: "North Carolina",
    image: "/past_events/pickleBall_poster.jpeg",
    description:
      "An informal evening gathering bringing together physicians and healthcare professionals to connect, network, and build meaningful relationships in a relaxed and welcoming environment.",
  },
];

function Page() {
  return (
    <section className="relative bg-[#f8f9fb] py-10">
      <div className="px-6 sm:px-10 lg:px-18">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#7a1f3d]">
            Upcoming Events
          </h2>
          <p className="mt-4 text-gray-600">
            Discover our upcoming professional, cultural, and community-driven
            events designed to connect, inspire, and lead.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pastEvents.map((event, index) => (
            // ✅ Bug 2 Fixed: plain <div> — removed invalid Framer Motion props
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/25" />
              </div>

              {/* Content */}
              {/* ✅ Bug 4 Fixed: flex-1 instead of h-full so content fills remaining card height */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {event.title}
                </h3>

                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <CalendarDays className="w-4 h-4 mr-2 text-[#7a1f3d]" />
                  {event.date}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4 mr-2 text-[#7a1f3d]" />
                  {event.location}
                </div>

                <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                  {event.description}
                </p>

                {/* mt-auto pushes the link to the bottom of the card */}
                <div className="mt-auto pt-6">
                  {/* ✅ Bug 3 Fixed: event.href instead of pastEvents.href */}
                  <Link
                    href={event.href}
                    className="text-sm font-medium text-[#7a1f3d] hover:text-[#5f1730] transition"
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Page;