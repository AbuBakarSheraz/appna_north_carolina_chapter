import Image from "next/image";

export default function PresidentMessage() {
  return (
    <section className="py-12 sm:py-20 bg-[#F9FAF7]">
      <div className="px-6 sm:px-10 lg:px-12">
        
        {/* Section Heading */}
        <div className="max-w-3xl flex justify-center sm:justify-start mb-12 ">
          <h2 className="text-3xl sm:text-4xl font-semibold text-black">
            Message from the <span className="text-primary-dark font-bold">President</span>
          </h2>
        </div>

        {/* Content Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* PRESIDENT IMAGE */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute -inset-2 bg-primary-light rounded-2xl" />
              <Image
                src="/president.png"
                alt="Dr. Sohail Sarwar, President APPNA NC"
                width={360}
                height={420}
                className="relative rounded-2xl object-cover shadow-lg"
              />
            </div>
          </div>

          {/* MESSAGE CONTENT */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-10">

              {/* Greeting */}
              <p className="text-lg font-medium text-primary-dark">
                Happy New Year to you and your families,
              </p>

              {/* Theme */}
              <p className="mt-4 text-base sm:text-lg text-muted">
                The theme for <span className="font-semibold text-primary">APPNA NC</span> this year is{" "}
                <span className="font-semibold italic">
                  “Connecting Our Chapter as a Family.”
                </span>
              </p>

              {/* Body */}
              <div className="mt-6 space-y-5 text-base sm:text-lg text-muted leading-relaxed">
                <p>
                  It is my privilege and honor to serve as the APPNA NC President
                  for 2026. I am truly humbled by your trust in me and my team.
                </p>

                <p className="font-semibold text-primary-dark">
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
                    Build resources and support systems for young physicians coming
                    to the United States for residency opportunities.
                  </li>
                </ul>

                <p>
                  In alignment with our theme, we have planned several social
                  networking events, including our very first gathering on{" "}
                  <span className="font-semibold text-primary-dark ">
                    February 7, 2026
                  </span>. We encourage everyone living in North Carolina to join
                  us on that day to connect and strengthen our bonds.
                </p>

                <p>
                  Finally, I would like to express my sincere gratitude to our
                  Executive Committee members, who bring tremendous energy and
                  innovative ideas. Together, we are committed to making 2026 a
                  highly productive and successful year for our chapter.
                </p>
              </div>

              {/* SIGNATURE */}
              <div className="mt-8 border-t border-border pt-6">
                <p className="font-semibold text-primary-dark">
                  Warm regards,
                </p>
                <p className="mt-2 font-semibold text-primary-dark">
                  Sohail Sarwar, MD
                </p>
                <p className="text-sm text-muted">
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
