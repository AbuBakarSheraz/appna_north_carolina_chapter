import Link from "next/link";
import { FileText } from "lucide-react";
import PageHeader from "../../../components/shared/PageHeader";
import Section, { SectionCard } from "../../../components/shared/Section";

export const metadata = {
  title: "Organization & Governance | APPNA NC 2026",
  description: "Learn about the North Carolina Chapter of APPNA, its mission, leadership, governance structure, membership, and objectives. Committed to physician wellness, mentorship, and community service, NC-APPNA 2026 focuses on connecting members as one family.",
};

// Style used by every list on this page
const listStyle = "mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-ink-soft sm:text-base";
const cardTitle = "font-display text-2xl font-medium text-grove-dark";

export default function OrganizationPage() {
  return (
    <>
      <PageHeader
        eyebrow="About the chapter"
        title="Organization & Governance"
        subtitle="The Association of Pakistani Physicians of North America - North Carolina (APPNA NC Chapter) operates under a formal constitution and bylaws that define its mission, structure, and governance."
      />

      {/* Aims, membership, leadership, governance */}
      <Section flushTop>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SectionCard>
            <h3 className={cardTitle}>Aims & Objectives</h3>
            <ul className={listStyle}>
              <li>Advance medical science and professional development in collaboration with APPNA.</li>
              <li>Serve physicians of Pakistani origin across North Carolina.</li>
              <li>Promote health, education, mentorship, and community service.</li>
            </ul>
          </SectionCard>

          <SectionCard>
            <h3 className={cardTitle}>Membership</h3>
            <ul className={listStyle}>
              <li><strong>Active:</strong> Licensed physicians and physicians in training with voting rights.</li>
              <li><strong>Honorary:</strong> Individuals recognized for exceptional service or distinction.</li>
              <li><strong>Affiliate:</strong> Professionals supporting the mission without voting privileges.</li>
            </ul>
          </SectionCard>

          <SectionCard>
            <h3 className={cardTitle}>Officers & Leadership</h3>
            <p className="mt-4 text-sm leading-6 text-ink-soft sm:text-base">
              APPNA North Carolina Chapter is led by elected officers including the President, President-Elect, Secretary, Treasurer, Regional Councilors, and Immediate Past President. All officers are elected by the general membership in accordance with the bylaws.
            </p>
          </SectionCard>

          <SectionCard>
            <h3 className={cardTitle}>Governance Structure</h3>
            <ul className={listStyle}>
              <li><strong>General Body:</strong> Supreme authority of the organization.</li>
              <li><strong>Executive Council:</strong> Governing and administrative body.</li>
              <li><strong>Board of Trustees:</strong> Oversight, ethics, and long-term strategic planning.</li>
            </ul>
          </SectionCard>
        </div>

        <div className="mt-10">
          <Link href="/bylaws.pdf" target="_blank" className="inline-flex items-center gap-3 rounded-full bg-grove px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-grove-dark">
            <FileText size={20} aria-hidden="true" />
            View Constitution & Bylaws (PDF)
          </Link>
        </div>
      </Section>

      {/* President's message (the landing page links here with #presidents-message) */}
      <div id="presidents-message" className="scroll-mt-20">
        <Section eyebrow="From the president" title="Connecting Our Chapter as a Family" tone="soft">
          <div className="max-w-3xl rounded-xl border border-line bg-card p-6 shadow-sm sm:p-8">
            <div className="space-y-5 text-base leading-7 text-ink-soft">
              <p>It is my privilege and honor to serve as the APPNA North Carolina President for 2026. I am truly humbled by the trust you have placed in me and my team.</p>
              <p>The theme for APPNA NC this year is “Connecting Our Chapter as a Family.”</p>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-ridge">Our goals for 2026</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>Foster mutual respect and trust among all members and chapter leadership.</li>
                  <li>Promote the health and wellness of our physicians and communities.</li>
                  <li>Launch a mentorship program for future physicians.</li>
                  <li>Build resources and support systems for young physicians entering the United States for residency opportunities.</li>
                </ul>
              </div>

              <p>I would also like to express my sincere gratitude to our Executive Committee members for their dedication, energy, and innovative ideas. Together, we are committed to making 2026 a highly productive and successful year for our chapter.</p>
            </div>

            <div className="mt-7 border-t border-line pt-5">
              <p className="font-semibold text-ink">Sohail Sarwar, MD</p>
              <p className="mt-1 text-sm text-ink-soft">President, APPNA North Carolina — 2026</p>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}