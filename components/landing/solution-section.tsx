import Link from "next/link";

const PANELS = [
  {
    number: "01",
    title: "Discover",
    body: "Find APIs by domain, use case, or pricing model.",
    items: ["By domain", "By use case", "By pricing"],
    cta: "Browse APIs →",
    href: "/browse",
  },
  {
    number: "02",
    title: "Evaluate",
    body: "Understand pricing, free tiers, authentication, rate limits, and developer support before you sign up for anything.",
    items: ["Pricing & free tier", "Authentication", "Rate limits", "Developer support"],
    cta: "See how API pages work →",
    href: "/api/stripe/stripe-api",
  },
  {
    number: "03",
    title: "Compare",
    body: "Put alternatives side by side — pricing, scores, and limits in one table.",
    items: ["Side-by-side pricing", "Directory Score", "Free tier comparison"],
    cta: "Compare APIs →",
    href: "/compare",
  },
] as const;

export function SolutionSection() {
  return (
    <div>
      <div className="mx-auto max-w-lg text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          Everything you need to evaluate an API.
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {PANELS.map((panel) => (
          <div key={panel.number} className="flex flex-col rounded-xl border border-border bg-bg-elevated p-6">
            <span className="text-xs font-medium text-fg-subtle">{panel.number}</span>
            <h3 className="mt-2 text-lg font-medium text-fg">{panel.title}</h3>
            <p className="mt-2 text-sm text-fg-muted">{panel.body}</p>
            <ul className="mt-4 flex flex-col gap-1.5">
              {panel.items.map((item) => (
                <li key={item} className="text-xs text-fg-subtle">
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={panel.href}
              className="mt-6 text-sm font-medium text-accent hover:underline"
            >
              {panel.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
