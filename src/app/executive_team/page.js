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

export default function ExecutiveCommittee() {
  return (
    <section className="bg-[#F9FAF7] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Section Heading */}
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-green-900">
            Executive Committee
          </h2>
          <p className="mt-3 text-sm sm:text-base text-green-700 max-w-2xl mx-auto">
            Dedicated leadership guiding APPNA North Carolina with integrity,
            service, and professional excellence.
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {committeeMembers.map((member) => (
            <div
              key={member.name}
              className="
                group bg-white rounded-2xl shadow-sm
                hover:shadow-xl transition-all duration-500
                border border-green-100 overflow-hidden
              "
            >
              {/* Image */}
              <div className="relative h-72 w-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="
                    object-cover object-top
                    group-hover:scale-105 transition-transform duration-500
                  "
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0b1f15]/70 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-green-900">
                  {member.name}
                </h3>

                <p className="mt-1 text-sm sm:text-base font-medium text-green-700">
                  {member.role}
                </p>

                <p className="mt-1 text-xs sm:text-sm text-gray-500">
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
