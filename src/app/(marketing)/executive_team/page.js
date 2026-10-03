import Image from "next/image";
import PageHeader from "../../../components/shared/PageHeader";
import Section from "../../../components/shared/Section";
import { executiveTeam } from "../../../data/executiveTeam";

export const metadata = {
  title: "Executive Committee | APPNA NC Leadership 2026",
  description: "Meet the APPNA North Carolina Executive Committee for 2026—a dedicated leadership team committed to unity, mentorship, physician wellness, and community service, working together to strengthen our chapter as one family.",
};

export default function ExecutiveCommittee() {
  return (
    <>
      <PageHeader
        eyebrow="Leadership"
        title="Executive Committee"
        subtitle="A distinguished leadership team committed to advancing medical excellence, community service, and professional integrity across North Carolina."
      />

      <Section flushTop>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {executiveTeam.map((member) => (
            <div key={member.name} className="group overflow-hidden rounded-xl border border-line bg-card shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
              {/* Photo */}
              <div className="relative h-80 w-full overflow-hidden bg-grove-soft">
                <Image
                  src={member.image}
                  alt={`${member.name}, ${member.role}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: member.position }}
                />
              </div>

              {/* Name and role */}
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-ridge">{member.role}</p>
                <h3 className="mt-2 font-display text-2xl font-medium text-grove-dark">{member.name}</h3>
                <p className="mt-1 text-sm text-ink-soft">{member.year}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}