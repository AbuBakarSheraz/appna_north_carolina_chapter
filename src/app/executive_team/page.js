import Image from "next/image";

const committeeMembers = [
  {
    name: "Sohail Sarwar, MD",
    role: "President",
    year: "APPNA NC 2026",
    image: "/sohail.png",
  },
  {
    name: "Mukesh Kumar, MD",
    role: "President Elect",
    year: "APPNA NC 2026",
    image: "/mukesh.png",
  },
  {
    name: "Arslan Afzal, MD",
    role: "Secretary",
    year: "APPNA NC 2026",
    image: "/arslan.png",
  },
  {
    name: "M. Waleed Zeb",
    role: "Treasurer",
    year: "APPNA NC 2026",
    image: "/waleed.png",
  },
  {
    name: "Tanvir Ch, MD",
    role: "Past President",
    year: "APPNA NC 2026",
    image: "/tanvir.png",
  },
];
export const metadata = {
  title: "Executive Committee | APPNA NC Leadership 2026",
  description:
    "Meet the APPNA North Carolina Executive Committee for 2026—a dedicated leadership team committed to unity, mentorship, physician wellness, and community service, working together to strengthen our chapter as one family.",
};


export default function ExecutiveCommittee() {
  return (
    <section className="relative bg-[#f8f9fb] py-10">
      <div className="px-6 sm:px-10 lg:px-18">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#7a1f3d]">
            Executive Committee
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
            A distinguished leadership team committed to advancing medical
            excellence, community service, and professional integrity across
            North Carolina.
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {committeeMembers.map((member) => (
            <div
              key={member.name}
              className="
                group bg-white rounded-2xl
                border border-gray-100
                shadow-sm hover:shadow-2xl
                transition-all duration-500
                overflow-hidden
              "
            >
              {/* Image */}
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="
                    object-cover object-top
                    group-hover:scale-105 transition-transform duration-500
                  "
                />
                {/* Dark professional overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>

                <p className="mt-2 text-sm sm:text-base font-medium text-[#7a1f3d]">
                  {member.role}
                </p>

                <p className="mt-1 text-xs sm:text-sm tracking-wide text-gray-500 uppercase">
                  {member.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
