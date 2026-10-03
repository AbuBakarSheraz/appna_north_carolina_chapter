"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Announcement() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [showFab, setShowFab] = useState(false);
  const fabRef = useRef(null);
  const hideAnnouncement = pathname.startsWith("/events");

  useEffect(() => {
    if (hideAnnouncement) return undefined;

    const hasSeenAnnouncement = localStorage.getItem("appna-announcement-seen");
    if (hasSeenAnnouncement) {
      const timer = setTimeout(() => {
        setOpen(false);
        setShowFab(true);
      }, 0);

      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setOpen(false);
      setShowFab(true);
      localStorage.setItem("appna-announcement-seen", "true");
    }, 5000);

    return () => clearTimeout(timer);
  }, [hideAnnouncement]);

  useEffect(() => {
    const fab = fabRef.current;
    if (!fab || hideAnnouncement) return undefined;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    const startDrag = (event) => {
      isDragging = true;
      const pointer = event.touches ? event.touches[0] : event;
      offsetX = pointer.clientX - fab.offsetLeft;
      offsetY = pointer.clientY - fab.offsetTop;
    };
    const onDrag = (event) => {
      if (!isDragging) return;
      const pointer = event.touches ? event.touches[0] : event;
      fab.style.left = `${pointer.clientX - offsetX}px`;
      fab.style.top = `${pointer.clientY - offsetY}px`;
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
  }, [hideAnnouncement, showFab]);

  const handleClose = () => {
    setOpen(false);
    setShowFab(true);
    localStorage.setItem("appna-announcement-seen", "true");
  };

  if (hideAnnouncement) return null;

  return (
    <>
      {open ? <div className="fixed inset-0 z-[999] flex items-center justify-center bg-grove-dark/60 px-4 py-8 backdrop-blur-sm md:py-12" onClick={handleClose}><div role="dialog" aria-modal="true" aria-label="Featured event announcement" onClick={(event) => event.stopPropagation()} className="relative flex w-full max-w-[420px] flex-col overflow-hidden rounded-2xl bg-card shadow-2xl"><button type="button" onClick={handleClose} aria-label="Close announcement" className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-grove-dark/80 text-white transition hover:bg-grove-dark"><X size={15} strokeWidth={2.5} /></button><div className="max-h-[calc(100vh-160px)] flex-1 overflow-y-auto"><Image src="/future_events/Annual_Banquet.png" alt="APPNA NC Annual Banquet, Entertainment and CME 2026 flyer" width={440} height={600} className="block h-auto w-full" priority /></div><div className="flex shrink-0 border-t border-line p-5"><Link href="/events" onClick={handleClose} className="inline-flex w-full items-center justify-center rounded-xl bg-grove px-6 py-3 text-sm font-semibold text-white transition hover:bg-grove-dark">Buy Tickets Online</Link></div></div></div> : null}
      {showFab ? <button ref={fabRef} type="button" style={{ top: "15%", right: "8px" }} onClick={() => setOpen(true)} className="fixed z-[998] flex h-16 w-16 cursor-move select-none items-center justify-center rounded-full bg-grove text-xs font-bold text-white shadow-lg transition hover:bg-grove-dark">Event</button> : null}
    </>
  );
}
