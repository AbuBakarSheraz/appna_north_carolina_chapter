import Link from "next/link";
import { FileText } from "lucide-react";

export default function OrganizationSection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="px-6 sm:px-10 lg:px-18">

        {/* HEADER */}
        <div className="max-w-4xl mb-14">
          <h1 className="text-3xl sm:text-4xl font-semibold text-black">
            Organization & Gover<span className="text-primary-dark font-bold">nance</span>
          </h1>
          <p className="mt-4 text-lg text-muted leading-relaxed">
            The North Carolina Chapter of the Association of Pakistani Physicians
            of North America (NC-APPNA) operates under a formal constitution and
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
              NC-APPNA is led by elected officers including the President,
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

        {/* CTA */}
        <div className="mt-16 flex justify-start">
          <Link
            href="/bylaws.pdf"
            target="_blank"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl
              bg-primary text-white font-semibold
              hover:bg-primary-dark transition"
          >
            <FileText size={20} />
            View Constitution & Bylaws (PDF)
          </Link>
        </div>

      </div>
    </section>
  );
}
