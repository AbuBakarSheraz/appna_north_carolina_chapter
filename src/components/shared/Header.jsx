"use client";

import { Facebook, Instagram, Linkedin, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";

// Edit these to restyle the buttons
const actionButton = "inline-flex items-center justify-center whitespace-nowrap rounded-full bg-grove px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-grove-dark";
const mobileActionButton = "inline-flex w-full items-center justify-center rounded-full bg-grove px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-grove-dark";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile menu with the Escape key
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const closeMenu = () => setMobileOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between gap-6 px-5 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="shrink-0" aria-label="APPNA North Carolina home">
            <Image src="/logo.png" alt="APPNA North Carolina logo" width={220} height={100} priority className="h-14 w-auto" />
          </Link>

          {/* Desktop menu: shows from 1536px and up */}
          <div className="hidden items-center gap-6 2xl:flex">
            <Navbar />
            <div className="flex items-center gap-2">
              <Link href="/donate" className={actionButton}>Donate</Link>
              <Link href="/register" className={actionButton}>Join Us</Link>
              <Link href="/login" className={actionButton}>Login</Link>
            </div>
          </div>

          {/* Mobile menu button: shows below 1536px */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-grove transition hover:bg-grove-soft 2xl:hidden"
          >
            <Menu size={23} aria-hidden="true" />
            <span className="sr-only">Open navigation</span>
          </button>
        </div>
      </header>

      {/* Dark overlay behind the mobile menu */}
      {mobileOpen ? (
        <button type="button" aria-label="Close navigation" onClick={closeMenu} className="fixed inset-0 z-40 bg-grove-dark/45 2xl:hidden" />
      ) : null}

      {/* Mobile menu panel (slides in from the right) */}
      <aside
        id="mobile-navigation"
        aria-hidden={!mobileOpen}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-card p-6 shadow-2xl transition-transform duration-300 2xl:hidden ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-line pb-5">
          <span className="font-display text-2xl font-medium text-grove-dark">Explore APPNA NC</span>
          <button type="button" onClick={closeMenu} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-grove transition hover:bg-grove-soft">
            <X size={22} aria-hidden="true" />
            <span className="sr-only">Close navigation</span>
          </button>
        </div>

        <div className="pt-4">
          <Navbar isMobile onItemClick={closeMenu} />
        </div>

        <div className="mt-6 grid gap-3 border-t border-line pt-6">
          <Link href="/donate" onClick={closeMenu} className={mobileActionButton}>Donate</Link>
          <Link href="/register" onClick={closeMenu} className={mobileActionButton}>Join Us</Link>
          <Link href="/login" onClick={closeMenu} className={mobileActionButton}>Login</Link>
        </div>

        <div className="mt-auto flex gap-5 pt-8 text-ink-soft">
          <Facebook className="h-5 w-5 transition hover:text-grove" aria-label="Facebook" />
          <Linkedin className="h-5 w-5 transition hover:text-grove" aria-label="LinkedIn" />
          <Instagram className="h-5 w-5 transition hover:text-grove" aria-label="Instagram" />
        </div>
      </aside>
    </>
  );
}