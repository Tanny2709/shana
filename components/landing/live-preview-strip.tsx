import Link from "next/link";

// Real, same-origin iframes of the actual live pages — scaled down via CSS
// transform, not screenshots or mockups — so this literally always matches
// the current product. The Link is an absolutely-positioned overlay
// sibling (not a wrapper) since an <iframe> isn't valid inside an <a>;
// the iframe itself is pointer-events-none — a preview, not a tiny
// interactive embed.
const PAGES = [
  { href: "/search?q=stripe", label: "Search results", path: "/search?q=stripe" },
  { href: "/domain/ai-ml", label: "Domain page", path: "/domain/ai-ml" },
  { href: "/api/stripe/stripe-api", label: "API detail", path: "/api/stripe/stripe-api" },
  { href: "/collections/best-free-ai-apis", label: "Collections", path: "/collections/best-free-ai-apis" },
] as const;

const IFRAME_WIDTH = 1280;
const IFRAME_HEIGHT = 820;
const SCALE = 0.24;

export function LivePreviewStrip() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {PAGES.map((page) => (
        <div
          key={page.href}
          className="group relative w-72 shrink-0 overflow-hidden rounded-lg border border-border bg-bg-elevated transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:scale-[1.02]"
        >
          <Link href={page.href} className="absolute inset-0 z-10" aria-label={`Open ${page.label}`} />

          {/* Browser-chrome frame */}
          <div className="flex items-center gap-1.5 border-b border-border bg-bg-elevated px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-fg-subtle/40" />
            <span className="h-2 w-2 rounded-full bg-fg-subtle/40" />
            <span className="h-2 w-2 rounded-full bg-fg-subtle/40" />
            <span className="ml-2 truncate rounded bg-bg px-2 py-0.5 text-[10px] text-fg-subtle">
              {page.path}
            </span>
          </div>

          <div
            className="relative overflow-hidden bg-bg"
            style={{ width: IFRAME_WIDTH * SCALE, height: IFRAME_HEIGHT * SCALE }}
          >
            <iframe
              src={page.href}
              title={page.label}
              tabIndex={-1}
              loading="lazy"
              className="pointer-events-none absolute top-0 left-0 origin-top-left border-0"
              style={{ width: IFRAME_WIDTH, height: IFRAME_HEIGHT, transform: `scale(${SCALE})` }}
            />
          </div>

          <p className="border-t border-border px-3 py-2 text-xs font-medium text-fg-muted group-hover:text-fg">
            {page.label}
          </p>
        </div>
      ))}
    </div>
  );
}
