import Image from "next/image";

export default function AboutHeroSection() {
  return (
    <section className="relative w-full h-105 sm:h-120 md:h-135 lg:h-145 overflow-hidden">
      
      {/* Background Image */}
      <Image
        src="/aboutus.png"
        alt="About APPNA North Carolina"
        fill
        priority
        className="object-cover"
      />

      {/* Dark, Rich Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-[#07140e]/80 via-[#07140e]/85 to-[#040a07]/90" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl px-6 sm:px-10 md:px-14 text-white">
          
          {/* Section Label */}
          <p
            className="
              text-xs sm:text-sm uppercase tracking-widest
              text-green-300
              opacity-0 translate-y-4
              animate-[fadeUp_0.8s_ease-out_forwards]
            "
          >
            About Us
          </p>

          {/* Heading */}
          <h2
            className="
              mt-3
              text-2xl sm:text-3xl md:text-4xl lg:text-5xl
              font-semibold tracking-tight
              max-w-4xl
              opacity-0 translate-y-4
              animate-[fadeUp_0.8s_ease-out_0.15s_forwards]
            "
          >
            Advancing Medicine, Education & Humanitarian Service
          </h2>

          {/* Description */}
          <p
            className="
              mt-6 max-w-3xl
              text-sm sm:text-base md:text-lg
              text-green-100 leading-relaxed
              opacity-0 translate-y-4
              animate-[fadeUp_0.8s_ease-out_0.3s_forwards]
            "
          >
            The Association of Physicians of Pakistani Descent of North America (APPNA)
            is a not-for-profit organization dedicated to fostering scientific advancement,
            medical education, and high-quality healthcare for all — irrespective of race,
            color, creed, or gender.
          </p>

          <p
            className="
              mt-4 max-w-3xl
              text-sm sm:text-base
              text-green-100 leading-relaxed
              opacity-0 translate-y-4
              animate-[fadeUp_0.8s_ease-out_0.45s_forwards]
            "
          >
            Established in 1976, APPNA is among the largest ethnic medical societies in
            North America, representing over <span className="font-semibold text-white">18,000</span>{" "}
            physicians and healthcare professionals across the United States and Canada.
            The North Carolina Chapter, founded in 2003, actively serves communities in
            North Carolina and Pakistan through social, educational, and charitable initiatives.
          </p>
        </div>
      </div>
    </section>
  );
}
