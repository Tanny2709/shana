"use client";

import { useState } from "react";
import Link from "next/link";

// Real, same-origin iframes of the actual live pages — not screenshots or
// illustrations — rendered at a real desktop width then scaled down via
// CSS transform (not width:100%, which would force the embedded page into
// a narrow mobile layout and hide desktop-only chrome like sidebars). Can
// never drift out of sync with the real product.
const TABS = [
  { key: "search", label: "Search", href: "/search?q=stripe", path: "/search?q=stripe" },
  { key: "browse", label: "Browse", href: "/domain/ai-ml", path: "/domain/ai-ml" },
  { key: "evaluate", label: "Evaluate", href: "/api/stripe/stripe-api", path: "/api/stripe/stripe-api" },
  { key: "compare", label: "Compare", href: "/compare?ids=stripe-api,razorpay-api", path: "/compare" },
  { key: "discover", label: "Discover", href: "/collections/best-free-ai-apis", path: "/collections" },
] as const;

const IFRAME_WIDTH = 1280;
const IFRAME_HEIGHT = 860;
const SCALE = 0.62; // renders inside the max-w-4xl frame at a real desktop width

export function ProductShowcase() {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("search");
  const tab = TABS.find((t) => t.key === active)!;

  return (
    <div>
      <div className="mx-auto max-w-lg text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-fg-subtle">Built for developers</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          From &ldquo;I need an API&rdquo;
          <br />
          to &ldquo;I know which one.&rdquo;
        </h2>
      </div>

      <div className="mt-10 flex justify-center gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActive(t.key)}
            className={`shrink-0 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
              active === t.key ? "bg-accent text-accent-fg" : "text-fg-muted hover:text-fg"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative mx-auto mt-6 w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-fg-subtle/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-fg-subtle/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-fg-subtle/30" />
          <span className="ml-2 truncate rounded bg-bg px-2 py-0.5 text-[11px] text-fg-subtle">{tab.path}</span>
          <Link href={tab.href} className="ml-auto shrink-0 text-[11px] text-accent hover:underline">
            Open →
          </Link>
        </div>
        {/* overflow-x-auto (not hidden): on narrow viewports this fixed-width
            preview scrolls horizontally instead of being clipped or forcing
            the page itself to scroll sideways. */}
        <div className="w-full overflow-x-auto bg-bg" style={{ height: IFRAME_HEIGHT * SCALE }}>
          <div className="relative" style={{ width: IFRAME_WIDTH * SCALE, height: IFRAME_HEIGHT * SCALE }}>
            <iframe
              key={tab.key}
              src={tab.href}
              title={tab.label}
              tabIndex={-1}
              loading="lazy"
              className="pointer-events-none absolute top-0 left-0 origin-top-left border-0"
              style={{ width: IFRAME_WIDTH, height: IFRAME_HEIGHT, transform: `scale(${SCALE})` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
