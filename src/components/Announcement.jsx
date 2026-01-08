"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function Announcement() {
  const [open, setOpen] = useState(true);
  const [showFab, setShowFab] = useState(false);
  const fabRef = useRef(null);

  // Auto close after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
      setShowFab(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => {
            setOpen(false);
            setShowFab(true);
          }}
        >
          {/* STOP PROPAGATION */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setOpen(false);
                setShowFab(true);
              }}
              className="absolute top-4 right-4 z-10 text-white font-bold"
            >
              <X size={20} />
            </button>

            {/* Image */}
            <div className="relative h-105">
              <Image
                src="/future_events/meet.jpeg"
                alt="APPNA NC Meet & Greet 2026"
                fill
                className="object-cover"
              />
            </div>

            {/* CTA */}
            <div className="p-6 text-center">
              <a
                href="https://www.paypal.com/ncp/payment/59TCEBZFKT5DU"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setOpen(false);
                  setShowFab(true);
                }}
                className="inline-flex items-center justify-center w-full rounded-xl bg-[#7a1f3d] px-6 py-3 text-white font-medium hover:bg-[#5f1730] transition"
              >
Register by February 7              </a>

              <p className="mt-3 text-xs text-gray-500">
                Secure payment via PayPal
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON */}
      {showFab && (
        <div
          ref={fabRef}
          style={{ top: "15%", right: "8px" }}
          className="
            fixed z-90
            flex items-center justify-center
            w-17 h-17 rounded-full
            bg-emerald-500
            text-[#7a1f3d] text-sm font-medium
            shadow-lg
            cursor-move
            animate-pulse
            select-none
          "
          onClick={() => setOpen(true)}
        >
          Event
        </div>
      )}
    </>
  );
}
