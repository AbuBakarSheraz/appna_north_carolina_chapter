import Image from "next/image";
import { executiveTeam } from "../../../data/executiveTeam";
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
          {executiveTeam.map((member) => (
            <div key={member.name} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl">
              {/* Image */}
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: member.position }}

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
