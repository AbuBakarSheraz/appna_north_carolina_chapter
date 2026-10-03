import Link from "next/link";
import { FileText } from "lucide-react";
export const metadata = {
  title: "Organization & Governance | APPNA NC 2026",
  description:
    "Learn about the North Carolina Chapter of APPNA, its mission, leadership, governance structure, membership, and objectives. Committed to physician wellness, mentorship, and community service, NC-APPNA 2026 focuses on connecting members as one family.",
};

export default function OrganizationSection() {
  
  return (
     <section className="relative bg-[#f8f9fb] py-10">
      <div className="px-6 sm:px-10 lg:px-18">

        {/* HEADER */}
       <div className="text-center max-w-2xl mx-auto mb-14">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#7a1f3d]">
            Organization & Gover<span className="">nance</span>
          </h1>
          <p className="mt-4 text-lg text-muted leading-relaxed">
            The Association of Pakistani Physicians
            of North America - North Carolina (APPNA NC Chapter) operates under a formal constitution and
            bylaws that define its mission, structure, and governance.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* PURPOSE */}
          <div className="rounded-2xl border border-border p-8">
            <h3 className="text-xl font-semibold text-primary mb-4">
              Aims & Objectives
            </h3>
            <ul className="space-y-3 text-muted leading-relaxed list-disc pl-5">
              <li>
                Advance medical science and professional development in
                collaboration with APPNA.
              </li>
              <li>
                Serve physicians of Pakistani origin across North Carolina.
              </li>
              <li>
                Promote health, education, mentorship, and community service.
              </li>
            </ul>
          </div>

          {/* MEMBERSHIP */}
          <div className="rounded-2xl border border-border p-8">
            <h3 className="text-xl font-semibold text-primary mb-4">
              Membership
            </h3>
            <ul className="space-y-3 text-muted leading-relaxed list-disc pl-5">
              <li>
                <strong>Active:</strong> Licensed physicians and physicians in training
                with voting rights.
              </li>
              <li>
                <strong>Honorary:</strong> Individuals recognized for exceptional
                service or distinction.
              </li>
              <li>
                <strong>Affiliate:</strong> Professionals supporting the mission
                without voting privileges.
              </li>
            </ul>
          </div>

          {/* LEADERSHIP */}
          <div className="rounded-2xl border border-border p-8">
            <h3 className="text-xl font-semibold text-primary mb-4">
              Officers & Leadership
            </h3>
            <p className="text-muted leading-relaxed">
              APPNA North Carolina Chapter led by elected officers including the President,
              President-Elect, Secretary, Treasurer, Regional Councilors, and
              Immediate Past President. All officers are elected by the general
              membership in accordance with the bylaws.
            </p>
          </div>

          {/* GOVERNANCE */}
          <div className="rounded-2xl border border-border p-8">
            <h3 className="text-xl font-semibold text-primary mb-4">
              Governance Structure
            </h3>
            <ul className="space-y-3 text-muted leading-relaxed list-disc pl-5">
              <li>
                <strong>General Body:</strong> Supreme authority of the organization.
              </li>
              <li>
                <strong>Executive Council:</strong> Governing and administrative body.
              </li>
              <li>
                <strong>Board of Trustees:</strong> Oversight, ethics, and long-term
                strategic planning.
              </li>
            </ul>
          </div>

        </div>

        <section id="presidents-message" className="mt-16 rounded-2xl border border-appna-maroon/10 bg-appna-surface p-6 sm:p-8">
          <p className="font-accent text-xs font-semibold uppercase tracking-[0.2em] text-appna-maroon">From the president</p>
          <h2 className="mt-3 font-display text-3xl font-medium text-appna-maroon-dark">Connecting Our Chapter as a Family</h2>
          <div className="mt-5 max-w-3xl space-y-5 text-base leading-7 text-appna-ink-soft">
            <p>It is my privilege and honor to serve as the APPNA North Carolina President for 2026. I am truly humbled by the trust you have placed in me and my team.</p>
            <p>The theme for APPNA NC this year is “Connecting Our Chapter as a Family.”</p>
            <div>
              <h3 className="font-accent text-sm font-semibold uppercase tracking-[0.12em] text-appna-maroon">Our goals for 2026</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Foster mutual respect and trust among all members and chapter leadership.</li>
                <li>Promote the health and wellness of our physicians and communities.</li>
                <li>Launch a mentorship program for future physicians.</li>
                <li>Build resources and support systems for young physicians entering the United States for residency opportunities.</li>
              </ul>
            </div>
            <p>I would also like to express my sincere gratitude to our Executive Committee members for their dedication, energy, and innovative ideas. Together, we are committed to making 2026 a highly productive and successful year for our chapter.</p>
          </div>
          <div className="mt-7 border-t border-appna-maroon/10 pt-5">
            <p className="font-semibold text-appna-ink">Sohail Sarwar, MD</p>
            <p className="mt-1 text-sm text-appna-ink-soft">President, APPNA North Carolina — 2026</p>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 flex justify-start">
          <Link href="/bylaws.pdf" target="_blank" className="inline-flex items-center gap-3 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark">
            <FileText size={20} />
            View Constitution & Bylaws (PDF)
          </Link>
        </div>

      </div>
    </section>
  );
}
