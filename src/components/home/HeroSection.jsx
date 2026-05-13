import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-[55vh] sm:h-[70vh] min-h-120 w-full overflow-hidden">

      {/* Background Image */}
      <Image
        src="/slide1.png"
        alt="Blue Ridge Parkway, North Carolina"
        fill
        priority
        className="
          object-cover
          object-center
          sm:object-[center_60%]
        "
      />

      {/* GRADIENT OVERLAY */}
      <div
        className="
          absolute inset-0
          bg-linear-to-t
          from-black/70 via-black/40 to-black/10
          sm:from-black/80 sm:via-black/50 sm:to-black/20
        "
      />

      {/* CONTENT */}
      <div className="relative z-10 flex h-full items-start mt-8 sm:mt-0 sm:items-center">
        <div className="w-full max-w-7xl px-6 sm:px-10 lg:px-12 text-white pb-12 sm:pb-0 flex items-start sm:items-center justify-between gap-6">

          {/* Left – existing text block */}
          <div className="flex-1">
            {/* Title */}
            <h1
              className="
                text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                font-semibold leading-tight max-w-4xl
                opacity-0 translate-y-4
                animate-[fadeUp_0.8s_ease-out_forwards]
              "
            >
              APPNA North <span className="">Carolina</span>
            </h1>

            {/* Subtitle */}
            <p
              className="
                mt-4 text-xs sm:text-sm tracking-widest uppercase
                text-white/80
                opacity-0 translate-y-4
                animate-[fadeUp_0.8s_ease-out_0.15s_forwards]
              "
            >
              Association of Physicians of Pakistani Descent of North America
            </p>

            <p
              className="
                mt-1 text-xs sm:text-sm tracking-widest uppercase
                text-white/70
                opacity-0 translate-y-4
                animate-[fadeUp_0.8s_ease-out_0.2s_forwards]
              "
            >
              North Carolina Chapter
            </p>

            {/* Description */}
            <p
              className="
                mt-6 max-w-3xl text-base sm:text-lg
                text-white/90 leading-relaxed
                font-medium
                opacity-0 translate-y-4
                animate-[fadeUp_0.8s_ease-out_0.3s_forwards]
              "
            >
              A professional and educational organization of physicians of
              Pakistani descent serving the medical community across North Carolina.
            </p>
          </div>

          {/* Right – Become a Sponsor CTA */}
          <div
            className="
              hidden sm:flex flex-col items-center gap-3
              opacity-0 translate-y-4
              animate-[fadeUp_0.8s_ease-out_0.5s_forwards]
              shrink-0
            "
          >
            <Link
              href="/sponsorship_proposal"
              className="
                group relative
                flex flex-col items-center gap-1.5
                px-7 py-4 rounded-2xl
                border border-white/30
                bg-white/10 backdrop-blur-sm
                text-white font-semibold text-sm sm:text-base
                tracking-wide text-center
                transition-all duration-300
                hover:bg-white/20 hover:border-white/50
                hover:scale-105
                sponsor-glow
              "
            >
              {/* Subtle animated ring */}
              <span
                className="
                  absolute inset-0 rounded-2xl
                  ring-1 ring-white/20
                  animate-[pulse_3s_ease-in-out_infinite]
                "
              />

              {/* Star icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-amber-300 group-hover:text-amber-200 transition-colors duration-300"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>

              <span className="leading-snug">
                Become a<br />
                <span className="text-amber-200 group-hover:text-amber-100 transition-colors duration-300">
                  Sponsor
                </span>
              </span>

              {/* Tiny event label */}
              <span className="text-[10px] text-white/60 font-normal tracking-widest uppercase mt-0.5">
                Oct 10 · 2026
              </span>
            </Link>
          </div>

        </div>
      </div>

      {/* Mobile-only Sponsor button pinned at bottom */}
      <div className="absolute bottom-5 right-5 sm:hidden z-20">
        <Link
          href="/sponsorship_proposal"
          className="
            flex items-center gap-2
            px-4 py-2.5 rounded-xl
            border border-white/30
            bg-white/15 backdrop-blur-sm
            text-white text-xs font-semibold tracking-wide
            sponsor-glow
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-amber-300"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Become a Sponsor
        </Link>
      </div>

      {/* Glow keyframe — add to your global CSS or tailwind config */}
      <style>{`
        @keyframes sponsorGlow {
          0%, 100% { box-shadow: 0 0 12px 2px rgba(251,191,36,0.18), 0 0 0 0 rgba(251,191,36,0); }
          50%       { box-shadow: 0 0 22px 6px rgba(251,191,36,0.28), 0 0 0 4px rgba(251,191,36,0.06); }
        }
        .sponsor-glow {
          animation: sponsorGlow 3s ease-in-out infinite;
        }
        .sponsor-glow:hover {
          animation: none;
          box-shadow: 0 0 28px 8px rgba(251,191,36,0.35);
        }
      `}</style>
    </section>
  );
}