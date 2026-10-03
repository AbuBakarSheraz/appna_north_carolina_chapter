import { Calendar } from "lucide-react";
import Link from "next/link";
import PageHeader from "../../../components/shared/PageHeader";
import Section, { SectionCard } from "../../../components/shared/Section";

export const metadata = {
  title: "Gallery | APPNA NC Memories & Events",
  description: "Explore the APPNA North Carolina chapter’s gallery showcasing professional, cultural, and community events from 2022 to 2026. Relive memorable gatherings, celebrations, and milestones that strengthen our chapter as one family.",
};

// To show an older year, remove the // and make sure its /gallery/<year> page exists
const galleryYears = [
  {
    year: "2026",
    description: "Recent events, conventions, and community moments.",
    href: "/gallery/2026",
  },
  // { year: "2025", description: "Recent events, conventions, and community moments.", href: "/gallery/2025" },
  // { year: "2024", description: "Professional gatherings and memorable celebrations.", href: "/gallery/2024" },
  // { year: "2023", description: "A year of growth, leadership, and collaboration.", href: "/gallery/2023" },
  // { year: "2022", description: "Foundational events and chapter milestones.", href: "/gallery/2022" },
];

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Memories"
        title="Gallery"
        subtitle="Explore memories from our professional, cultural, and community events across the years."
      />

      <Section flushTop>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {galleryYears.map((item) => (
            <SectionCard key={item.year}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-grove-soft text-grove">
                <Calendar className="h-6 w-6" aria-hidden="true" />
              </div>

              <h3 className="mt-5 font-display text-3xl font-medium text-grove-dark">{item.year}</h3>
              <p className="mt-2 grow text-sm leading-6 text-ink-soft">{item.description}</p>

              <div className="pt-6">
                <Link href={item.href} className="text-sm font-semibold uppercase tracking-wide text-grove transition hover:text-grove-dark">
                  View Gallery →
                </Link>
              </div>
            </SectionCard>
          ))}
        </div>
      </Section>
    </>
  );
}