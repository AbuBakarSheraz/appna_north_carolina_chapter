import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartPulse, HandHeart, Landmark, Network, Stethoscope, UsersRound } from "lucide-react";
import Section, { SectionCard, SectionGrid } from "../../components/shared/Section";
import { committees } from "../../data/committees";
import { executiveTeam } from "../../data/executiveTeam";
import { events, featuredEvent } from "../../data/events";

function TextLink({ href, children }) {
  return <Link href={href} className="inline-flex items-center gap-1.5 font-accent text-sm font-semibold uppercase tracking-[0.08em] text-appna-maroon transition hover:text-appna-maroon-dark">{children}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>;
}

function ActionLink({ href, children, variant = "primary" }) {
  const className = variant === "primary" ? "inline-flex items-center justify-center rounded-full bg-appna-maroon px-5 py-3 font-accent text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-appna-maroon-dark" : "inline-flex items-center justify-center rounded-full border border-appna-maroon/30 px-5 py-3 font-accent text-sm font-semibold uppercase tracking-[0.08em] text-appna-maroon transition hover:border-appna-maroon hover:bg-appna-maroon-light";
  return <Link href={href} className={className}>{children}</Link>;
}

export default function Home() {
  const upcomingEvents = events.slice(0, 2);

  return (
    <>
      <section className="relative isolate min-h-[500px] overflow-hidden bg-appna-maroon-dark text-white sm:min-h-[560px]">
        <Image src="/slide1.png" alt="Blue Ridge Parkway in North Carolina" fill priority sizes="100vw" className="object-cover object-center sm:object-[center_60%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-appna-maroon-dark/75 to-appna-maroon-dark/95" />
        <div className="relative mx-auto flex min-h-[500px] max-w-7xl items-end px-5 py-12 sm:min-h-[560px] sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-accent text-xs font-semibold uppercase tracking-[0.2em] text-white/75">Welcome to</p>
            <h1 className="mt-3 font-display text-5xl font-medium leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">APPNA North Carolina</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">Association of Physicians of Pakistani Descent of North America, North Carolina Chapter</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ActionLink href="/events">Annual Banquet Tickets</ActionLink>
              <ActionLink href="/register" variant="secondary">Join Us</ActionLink>
              <Link href="/sponsorship_proposal" className="font-accent text-sm font-semibold uppercase tracking-[0.08em] text-white underline decoration-appna-accent underline-offset-4 transition hover:text-appna-accent-light">Become a Sponsor</Link>
            </div>
          </div>
        </div>
      </section>

      <Section eyebrow="Our affiliation" title="A chapter within APPNA" intro="Serving North Carolina through professional connection, education, and community engagement." flushTop>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-appna-maroon/10 bg-appna-surface p-5"><p className="font-display text-3xl text-appna-maroon-dark">2001</p><p className="mt-2 text-sm leading-6 text-appna-ink-soft">North Carolina Chapter founded</p></div>
          <div className="rounded-xl border border-appna-maroon/10 bg-appna-surface p-5"><p className="font-display text-3xl text-appna-maroon-dark">1976</p><p className="mt-2 text-sm leading-6 text-appna-ink-soft">APPNA established</p></div>
          <div className="rounded-xl border border-appna-maroon/10 bg-appna-surface p-5"><p className="font-display text-3xl text-appna-maroon-dark">18,000+</p><p className="mt-2 text-sm leading-6 text-appna-ink-soft">Physicians across the United States and Canada</p></div>
          <div className="rounded-xl border border-appna-maroon/10 bg-appna-surface p-5"><p className="font-display text-3xl text-appna-maroon-dark">Non-profit</p><p className="mt-2 text-sm leading-6 text-appna-ink-soft">Committed to professional and community service</p></div>
        </div>
        <div className="mt-7"><TextLink href="/organization">About APPNA</TextLink></div>
      </Section>

      <Section eyebrow="Featured event" title="Celebrate together" intro="Join the chapter’s annual evening of connection, entertainment, and CME.">
        <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-4 sm:grid-cols-3">
            {featuredEvent.images.map((image) => <div key={image.src} className="relative aspect-[4/5] overflow-hidden rounded-xl border border-appna-maroon/10 bg-appna-surface"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 260px" className="object-cover" /></div>)}
          </div>
          <SectionCard className="p-6 sm:p-8">
            <p className="font-accent text-xs font-semibold uppercase tracking-[0.16em] text-appna-maroon">{featuredEvent.date}</p>
            <h3 className="mt-3 font-display text-3xl font-medium leading-tight text-appna-maroon-dark">{featuredEvent.title}</h3>
            <p className="mt-4 text-sm leading-6 text-appna-ink-soft">{featuredEvent.description}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ActionLink href="/events">Tickets</ActionLink>
              <ActionLink href={featuredEvent.href} variant="secondary">Details</ActionLink>
              <ActionLink href="/sponsorship_proposal" variant="secondary">Sponsor</ActionLink>
              <ActionLink href="/vendor_registration" variant="secondary">Vendor</ActionLink>
            </div>
          </SectionCard>
        </div>
        <div className="mt-7"><TextLink href="/upcoming_events">View all events</TextLink></div>
      </Section>

      <Section eyebrow="From the president" title="Connecting our chapter" intro="A shared commitment to mutual respect, wellness, mentorship, and support for future physicians.">
        <SectionCard className="grid items-center gap-6 p-5 sm:grid-cols-[180px_1fr] sm:p-7">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[180px] overflow-hidden rounded-lg bg-appna-surface-muted"><Image src="/president.png" alt="Dr. Sohail Sarwar, APPNA North Carolina President" fill sizes="180px" className="object-cover" style={{ objectPosition: "center 12%" }} /></div>
          <div>
            <blockquote className="font-display text-2xl font-medium leading-snug text-appna-maroon-dark sm:text-3xl">“Together, we are committed to making 2026 a productive and successful year for our chapter.”</blockquote>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-appna-ink-soft">Our 2026 theme, “Connecting Our Chapter as a Family,” guides the work ahead: build trust, promote wellness, mentor future physicians, and support young physicians pursuing residency.</p>
            <p className="mt-5 font-accent text-sm font-semibold text-appna-ink">Sohail Sarwar, MD <span className="font-normal text-appna-ink-soft">· President, APPNA North Carolina — 2026</span></p>
            <div className="mt-6"><TextLink href="/organization#presidents-message">Read the full message</TextLink></div>
          </div>
        </SectionCard>
      </Section>

      <Section eyebrow="Chapter leadership" title="Meet the executive team" intro="Chapter leaders guiding APPNA NC’s 2026 work.">
        <SectionGrid>
          {executiveTeam.slice(0, 3).map((member) => <SectionCard key={member.name} className="overflow-hidden p-0"><div className="relative aspect-[4/3] overflow-hidden bg-appna-surface-muted"><Image src={member.image} alt={`${member.name}, ${member.role}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover object-top transition duration-300 group-hover:scale-105" style={{ objectPosition: member.position }} /></div><div className="p-5"><p className="font-accent text-xs font-semibold uppercase tracking-[0.14em] text-appna-maroon">{member.role}</p><h3 className="mt-2 font-display text-2xl font-medium text-appna-maroon-dark">{member.name}</h3><p className="mt-3 text-sm leading-6 text-appna-ink-soft">{member.bio}</p></div></SectionCard>)}
        </SectionGrid>
        <div className="mt-7"><TextLink href="/executive_team">Meet the Executive Team</TextLink></div>
      </Section>

      <Section eyebrow="Committee work" title="Focused support" intro="Committees advance education, mentorship, and professional growth.">
        <SectionGrid>
          {committees.map((committee) => { const Icon = committee.icon; return <SectionCard key={committee.title}><div className="flex h-11 w-11 items-center justify-center rounded-lg bg-appna-maroon-light text-appna-maroon"><Icon className="h-5 w-5" aria-hidden="true" /></div><h3 className="mt-5 font-display text-2xl font-medium text-appna-maroon-dark">{committee.title}</h3><p className="mt-3 text-sm leading-6 text-appna-ink-soft">{committee.description}</p><div className="mt-5 border-t border-appna-maroon/10 pt-4"><p className="font-accent text-xs font-semibold uppercase tracking-[0.14em] text-appna-maroon">Chair</p><p className="mt-1 text-sm font-semibold text-appna-ink">{committee.chair.name}</p></div></SectionCard>; })}
        </SectionGrid>
        <div className="mt-7"><TextLink href="/Committees">All Committees</TextLink></div>
      </Section>

      <Section eyebrow="Our 2026 focus" title="Connecting as a family" intro="Four priorities for a stronger, more supportive chapter.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[{ icon: UsersRound, title: "Respect and trust", detail: "Foster mutual respect and trust among members and chapter leadership." }, { icon: HeartPulse, title: "Health and wellness", detail: "Promote the health and wellness of physicians and communities." }, { icon: Network, title: "Future physicians", detail: "Launch a mentorship program for future physicians." }, { icon: Stethoscope, title: "Residency support", detail: "Support young physicians entering the United States for residency opportunities." }].map((priority) => { const Icon = priority.icon; return <SectionCard key={priority.title}><Icon className="h-6 w-6 text-appna-maroon" aria-hidden="true" /><h3 className="mt-5 font-display text-2xl font-medium text-appna-maroon-dark">{priority.title}</h3><p className="mt-3 text-sm leading-6 text-appna-ink-soft">{priority.detail}</p></SectionCard>; })}
        </div>
        <div className="mt-7"><TextLink href="/organization#presidents-message">Read the president’s message</TextLink></div>
      </Section>

      <Section eyebrow="Gather and remember" title="Events and gallery" intro="See what is ahead and revisit chapter moments.">
        <SectionGrid className="lg:grid-cols-3">
          {upcomingEvents.map((event) => <SectionCard key={event.href} className="overflow-hidden p-0"><div className="relative aspect-[16/10] overflow-hidden bg-appna-surface-muted"><Image src={event.image} alt={event.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-300 group-hover:scale-105" /></div><div className="p-5"><p className="font-accent text-xs font-semibold uppercase tracking-[0.14em] text-appna-maroon">{event.date}</p><h3 className="mt-2 font-display text-2xl font-medium text-appna-maroon-dark">{event.title}</h3><p className="mt-3 text-sm leading-6 text-appna-ink-soft">{event.description}</p></div></SectionCard>)}
          <SectionCard><Landmark className="h-6 w-6 text-appna-maroon" aria-hidden="true" /><h3 className="mt-5 font-display text-2xl font-medium text-appna-maroon-dark">Chapter memories</h3><p className="mt-3 text-sm leading-6 text-appna-ink-soft">Browse photos and revisit past gatherings with the APPNA NC community.</p><div className="mt-auto pt-6"><TextLink href="/gallery">View gallery</TextLink></div></SectionCard>
        </SectionGrid>
        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3"><TextLink href="/upcoming_events">Upcoming events</TextLink><TextLink href="/past_events">Past events</TextLink><TextLink href="/gallery">View all gallery</TextLink></div>
      </Section>

      <Section eyebrow="Get involved" title="Make a difference" intro="Choose a meaningful way to participate in the chapter.">
        <SectionGrid>
          <SectionCard><UsersRound className="h-6 w-6 text-appna-maroon" aria-hidden="true" /><h3 className="mt-5 font-display text-2xl font-medium text-appna-maroon-dark">Membership</h3><p className="mt-3 text-sm leading-6 text-appna-ink-soft">Join a community of physicians, families, and future leaders.</p><div className="mt-auto pt-6"><TextLink href="/register">Join the chapter</TextLink></div></SectionCard>
          <SectionCard><HandHeart className="h-6 w-6 text-appna-maroon" aria-hidden="true" /><h3 className="mt-5 font-display text-2xl font-medium text-appna-maroon-dark">Sponsor or vendor</h3><p className="mt-3 text-sm leading-6 text-appna-ink-soft">Support chapter events through sponsorship or vendor participation.</p><div className="mt-auto flex flex-wrap gap-4 pt-6"><TextLink href="/sponsorship_proposal">Sponsor</TextLink><TextLink href="/vendor_registration">Vendor</TextLink></div></SectionCard>
          <SectionCard><HeartPulse className="h-6 w-6 text-appna-maroon" aria-hidden="true" /><h3 className="mt-5 font-display text-2xl font-medium text-appna-maroon-dark">Donate</h3><p className="mt-3 text-sm leading-6 text-appna-ink-soft">Help strengthen the chapter’s work and community initiatives.</p><div className="mt-auto pt-6"><TextLink href="/donate">Make a donation</TextLink></div></SectionCard>
        </SectionGrid>
      </Section>

      {/* <section className="bg-appna-maroon-dark py-12 text-white sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div><p className="font-accent text-xs font-semibold uppercase tracking-[0.2em] text-appna-accent-light">APPNA North Carolina</p><h2 className="mt-3 font-display text-3xl font-medium leading-tight sm:text-4xl">Build our chapter together.</h2></div>
          <div className="flex flex-wrap gap-3"><ActionLink href="/register">Join</ActionLink><Link href="/donate" className="inline-flex items-center justify-center rounded-full border border-white/40 px-5 py-3 font-accent text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-white/10">Donate</Link></div>
        </div>
      </section> */}
    </>
  );
}
