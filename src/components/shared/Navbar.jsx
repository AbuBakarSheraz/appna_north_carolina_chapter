"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Organization", href: "/organization" },
  { label: "Executive Team", href: "/executive_team" },
  { label: "Committees", href: "/Committees" },
  { label: "Upcoming Events", href: "/upcoming_events" },
  { label: "Past Events", href: "/past_events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact_us" },
];

// Edit these three lines to restyle every link
const linkBase = "block whitespace-nowrap text-xs font-semibold uppercase tracking-wide border-b-2 transition";
const linkActive = "text-grove border-ridge";
const linkIdle = "text-ink-soft border-transparent hover:text-grove-dark hover:border-ridge";

export default function Navbar({ isMobile = false, onItemClick }) {
  const pathname = usePathname();

  // Desktop: links in a row. Mobile: links stacked in a column.
  const listLayout = isMobile ? "flex flex-col divide-y divide-line" : "flex items-center gap-6";
  const linkSpacing = isMobile ? "py-4" : "py-1";

  return (
    <nav aria-label="Primary navigation">
      <ul className={listLayout}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const stateClasses = isActive ? linkActive : linkIdle;

          return (
            <li key={item.href}>
              <Link href={item.href} onClick={onItemClick} className={`${linkBase} ${linkSpacing} ${stateClasses}`}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}