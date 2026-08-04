'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  { src: '/annual_banquet.png', alt: 'APPNA NC Annual Banquet & Entertainment 2026 flyer', caption: 'Annual Banquet & Entertainment' },
  { src: '/concert.jpg', alt: 'Amanat Ali live performance', caption: 'Live Performance — Amanat Ali' },
  { src: '/bazar.jpg', alt: 'APPNA NC Bazaar stalls', caption: 'The APPNA NC Bazaar' },
  { src: '/bazar_audience.png', alt: 'Guests browsing the APPNA NC Bazaar', caption: 'A Night to Remember' },
];

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 50;

export default function EventFlyerSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef(null);
  const dragState = useRef({ startX: 0, dragging: false, delta: 0 });
  const timerRef = useRef(null);

  const count = SLIDES.length;
  const goTo = useCallback((i) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Autoplay — pauses on hover/drag
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, count]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  // Pointer drag / swipe — scoped to the track only
  const onPointerDown = (e) => {
    dragState.current = { startX: e.clientX, dragging: true, delta: 0 };
    setPaused(true);
    trackRef.current?.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragState.current.dragging) return;
    dragState.current.delta = e.clientX - dragState.current.startX;
  };
  const onPointerUp = () => {
    if (!dragState.current.dragging) return;
    const { delta } = dragState.current;
    if (delta > SWIPE_THRESHOLD) prev();
    else if (delta < -SWIPE_THRESHOLD) next();
    dragState.current = { startX: 0, dragging: false, delta: 0 };
    setPaused(false);
  };

  // Arrow buttons live inside the draggable track, so every pointer/click
  // event on them must be stopped here — otherwise the track's
  // setPointerCapture() swallows the click before React ever sees it.
  const stopAndRun = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };

  return (
    <section
      className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="text-center mb-6 sm:mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#7a1f3d]/80 mb-2">
          This Year&apos;s Event
        </p>
        <h2 className="display-font text-2xl sm:text-3xl font-semibold text-gray-900">
          A Look at the Evening
        </h2>
      </div>

      {/* Calm, padded card frame around the slider */}
      <div className="rounded-2xl bg-[#faf8f6] border border-gray-200/70 shadow-md shadow-gray-200/50 p-3 sm:p-4">
        <div
          ref={trackRef}
          className="relative w-full overflow-hidden rounded-xl select-none touch-pan-y
                     h-[clamp(280px,80vw,340px)]
                     sm:h-[clamp(320px,55vw,420px)]
                     lg:h-[clamp(400px,42vw,520px)]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {SLIDES.map((slide) => (
              <div key={slide.src} className="relative h-full w-full flex-shrink-0 bg-[#f1eeea]">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 896px"
                  className="object-contain p-2 sm:p-3"
                  priority={slide === SLIDES[0]}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent px-4 sm:px-6 py-3 sm:py-4">
                  <p className="display-font text-white text-sm sm:text-lg font-medium drop-shadow-sm">
                    {slide.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Prev / Next arrows */}
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={stopAndRun(prev)}
            aria-label="Previous slide"
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10
                       h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/95 hover:bg-white
                       flex items-center justify-center shadow-sm transition-colors"
          >
            <ChevronLeft size={16} className="text-[#7a1f3d]" />
          </button>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={stopAndRun(next)}
            aria-label="Next slide"
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10
                       h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/95 hover:bg-white
                       flex items-center justify-center shadow-sm transition-colors"
          >
            <ChevronRight size={16} className="text-[#7a1f3d]" />
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === index ? '20px' : '6px',
              background: i === index ? '#7a1f3d' : '#e5e7eb',
            }}
          />
        ))}
      </div>
    </section>
  );
}