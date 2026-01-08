import Image from "next/image";

export default function PresidentMessage() {
  return (
    <section className="bg-[#f8f9fb] py-12 sm:py-16">
      <div className="px-6 sm:px-10 lg:px-18">

        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#7a1f3d]">
            Message from the President
          </h2>
          <p className="mt-3 text-gray-600">
            Leadership, vision, and commitment to connecting our chapter as one family.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* President Image */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute -inset-2 rounded-2xl bg-[#7a1f3d]/10" />
              <Image
                src="/president.png"
                alt="Dr. Sohail Sarwar, President APPNA NC"
                width={360}
                height={420}
                className="relative rounded-2xl object-cover shadow-md"
              />
            </div>
          </div>

          {/* Message Card */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-10">

              {/* Greeting */}
              <p className="text-base sm:text-lg font-medium text-gray-800">
                Happy New Year to you and your families,
              </p>

              {/* Theme */}
              <p className="mt-4 text-base sm:text-lg text-gray-600">
                The theme for <span className="font-semibold text-[#7a1f3d]">APPNA NC</span> this year is{" "}
                <span className="italic font-semibold text-gray-800">
                  “Connecting Our Chapter as a Family.”
                </span>
              </p>

              {/* Body */}
              <div className="mt-6 space-y-5 text-base sm:text-lg text-gray-600 leading-relaxed">
                <p>
                  It is my privilege and honor to serve as the APPNA North Carolina
                  President for 2026. I am truly humbled by the trust you have placed
                  in me and my team.
                </p>

                <p className="font-semibold text-gray-800">
                  Our Goals for 2026
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Foster mutual respect and trust among all members and chapter leadership.
                  </li>
                  <li>
                    Promote the health and wellness of our physicians and communities.
                  </li>
                  <li>
                    Launch a mentorship program for future physicians.
                  </li>
                  <li>
                    Build resources and support systems for young physicians entering
                    the United States for residency opportunities.
                  </li>
                </ul>

                <p>
                  In alignment with our theme, we have planned several social
                  networking events, including our first gathering on{" "}
                  <span className="font-semibold text-[#7a1f3d]">
                    February 7, 2026
                  </span>. We encourage everyone in North Carolina to join us and
                  strengthen our bonds.
                </p>

                <p>
                  I would also like to express my sincere gratitude to our Executive
                  Committee members for their dedication, energy, and innovative
                  ideas. Together, we are committed to making 2026 a highly productive
                  and successful year for our chapter.
                </p>
              </div>

              {/* Signature */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <p className="mt-2 font-semibold text-gray-900">
                  Sohail Sarwar, MD
                </p>
                <p className="text-sm text-gray-500">
                  President, APPNA North Carolina — 2026
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
