"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Static screenshots of the real live pages (public/showcase/*.png), not
// live iframes — embedding 5 full page navigations here made this section
// noticeably slow to appear. Each image is a real capture of the actual
// route at desktop width, so it still shows genuine product UI, it just
// doesn't self-update — regenerate the screenshots (see scripts, or
// re-capture at 1280x860) if the underlying pages change meaningfully.
// The "Open →" link always goes to the real, live, interactive page.
const TABS = [
  { key: "search", label: "Search", href: "/search?q=stripe", path: "/search?q=stripe", image: "/showcase/search.png" },
  { key: "browse", label: "Browse", href: "/domain/ai-ml", path: "/domain/ai-ml", image: "/showcase/browse.png" },
  {
    key: "evaluate",
    label: "Evaluate",
    href: "/api/stripe/stripe-api",
    path: "/api/stripe/stripe-api",
    image: "/showcase/evaluate.png",
  },
  {
    key: "compare",
    label: "Compare",
    href: "/compare?ids=stripe-api,razorpay-api",
    path: "/compare",
    image: "/showcase/compare.png",
  },
  {
    key: "discover",
    label: "Discover",
    href: "/collections/best-free-ai-apis",
    path: "/collections",
    image: "/showcase/discover.png",
  },
] as const;

const IMAGE_WIDTH = 1280;
const IMAGE_HEIGHT = 860;

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

      <div className="mt-10 flex items-center justify-center gap-1 overflow-x-auto">
        {TABS.map((t, i) => (
          <div key={t.key} className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setActive(t.key)}
              className={`shrink-0 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                active === t.key ? "bg-accent text-accent-fg" : "text-fg-muted hover:text-fg"
              }`}
            >
              {t.label}
            </button>
            {i < TABS.length - 1 && (
              <button
                type="button"
                onClick={() => setActive(TABS[i + 1].key)}
                aria-label={`Show ${TABS[i + 1].label}`}
                className="animate-nudge-right shrink-0 px-0.5 text-fg-subtle transition-colors hover:text-accent"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            )}
          </div>
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
        <div className="relative w-full bg-bg" style={{ aspectRatio: `${IMAGE_WIDTH} / ${IMAGE_HEIGHT}` }}>
          <Image
            key={tab.key}
            src={tab.image}
            alt={`${tab.label} view of the ${tab.path} page`}
            fill
            sizes="(max-width: 1024px) 100vw, 896px"
            priority={tab.key === "search"}
            className="object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}
