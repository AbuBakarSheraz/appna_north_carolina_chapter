"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Organization", href: "/organization" },
  { label: "Executive Team", href: "/executive_team" },
  { label: "Projects", href: "/projects" },
  { label: "Upcoming Events", href: "/upcoming_events" },
  { label: "Past Events", href: "/past_events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact_us" },
];

export default function Navbar({ isMobile = false, onItemClick }) {
  const pathname = usePathname();

  return (
    <nav>
      <ul
        className={`flex ${
          isMobile
            ? "flex-col divide-y divide-gray-200"
            : "items-center gap-1"
        }`}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onItemClick}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition
                  ${
                    isActive
                      ? "text-primary bg-primary-light"
                      : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                  }
                `}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
