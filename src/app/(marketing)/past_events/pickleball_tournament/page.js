import Image from "next/image";
import { CalendarDays, MapPin, DollarSign, Trophy } from "lucide-react";

export const metadata = {
  title: "Pickleball Tournament 2026 | APPNA NC",
  description:
    "Relive the excitement of APPNA NC's Pickleball Tournament 2026 — a day of healthy competition, laughter, and community spirit among physicians and families across North Carolina.",
};

export default function EventDetailsPage() {
  return (
    <section className="bg-[#f8f9fb] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Past Event Badge */}
          <span className="inline-block mb-4 px-4 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-emerald-100 text-emerald-700">
            Past Event
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#7a1f3d]">
            APPNA NC Pickleball Tournament 2026
          </h1>
          <p className="mt-4 text-gray-600">
            A vibrant afternoon of friendly competition, great energy, and
            unforgettable memories with physicians and families across North Carolina.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">

          {/* Image */}
          <div className="relative h-80 lg:h-full">
            <Image
              src="/past_events/pickleBall_poster.jpeg"
              alt="APPNA NC Pickleball Tournament 2026"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/25" />

            {/* Overlay badge on image */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#7a1f3d]" />
              <span className="text-xs font-semibold text-[#7a1f3d] tracking-wide">
                Successfully Completed
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 sm:p-10 flex flex-col justify-between">

            {/* Event Info */}
            <div>
              <div className="space-y-3 text-sm sm:text-base text-gray-600">

                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-[#7a1f3d]" />
                  <span>March 8, 2026 · 04:00 PM</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#7a1f3d]" />
                  <span>North Carolina</span>
                </div>

                {/* <div className="flex items-start gap-2">
                  <DollarSign className="w-5 h-5 text-[#7a1f3d] mt-0.5" />
                  <div className="text-gray-600">
                    <p className="font-medium">
                      Registration Fee: <span className="text-gray-900">$85 USD</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Children under 7 years:{" "}
                      <span className="font-medium text-gray-700">$55 USD</span>
                    </p>
                  </div>
                </div> */}

              </div>

              {/* Description */}
              <div className="mt-6 space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
                <p>
                  The APPNA NC Pickleball Tournament 2026 was a resounding
                  success — a high-energy afternoon that brought together
                  physicians, families, and friends in the spirit of healthy
                  competition and community bonding.
                </p>

                <p>
                  Courts were filled with laughter, cheers, and impressive
                  rallies as participants of all skill levels competed with
                  enthusiasm and sportsmanship. From seasoned players to
                  first-timers, everyone embraced the game and the camaraderie
                  it created.
                </p>

                <p>
                  The event was more than a tournament — it was a celebration of
                  wellness and togetherness. Families gathered courtside, children
                  cheered on their parents, and friendships that began on the
                  court continued long after the final match.
                </p>

                <p>
                  This event beautifully embodied our 2026 theme:
                  <span className="font-semibold text-[#7a1f3d]">
                    {" "}"Connecting Our Chapter as a Family."
                  </span>
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="/upcoming_events"
                className="inline-flex justify-center items-center rounded-xl bg-[#7a1f3d] px-8 py-3 text-sm sm:text-base font-medium text-white hover:bg-[#5f1730] transition"
              >
                View Upcoming Events
              </a>

              <a
                href="/past_events"
                className="inline-flex justify-center items-center rounded-xl border border-[#7a1f3d] px-8 py-3 text-sm sm:text-base font-medium text-[#7a1f3d] hover:bg-[#7a1f3d]/5 transition"
              >
                Back to Past Events
              </a>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-10 text-center text-sm text-gray-500">
          Thank you to all participants and volunteers who made this event a
          memorable celebration of health, sport, and community.
        </p>
      </div>
    </section>
  );
}