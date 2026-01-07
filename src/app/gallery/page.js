import React from "react";
import { Image, Calendar } from "lucide-react";
export const metadata = {
  title: "Gallery | APPNA NC Memories & Events",
  description:
    "Explore the APPNA North Carolina chapter’s gallery showcasing professional, cultural, and community events from 2022 to 2026. Relive memorable gatherings, celebrations, and milestones that strengthen our chapter as one family.",
};

const galleryYears = [
    {
    year: "2026",
    description: "Recent events, conventions, and community moments.",
  },
  {
    year: "2025",
    description: "Recent events, conventions, and community moments.",
  },
  {
    year: "2024",
    description: "Professional gatherings and memorable celebrations.",
  },
  {
    year: "2023",
    description: "A year of growth, leadership, and collaboration.",
  },
  {
    year: "2022",
    description: "Foundational events and chapter milestones.",
  },
  {
    year: "Older Years",
    description: "Archived memories from earlier chapter activities.",
  },
];

function Page() {
  return (
    <section className="bg-[#f8f9fb] py-12 sm:py-16">
      <div className="px-6 sm:px-10 lg:px-18">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#7a1f3d]">
            Gallery
          </h2>
          <p className="mt-4 text-gray-600">
            Explore memories from our professional, cultural, and community
            events across the years.
          </p>
        </div>

        {/* Years Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {galleryYears.map((item) => (
            <div
              key={item.year}
              className="
                group bg-white rounded-2xl shadow-sm
                hover:shadow-xl transition-all duration-300
                p-4 sm:p-5 flex flex-col items-center text-center
              "
            >
              {/* Icon */}
              <div
                className="
                  w-14 h-14 rounded-2xl mb-5
                  bg-[#7a1f3d]/10
                  flex items-center justify-center
                "
              >
                <Calendar className="w-7 h-7 text-[#7a1f3d]" />
              </div>

              {/* Year */}
              <h3 className="text-xl font-semibold text-gray-900">
                {item.year}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>

              {/* CTA */}
              <div className="mt-6">
                <span className="text-sm font-medium text-[#7a1f3d] hover:text-[#5f1730] transition">
                  View Gallery →
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
