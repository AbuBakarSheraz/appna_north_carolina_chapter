"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function Announcement() {
  const [open, setOpen] = useState(true);
  const [showFab, setShowFab] = useState(false);
  const fabRef = useRef(null);

  // Auto close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
      setShowFab(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setShowFab(true);
  };

  // Drag logic
  useEffect(() => {
    const fab = fabRef.current;
    if (!fab) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const startDrag = (e) => {
      isDragging = true;
      const event = e.touches ? e.touches[0] : e;
      offsetX = event.clientX - fab.offsetLeft;
      offsetY = event.clientY - fab.offsetTop;
    };

    const onDrag = (e) => {
      if (!isDragging) return;
      const event = e.touches ? e.touches[0] : e;
      fab.style.left = `${event.clientX - offsetX}px`;
      fab.style.top = `${event.clientY - offsetY}px`;
    };

    const stopDrag = () => {
      isDragging = false;
    };

    fab.addEventListener("mousedown", startDrag);
    fab.addEventListener("touchstart", startDrag);
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("touchmove", onDrag);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchend", stopDrag);

    return () => {
      fab.removeEventListener("mousedown", startDrag);
      fab.removeEventListener("touchstart", startDrag);
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("touchmove", onDrag);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchend", stopDrag);
    };
  }, []);

  return (
    <>
      {/* MODAL */}
      {open && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8 md:py-12"
          onClick={handleClose}
        >
          {/* CARD */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{
              maxWidth: "420px",
              maxHeight: "calc(100vh - 80px)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-3 right-3 z-20 flex items-center justify-center w-8 h-8 rounded-full transition hover:scale-110 active:scale-95"
              style={{
                background: "rgba(0,0,0,0.50)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <X size={15} color="#fff" strokeWidth={2.5} />
            </button>

            {/* Image — scrollable if taller than viewport */}
            <div className="overflow-y-auto flex-1">
              <Image
                src="/future_events/Annual_Banquet.png"
                alt="APPNA NC Meet & Greet 2026"
                width={440}
                height={600}
                className="w-full h-auto block"
                priority
              />
            </div>

            {/* CTA */}
            <div
              className="flex-shrink-0 px-5 py-4 flex flex-col gap-2"
              style={{ borderTop: "1px solid #f0f0f0" }}
            >
              <a
                href="/events"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
                className="flex items-center justify-center w-full rounded-xl text-white font-semibold text-sm py-3 px-6 transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #7a1f3d 0%, #9e2a50 100%)",
                  boxShadow: "0 4px 14px rgba(122,31,61,0.35)",
                }}
              >
                Buy Tickets Online
              </a>
              {/* <p className="text-center text-[11px] text-gray-400">
                Secure payment via PayPal
              </p> */}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON */}
      {showFab && (
        <div
          ref={fabRef}
          style={{ top: "15%", right: "8px" }}
          className="fixed z-[998] flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg cursor-move animate-pulse select-none"
          onClick={() => setOpen(true)}
        >
          Event
        </div>
      )}
    </>
  );
}