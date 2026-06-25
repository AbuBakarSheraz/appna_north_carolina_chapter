import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-[55vh] sm:h-[70vh] min-h-[420px] w-full overflow-hidden">

      {/* Background Image */}
      <Image
        src="/slide1.png"
        alt="Blue Ridge Parkway, North Carolina"
        fill
        priority
        className="object-cover object-center sm:object-[center_60%]"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/10 sm:from-black/80 sm:via-black/50 sm:to-black/20" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-end sm:items-center">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-10 lg:px-12 pb-10 sm:pb-0 text-white">

          {/* On mobile: stacked column. On sm+: row with text left, buttons right */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

            {/* ── Text block ── */}
            <div className="flex-1 min-w-0">
              <h1
                className="
                  text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                  font-semibold leading-tight
                  opacity-0 translate-y-4
                  animate-[fadeUp_0.8s_ease-out_forwards]
                "
              >
                APPNA North Carolina
              </h1>

              <p
                className="
                  mt-3 text-[10px] sm:text-xs tracking-widest uppercase
                  text-white/75
                  opacity-0 translate-y-4
                  animate-[fadeUp_0.8s_ease-out_0.15s_forwards]
                "
              >
                Association of Physicians of Pakistani Descent of North America
              </p>

              <p
                className="
                  mt-0.5 text-[10px] sm:text-xs tracking-widest uppercase
                  text-white/60
                  opacity-0 translate-y-4
                  animate-[fadeUp_0.8s_ease-out_0.2s_forwards]
                "
              >
                North Carolina Chapter
              </p>

              <p
                className="
                  mt-5 max-w-2xl text-sm sm:text-base lg:text-lg
                  text-white/85 leading-relaxed font-medium
                  opacity-0 translate-y-4
                  animate-[fadeUp_0.8s_ease-out_0.3s_forwards]
                "
              >
                A professional and educational organization of physicians of
                Pakistani descent serving the medical community across North Carolina.
              </p>
            </div>

            {/* ── Buttons ── */}
            <div
              className="
                flex flex-col gap-3
                w-full sm:w-auto sm:flex-shrink-0
                opacity-0 translate-y-4
                animate-[fadeUp_0.8s_ease-out_0.5s_forwards]
              "
            >
              <Link
                href="/events"
                className="
                  group relative overflow-hidden
                  flex items-center justify-center text-center
                  h-10 sm:h-12 lg:h-14
                  w-full sm:w-[220px] lg:w-[260px]
                  px-5 sm:px-6
                  rounded-2xl
                  border border-[#fbbf24]/40
                  bg-[#7a1f3d]/35
                  backdrop-blur-md
                  text-white font-semibold
                  text-xs sm:text-sm
                  tracking-wide leading-tight
                  transition-all duration-300
                  hover:scale-[1.03]
                  sponsor-glow
                "
              >
                <span className="absolute inset-0 rounded-2xl ring-1 ring-[#fbbf24]/20" />
                <span className="relative z-10">
                  Annual Banquet & Entertainment Tickets
                </span>
              </Link>

              <Link
                href="/sponsorship_proposal"
                className="
                  group relative overflow-hidden
                  flex items-center justify-center text-center
                  h-10 sm:h-12 lg:h-14
                  w-full sm:w-[220px] lg:w-[260px]
                  px-5 sm:px-6
                  rounded-2xl
                  border border-[#fbbf24]/40
                  bg-[#7a1f3d]/35
                  backdrop-blur-md
                  text-white font-semibold
                  text-xs sm:text-sm
                  tracking-wide
                  transition-all duration-300
                  hover:scale-[1.03]
                  sponsor-glow
                "
              >
                <span className="absolute inset-0 rounded-2xl ring-1 ring-[#fbbf24]/20" />
                <span className="relative z-10">Become a Sponsor</span>
              </Link>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes sponsorGlow {
          0%, 100% { box-shadow: 0 0 12px 2px rgba(251,191,36,0.18), 0 0 0 0 rgba(251,191,36,0); }
          50%       { box-shadow: 0 0 22px 6px rgba(251,191,36,0.28), 0 0 0 4px rgba(251,191,36,0.06); }
        }
        .sponsor-glow { animation: sponsorGlow 3s ease-in-out infinite; }
        .sponsor-glow:hover { animation: none; box-shadow: 0 0 28px 8px rgba(251,191,36,0.35); }
      `}</style>
    </section>
  );
}