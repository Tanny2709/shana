import Link from "next/link";

// Only real, existing routes — no "Legal"/"About" column, since this
// project has no privacy/terms/about pages to link to and a placeholder
// link would just be a dead end.
const COLUMNS = [
  {
    heading: "Discover",
    links: [
      { label: "Browse all APIs", href: "/browse" },
      { label: "Use cases", href: "/use-cases" },
      { label: "Collections", href: "/collections" },
      { label: "Free APIs", href: "/free-apis" },
    ],
  },
  {
    heading: "Tools",
    links: [
      { label: "Compare APIs", href: "/compare" },
      { label: "Search", href: "/search" },
      { label: "Bookmarks", href: "/bookmarks" },
    ],
  },
  {
    heading: "Contribute",
    links: [
      { label: "Add an API", href: "/contribute" },
      { label: "Log in", href: "/login" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="text-sm font-semibold tracking-tight text-fg">
              Shana
            </Link>
            <p className="mt-2 text-sm text-fg-subtle">Find the right API faster.</p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-medium uppercase tracking-wide text-fg-subtle">{col.heading}</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-fg-muted transition-colors hover:text-fg">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 text-xs text-fg-subtle">
          &copy; {new Date().getFullYear()} Shana. Not affiliated with any listed API provider.
        </p>
      </div>
    </footer>
  );
}
