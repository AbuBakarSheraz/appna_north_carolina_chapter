import Image from "next/image";

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

      {/* GRADIENT OVERLAY (modern & responsive) */}
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
        <div className="max-w-7xl px-6 sm:px-10 lg:px-12 text-white pb-12 sm:pb-0">
          
          {/* Title */}
          <h1
            className="
              text-3xl sm:text-4xl md:text-5xl lg:text-6xl
              font-semibold leading-tight max-w-4xl
              opacity-0 translate-y-4
              animate-[fadeUp_0.8s_ease-out_forwards]
            "
          >
            APPNA North <span className="text-primary-dark underline-offset-2">Carolina</span>
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
      </div>
    </section>
  );
}
