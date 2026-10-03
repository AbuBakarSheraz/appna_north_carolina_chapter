import { Reveal } from "../motion/Reveal";

function joinClasses(...classes) {
  return classes.filter(Boolean).join(" ");
}

const toneClasses = {
  mist: "bg-mist",
  white: "bg-card",
  soft: "bg-grove-soft",
};

export default function Section({ eyebrow, title, intro, children, className, contentClassName, flushTop = false, tone = "mist", titleAs: Title = "h2" }) {
  const headingId = title ? `section-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}` : undefined;

  return (
    <section className={joinClasses(flushTop ? "py-12 sm:py-16" : "border-t border-line py-12 sm:py-16", toneClasses[tone] || toneClasses.mist, className)} aria-labelledby={headingId}>
      <div className={joinClasses("mx-auto max-w-7xl px-5 sm:px-6 lg:px-8", contentClassName)}>
        {title || eyebrow || intro ? <Reveal><div className="max-w-3xl"><div className="flex items-center gap-3"><span className="h-px w-9 bg-grove" aria-hidden="true" />{eyebrow ? <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-ridge">{eyebrow}</p> : null}</div>{title ? <Title id={headingId} className="mt-3 font-display text-3xl font-medium leading-tight tracking-[-0.02em] text-grove-dark sm:text-4xl">{title}</Title> : null}{intro ? <p className="mt-4 font-body text-sm leading-6 text-ink-soft sm:text-base sm:leading-7">{intro}</p> : null}</div></Reveal> : null}
        <div className={joinClasses(title || intro || eyebrow ? "mt-8 sm:mt-10" : "")}>{children}</div>
      </div>
    </section>
  );
}

export function SectionGrid({ children, className }) {
  return <div className={joinClasses("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>{children}</div>;
}

export function SectionCard({ children, className }) {
  return <article className={joinClasses("group flex h-full flex-col rounded-xl border border-line bg-card p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-grove/35 hover:shadow-md", className)}>{children}</article>;
}
