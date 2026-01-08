import Image from "next/image";
import { CalendarDays, MapPin, DollarSign } from "lucide-react";

export const metadata = {
  title: "Meet & Greet | APPNA NC",
  description:
    "Join APPNA NC’s Meet & Greet event to connect with physicians and healthcare professionals in a relaxed and welcoming environment.",
};

export default function EventDetailsPage() {
  return (
    <section className="bg-[#f8f9fb] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#7a1f3d]">
            APPNA NC Meet & Greet 2026
          </h1>
          <p className="mt-4 text-gray-600">
            An evening of connection, fellowship, and celebration with physicians
            and families across North Carolina.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">

          {/* Image */}
          <div className="relative h-80 lg:h-full">
            <Image
              src="/future_events/meet.jpeg"
              alt="APPNA NC Meet and Greet 2026"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/25" />
          </div>

          {/* Content */}
          <div className="p-8 sm:p-10 flex flex-col justify-between">

            {/* Event Info */}
            <div>
              <div className="space-y-3 text-sm sm:text-base text-gray-600">

                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-[#7a1f3d]" />
                  <span>February 7, 2026 · 04:00 PM</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#7a1f3d]" />
                  <span>The Palm, Cary, North Carolina</span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#7a1f3d]" />
                  <span>Registration Fee: $85 USD</span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
                <p>
                  APPNA North Carolina warmly invites you and your family to our
                  **Meet & Greet 2026**, an informal and welcoming gathering
                  designed to strengthen bonds within our physician community.
                </p>

                <p>
                  The evening will feature a **buffet dinner followed by music**
                  in a relaxed and elegant setting, offering the perfect
                  opportunity to connect, network, and celebrate together.
                </p>

                <p>
                  This event reflects our 2026 theme:
                  <span className="font-semibold text-[#7a1f3d] mb-4">
                    {" "}“Connecting Our Chapter as a Family.”
                  </span>
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="https://www.paypal.com/ncp/payment/59TCEBZFKT5DU"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center rounded-xl bg-[#7a1f3d] px-8 py-3 text-sm sm:text-base font-medium text-white hover:bg-[#5f1730] transition"
              >
                Register by February 7
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
          More details and updates will be shared as the event approaches.
        </p>
      </div>
    </section>
  );
}
