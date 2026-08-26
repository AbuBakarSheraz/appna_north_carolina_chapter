import { CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";


const events = [
 
 {
    title: "APPNA NC Annual Banquet, Entertainment & CME 2026",
    date: "Saturday, October 10,2026",
    href: "/upcoming_events/annual_banquet",
    location: "North Carolina",
    image: "/future_events/Annual_Banquet.png",
    description:
      "A festive evening celebration with families and community members, promoting unity, cultural connection, and shared values.",
  },
  {
    title: "Winter GTG",
    date: "soon...",
    href: "/upcoming_events/winter_gtg",
    location: "North Carolina",
    image: "/future_events/winter.png",
    description:
      "An elegant winter evening focused on professional networking, reflection on the year’s achievements, and future planning.",
  },
];
export const metadata = {
  title: "Upcoming Events | Connecting APPNA NC as One Family",
  description:
    "Explore APPNA North Carolina’s upcoming professional, cultural, and community events designed to bring physicians and families together, strengthen relationships, promote wellness, and foster mentorship in alignment with our 2026 theme, “Connecting Our Chapter as a Family.”",
};


export default function UpcomingEvents() {
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
          {events.map((event, index) => (
            <div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
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
              <div className="p-6 flex flex-col h-full">
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

                <div className="mt-6">
                  <Link
                  href={event.href}
                  className="text-sm font-medium text-[#7a1f3d] hover:text-[#5f1730] transition">
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
