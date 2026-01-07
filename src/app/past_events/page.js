import React from "react";
import { CalendarDays, MapPin, Clock } from "lucide-react";

const pastEvents = [
  {
    title: "Annual Convention",
    date: "2024",
    location: "North Carolina",
    description:
      "This event page will be updated with full details, photos, and highlights once content is finalized.",
  },
  {
    title: "Eid Banquet",
    date: "2024",
    location: "North Carolina",
    description:
      "Event details, images, and summary will be added soon. Stay tuned for updates.",
  },
  {
    title: "Spring Picnic",
    date: "2023",
    location: "North Carolina",
    description:
      "Archived event information will be published here once verified.",
  },
  {
    title: "Winter Gathering",
    date: "2023",
    location: "North Carolina",
    description:
      "This is a placeholder event. Content will be updated as records are finalized.",
  },
  {
    title: "Professional CME Session",
    date: "2022",
    location: "North Carolina",
    description:
      "Event details and educational highlights will be added soon.",
  },
  {
    title: "Community Networking Event",
    date: "2022",
    location: "North Carolina",
    description:
      "Past event summary and media will be updated in future.",
  },
];
export const metadata = {
  title: "Past Events | APPNA NC 2022–2024 Memories",
  description:
    "Explore archived events of the APPNA North Carolina chapter, including professional, cultural, and community gatherings from 2022 to 2024. Relive our chapter’s milestones, celebrations, and initiatives that strengthened our community as one family.",
};

function Page() {
  return (
    <section className="bg-[#f8f9fb] py-12 sm:py-16">
      <div className="px-6 sm:px-10 lg:px-18">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#7a1f3d]">
            Past Events
          </h2>
          <p className="mt-4 text-gray-600">
            A glimpse into our previous professional, cultural, and community
            events. Detailed content will be updated soon.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastEvents.map((event, index) => (
            <div
              key={index}
              className="
                group bg-white rounded-2xl shadow-sm
                hover:shadow-lg transition-all duration-300
                p-6 flex flex-col
              "
            >
              {/* Badge */}
              <span className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-[#7a1f3d] bg-[#7a1f3d]/10 px-3 py-1 rounded-full w-fit">
                <Clock className="w-3.5 h-3.5" />
                Archived Event
              </span>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {event.title}
              </h3>

              {/* Meta */}
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <CalendarDays className="w-4 h-4 mr-2 text-[#7a1f3d]" />
                  {event.date}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-[#7a1f3d]" />
                  {event.location}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed grow">
                {event.description}
              </p>

              {/* CTA */}
              <div className="mt-6">
                <span className="text-sm font-medium text-gray-400 italic">
                  Details coming soon
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Page;
