import Image from "next/image";
import { CalendarDays, MapPin, DollarSign, Sparkles } from "lucide-react";

export const metadata = {
  title: "APPNA NC Annual Banquet, Entertainment & CME 2026 | APPNA NC",
  description:
    "APPNA NC Annual Banquet, Entertainment & CME 2026 — an elegant evening of fine dining, live entertainment, and heartfelt connections with physicians and families across North Carolina.",
};

export default function EventDetailsPage() {
  return (
    <section className="bg-[#f8f9fb] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#7a1f3d]">
            APPNA NC Annual Banquet, Entertainment & CME 2026
          </h1>
          <p className="mt-4 text-gray-600">
            An elegant evening of fine dining, live entertainment, and heartfelt
            celebration with physicians and families across North Carolina.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">

          {/* Image */}
          <div className="relative h-80 lg:h-full">
            <Image
              src="/future_events/Annual_Banquet.png"
              alt="APPNA NC Annual Banquet, Entertainment & CME 2026"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/25" />

            {/* Upcoming badge on image */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7a1f3d]" />
              <span className="text-xs font-semibold text-[#7a1f3d] tracking-wide">
                Upcoming Event
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
                  <span>October 10, 2026 · 05:00 PM</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#7a1f3d]" />
                  <span>Embassy Suites By Hilton, North Carolina</span>
                </div>

                <div className="flex items-start gap-2">
                  <DollarSign className="w-5 h-5 text-[#7a1f3d] mt-0.5" />
                  <div className="text-gray-600">
                    <p className="font-medium">
                      Ticket pricing coming soon
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Register early to secure your spot
                    </p>
                  </div>
                </div>

              </div>

              {/* Description */}
              <div className="mt-6 space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
                <p>
                  APPNA North Carolina is proud to present our much-anticipated
                  Annual Banquet &amp; Entertainment 2026 — a grand evening
                  dedicated to celebrating the accomplishments of our chapter
                  and the bonds that make us a family.
                </p>

                <p>
                  The evening promises an exquisite buffet dinner, live
                  entertainment, and a beautifully curated program that honors
                  our community's spirit, achievements, and shared journey
                  throughout 2026.
                </p>

                <p>
                  Whether you are a long-standing member or joining us for the
                  first time, this is the event of the year — a night to dress
                  up, reconnect with colleagues, and celebrate with your loved
                  ones in an elegant and welcoming setting.
                </p>

                <p>
                  This event is the flagship celebration of our 2026 theme:
                  <span className="font-semibold text-[#7a1f3d]">
                    {" "}"Connecting Our Chapter as a Family."
                  </span>
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="/events"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center rounded-xl bg-[#7a1f3d] px-8 py-3 text-sm sm:text-base font-medium text-white hover:bg-[#5f1730] transition"
              >
                Buy Tickets online
              </a>

              <a
                href="/upcoming_events"
                className="inline-flex justify-center items-center rounded-xl border border-[#7a1f3d] px-8 py-3 text-sm sm:text-base font-medium text-[#7a1f3d] hover:bg-[#7a1f3d]/5 transition"
              >
                Back to Events
              </a>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-10 text-center text-sm text-gray-500">
          More details, ticket pricing, and entertainment lineup will be
          announced as the event approaches. Stay tuned!
        </p>
      </div>
    </section>
  );
}