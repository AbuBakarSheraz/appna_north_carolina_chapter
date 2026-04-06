"use client";

import { Menu, X, Facebook, Linkedin,Instagram } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-22">
            
            {/* LOGO */}
            <div className="flex items-center">
              <Link href="/" className="cursor-pointer">
              <Image
                src="/logo.png"
                alt="Organization Logo"
                width={220}
                height={100}
                priority
                className="h-18 w-auto object-contain"
              />
              </Link>
            </div>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center gap-4">
              <Navbar />

              {/* CTA */}
              <Link href='/donate' className="cursor-pointer ml-4 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary-dark transition">
                Donate
              </Link>
               <Link href='/register' className="cursor-pointer ml-4 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary-dark transition">
                Join Us
              </Link>
               <Link href='/login' className="cursor-pointer ml-4 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary-dark transition">
                Login
              </Link>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[#F9FAF7] z-50 transform transition-transform duration-900
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">

          {/* CLOSE */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={26} />
            </button>
          </div>

          {/* NAV */}
          <div className="px-6">
            <Navbar isMobile onItemClick={() => setMobileOpen(false)} />
          </div>

          {/* CTA */}
          <div className="px-6 mt-6">
            <Link href='/donate' className="cursor-pointer w-full px-5 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition">
              Donate
            </Link>           
          </div>
           <div className="px-6 mt-7">
            <Link href='/register' className="cursor-pointer w-full px-5 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition">
              Join Us
            </Link>
          </div>
           <div className="px-6 mt-7">
            <Link href='/login' className="cursor-pointerw-full px-6.25 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition">
              Login
            </Link>
          </div>

          {/* SOCIAL */}
          <div className="mt-auto p-6 flex gap-6 text-gray-500">
            <Facebook className="hover:text-primary transition cursor-pointer" />
            <Linkedin className="hover:text-primary transition cursor-pointer" />
            <Instagram className="hover:text-primary transition cursor-pointer" />

          </div>
        </div>
      </div>
    </>
  );
}
