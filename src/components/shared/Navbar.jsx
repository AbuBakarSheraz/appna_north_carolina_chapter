"use client";

import Link from "next/link";

// Nav items with explicit routes (BEST PRACTICE)
const navItems = [
  { label: "Home", href: "/" },
  { label: "Organization", href: "/organization" },
  { label: "Executive Team", href: "/executive_team" },
  { label: "Projects", href: "/projects" },
  { label: "Upcoming Events", href: "/upcoming_events" },
  { label: "Past Events", href: "/past_events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact_us" },
];

export default function Navbar({ isMobile = false, onItemClick }) {
  return (
    <nav>
      <ul
        className={`flex ${
          isMobile
            ? "flex-col bg-[#F9FAF7]/80 gap-0"
            : "flex-wrap gap-x-2 px-8 pb-2"
        }`}
      >
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onItemClick}
              className={`block rounded-md font-semibold text-green-800 transition-all duration-300
                ${
                  isMobile
                    ? "px-4 py-2 text-base hover:bg-green-800 hover:text-white"
                    : "px-3 py-2 text-sm lg:text-base hover:bg-green-800 hover:text-white whitespace-nowrap"
                }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
