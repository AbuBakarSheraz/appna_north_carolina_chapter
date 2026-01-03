import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative h-[70vh] min-h-125 w-full overflow-hidden">
      
      {/* Background Image */}
      <Image
        src="/slide1.png"
        alt="APPNA North Carolina - Physicians Community"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0F2F1D]/60" />

      {/* Content */}
      <div className="relative z-10 flex h-full mt-16 md:mt-0 md:items-center">
        <div className="max-w-7xl ml-4 sm:ml-6 md:ml-10 px-6 text-white">
          
          {/* Main Title */}
          <h1
            className="
              text-2xl sm:text-3xl md:text-4xl lg:text-5xl
              font-semibold leading-tight max-w-4xl
              opacity-0 translate-y-4 font-semibold
              animate-[fadeUp_0.8s_ease-out_forwards]
            "
          >
            APPNA North Carolina
          </h1>

          {/* Subtitle */}
          <p
            className="
              mt-3 text-sm sm:text-base
              tracking-widest uppercase text-green-200
              opacity-0 translate-y-4
              animate-[fadeUp_0.8s_ease-out_0.15s_forwards]
            "
          >
            Association of Physicians of Pakistani Descent of North America
          </p>
           <p
            className="
              mt-3 text-sm sm:text-base
              tracking-widest uppercase text-green-200
              opacity-0 translate-y-4
              animate-[fadeUp_0.8s_ease-out_0.15s_forwards]
            "
          >
            North Carolina Chapter
          </p>

          {/* Description */}
          <p
            className="
              mt-6 max-w-3xl text-base sm:text-lg
              text-green-100 leading-relaxed
              opacity-0 translate-y-4 font-semibold font-serif
              animate-[fadeUp_0.8s_ease-out_0.3s_forwards]
            "
          >
            We are a professional and educational organization of physicians
            of Pakistani descent serving the medical community in North Carolina.
          </p>
        </div>
      </div>
    </section>
  );
}
