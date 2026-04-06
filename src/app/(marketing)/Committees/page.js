import {
  Users,
  ClipboardList,
  Vote,
  GraduationCap,
  ShieldCheck,
  HeartPulse,
} from "lucide-react";

const committees = [
  {
    title: "Young Physicians Committee",
    description:
      "Empowering early-career physicians through mentorship, leadership development, and networking opportunities.",
    icon: Users,
  },
  {
    title: "Membership Committee",
    description:
      "Focused on member engagement, retention, and strengthening chapter participation across North Carolina.",
    icon: ClipboardList,
  },
  {
    title: "Election & Nomination Committee",
    description:
      "Ensuring transparent, ethical, and fair leadership selection within the chapter.",
    icon: Vote,
  },
  {
    title: "Future Physicians Committee",
    description:
      "Guiding medical students and graduates as they transition into the U.S. medical system.",
    icon: GraduationCap,
  },
  {
    title: "Grievance Committee",
    description:
      "Promoting professionalism, fairness, and effective conflict resolution.",
    icon: ShieldCheck,
  },
  {
    title: "CME Committee",
    description:
      "Advancing continuous medical education and professional excellence.",
    icon: HeartPulse,
  },
];
export const metadata = {
  title: "Committees | APPNA NC Leadership & Initiatives",
  description:
    "Discover the APPNA North Carolina committees that drive leadership, education, mentorship, and community engagement. Each committee supports our 2026 theme of “Connecting Our Chapter as a Family” while empowering physicians and future medical professionals.",
};


export default function CommitteesPage() {
  return (
    <section className="bg-[#f8f9fb] py-12 sm:py-16">
      <div className="px-6 sm:px-10 lg:px-18">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#7a1f3d]">
            Committees
          </h2>
          <p className="mt-4 text-gray-600">
            Our committees serve as the backbone of APPNA North Carolina,
            advancing leadership, education, and community engagement.
          </p>
        </div>

        {/* Committees Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {committees.map((committee) => {
            const Icon = committee.icon;
            return (
              <div
                key={committee.title}
                className="
                  group bg-white rounded-2xl shadow-sm
                  hover:shadow-xl transition-all duration-300
                  p-6 sm:p-7 flex flex-col
                "
              >
                {/* Icon */}
                <div className="mb-5">
                  <div
                    className="
                      w-12 h-12 rounded-xl
                      bg-[#7a1f3d]/10
                      flex items-center justify-center
                    "
                  >
                    <Icon className="w-6 h-6 text-[#7a1f3d]" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {committee.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed grow">
                  {committee.description}
                </p>

                {/* CTA */}
                <div className="mt-6">
                  <span className="text-sm font-medium text-[#7a1f3d] hover:text-[#5f1730] transition">
                    Learn More →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
