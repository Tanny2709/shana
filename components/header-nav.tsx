"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ICONS = {
  compass: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12Z" />
    </svg>
  ),
  box: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73V8Z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </svg>
  ),
  bookmark: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21 12 16l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
    </svg>
  ),
  code: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m8 6-6 6 6 6M16 6l6 6-6 6" />
    </svg>
  ),
} as const;

const ITEMS = [
  { href: "/browse", label: "Discover", icon: "compass" },
  { href: "/use-cases", label: "Use Cases", icon: "box" },
  { href: "/collections", label: "Collections", icon: "bookmark" },
  { href: "/contribute", label: "Contribute", icon: "code" },
] as const;

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 lg:flex">
      {ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
              active ? "text-fg" : "text-fg-muted hover:text-fg"
            }`}
          >
            <span className={active ? "text-accent" : "text-fg-subtle"}>{ICONS[item.icon]}</span>
            {item.label}
            {active && (
              <span
                className="absolute inset-x-3 -bottom-px h-0.5 rounded-full"
                style={{ background: "var(--landing-gradient)" }}
                aria-hidden
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
