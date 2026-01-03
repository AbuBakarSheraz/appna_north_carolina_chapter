"use client";
import { Menu, X, Facebook, Instagram, Linkedin } from 'lucide-react';
import Navbar from "@/components/shared/Navbar";
import Link from "next/link";

// Header Component
import React, { useState } from 'react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* HEADER */}
      <header className="bg-[#F9FAF7]/80 relative z-50">
        <div className=" px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 md:pt-2 ">
            {/* LOGO */}
            <div className="shrink-0">
              <img
                src="/logo.png"
                alt="Company Logo"
                className="h-13 sm:h-16 md:h-22 lg:h-28 w-auto object-contain"
              />
            </div>

            {/* DESKTOP ACTION BUTTONS & SOCIAL ICONS */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              {["Donate", "Join Now", "Member Login", "Contact Us"].map((item) => (
                <button
                  key={item}
                  className="px-4 py-2  text-sm font-semibold text-green-800 border border-green-800 rounded-lg transition-all duration-300 hover:bg-green-800 hover:text-white hover:shadow-lg hover:scale-105"
                >
                  {item}
                </button>
              ))}

              {/* DESKTOP SOCIAL ICONS */}
              <div className="flex items-center gap-2 ml-2 pl-2">
                <a
                  href="#"
                  className="p-2 text-green-800 border border-green-800 rounded-lg transition-all duration-300 hover:bg-green-800 hover:text-white hover:shadow-lg hover:scale-110"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  className="p-2 text-green-800 border border-green-800 rounded-lg transition-all duration-300 hover:bg-green-800 hover:text-white hover:shadow-lg hover:scale-110"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="p-2 text-green-800 border border-green-800 rounded-lg transition-all duration-300 hover:bg-green-800 hover:text-white hover:shadow-lg hover:scale-110"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-green-800 hover:bg-green-50 rounded-lg transition-colors"
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* DESKTOP NAVBAR */}
        <div className="hidden lg:block">
          <Navbar />
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* MOBILE SLIDE-IN MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-800 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* CLOSE BUTTON */}
          <div className="flex justify-end px-4 pt-4 ">
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-green-800  hover:bg-green-50 rounded-lg transition-colors"
            >
              <X size={28} />
            </button>
          </div>

          {/* MOBILE CONTENT */}
          <div className="flex-1 overflow-y-auto">
            {/* NAVBAR ITEMS FIRST */}
            <div className="px-2 py-2">
              <Navbar isMobile onItemClick={() => setMobileOpen(false)} />
            </div>

            {/* ACTION BUTTONS SECOND */}
            <div className="px-6 pb-6">
              <div className="flex flex-col gap-3 pt-4 ">
                {["Donate", "Join Now", "Member Login", "Contact Us"].map((item) => (
                  <button
                    key={item}
                    className="w-full px-4 py-3 text-sm font-semibold text-green-800 border border-green-800 rounded-lg transition-all duration-300 hover:bg-green-800 hover:text-white"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MOBILE SOCIAL ICONS AT BOTTOM */}
          <div className="p-6">
            <div className="flex gap-6">
              <a
                href="#"
                className="p-1  text-green-800  hover:bg-green-800 hover:text-white transition-all duration-500"
              >
                <Facebook size={35} />
              </a>
              <a
                href="#"
                className="p-1  text-green-800 rounded-lg hover:bg-green-800 hover:text-white transition-all duration-300"
              >
                <Instagram size={35} />
              </a>
              <a
                href="#"
                className="p-1  text-green-800 rounded-lg hover:bg-green-800 hover:text-white transition-all duration-300"
              >
                <Linkedin size={35} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}