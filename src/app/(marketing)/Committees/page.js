import Image from "next/image";
import { User } from "lucide-react";
import PageHeader from "../../../components/shared/PageHeader";
import Section, { SectionCard, SectionGrid } from "../../../components/shared/Section";
import { committees } from "../../../data/committees";

export const metadata = {
  title: "Committees | APPNA NC Leadership & Initiatives",
  description: "Discover the APPNA North Carolina committees that drive leadership, education, mentorship, and community engagement. Each committee supports our 2026 theme of “Connecting Our Chapter as a Family” while empowering physicians and future medical professionals.",
};

// Round photo, or a simple icon when there is no photo yet
function Avatar({ person }) {
  if (person.image) {
    return <Image src={person.image} alt={person.name} width={64} height={64} className="h-16 w-16 shrink-0 rounded-full object-cover object-top" />;
  }

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-grove-soft text-grove">
      <User className="h-7 w-7" aria-hidden="true" />
    </div>
  );
}

function PersonRow({ role, person }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar person={person} />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ridge">{role}</p>
        <p className="font-semibold text-ink">{person.name}</p>
        {person.detail ? <p className="text-sm text-ink-soft">{person.detail}</p> : null}
      </div>
    </div>
  );
}

export default function CommitteesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Leadership"
        title="Committees"
        subtitle="Our committees serve as the backbone of APPNA North Carolina, advancing leadership, education, and community engagement."
      />

      <Section flushTop>
        <SectionGrid>
          {committees.map((committee) => {
            const Icon = committee.icon;

            return (
              <SectionCard key={committee.title}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-grove-soft text-grove">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>

                <h3 className="mt-5 font-display text-2xl font-medium text-grove-dark">{committee.title}</h3>
                <p className="mt-3 grow text-sm leading-6 text-ink-soft">{committee.description}</p>

                <div className="mt-6 space-y-5 border-t border-line pt-5">
                  <PersonRow role="Chair" person={committee.chair} />

                  {committee.coChair ? <PersonRow role="Co-Chair" person={committee.coChair} /> : null}

                  {committee.members ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-ridge">Members</p>
                      <ul className="mt-2 space-y-1 text-sm">
                        {committee.members.map((member) => (
                          <li key={member.name} className="text-ink">
                            {member.name} <span className="text-ink-soft">— {member.detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </SectionCard>
            );
          })}
        </SectionGrid>
      </Section>
    </>
  );
}