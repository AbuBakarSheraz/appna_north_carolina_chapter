import { Reveal } from "../motion/Reveal";

export default function PageHeader({ eyebrow, title, subtitle, description }) {
  const supportingText = subtitle || description;

  return (
    <section className="border-b border-line bg-grove-soft">
      <Reveal className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
        {eyebrow ? <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-ridge">{eyebrow}</p> : null}
        <h1 className="mt-3 font-display text-4xl font-medium leading-[1.1] tracking-[-0.02em] text-grove-dark sm:text-5xl">{title}</h1>
        {supportingText ? <p className="mt-4 max-w-2xl font-body text-sm leading-6 text-ink-soft sm:text-base sm:leading-7">{supportingText}</p> : null}
      </Reveal>
    </section>
  );
}
