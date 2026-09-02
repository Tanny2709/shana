import Link from "next/link";
import { getAllActiveListingsSorted, getSupportedLanguages, type BrowseSort } from "@/lib/data";
import { ApiCard } from "@/components/api-card";

export const metadata = { title: "Browse all APIs" };

const SORTS: { value: BrowseSort; label: string }[] = [
  { value: "score", label: "Highest rated" },
  { value: "value", label: "Best value" },
  { value: "recent-added", label: "Recently added" },
  { value: "recent-verified", label: "Recently verified" },
  { value: "name", label: "Name (A–Z)" },
];

const FEATURES = [
  { key: "webhooks", label: "Webhooks", field: "webhookSupport" as const },
  { key: "graphql", label: "GraphQL", field: "graphqlSupport" as const },
  { key: "websocket", label: "WebSocket", field: "websocketSupport" as const },
];

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; lang?: string; features?: string }>;
}) {
  const sp = await searchParams;
  const sort = (SORTS.find((s) => s.value === sp.sort)?.value ?? "score") as BrowseSort;
  const activeFeatures = new Set((sp.features ?? "").split(",").filter(Boolean));

  const [allListings, languages] = await Promise.all([getAllActiveListingsSorted(sort), getSupportedLanguages()]);

  const listings = allListings.filter((l) => {
    if (sp.lang && !l.supportedLanguages.includes(sp.lang)) return false;
    for (const f of FEATURES) {
      if (activeFeatures.has(f.key) && !l[f.field]) return false;
    }
    return true;
  });

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const next = { sort: sp.sort, lang: sp.lang, features: sp.features, ...overrides };
    for (const [k, v] of Object.entries(next)) if (v) params.set(k, v);
    const qs = params.toString();
    return `/browse${qs ? `?${qs}` : ""}`;
  };

  function toggleFeatureHref(key: string) {
    const next = new Set(activeFeatures);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return buildHref({ features: next.size > 0 ? [...next].join(",") : undefined });
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-fg">Browse all APIs</h1>
      <p className="mt-1 text-sm text-fg-muted">Every active listing in the directory, sorted your way.</p>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {SORTS.map((s) => (
          <Link
            key={s.value}
            href={buildHref({ sort: s.value === "score" ? undefined : s.value })}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              sort === s.value ? "bg-accent text-accent-fg" : "border border-border text-fg-muted hover:text-fg"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-border bg-bg-elevated p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-medium text-fg-subtle">Language</span>
          <Link
            href={buildHref({ lang: undefined })}
            className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
              !sp.lang ? "bg-accent text-accent-fg" : "border border-border text-fg-muted hover:text-fg"
            }`}
          >
            Any
          </Link>
          {languages.slice(0, 8).map((l) => (
            <Link
              key={l.language}
              href={buildHref({ lang: sp.lang === l.language ? undefined : l.language })}
              className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                sp.lang === l.language
                  ? "bg-accent text-accent-fg"
                  : "border border-border text-fg-muted hover:text-fg"
              }`}
            >
              {l.language} <span className="opacity-70">{l.count}</span>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-medium text-fg-subtle">Features</span>
          {FEATURES.map((f) => (
            <Link
              key={f.key}
              href={toggleFeatureHref(f.key)}
              className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                activeFeatures.has(f.key)
                  ? "bg-accent text-accent-fg"
                  : "border border-border text-fg-muted hover:text-fg"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {(sp.lang || activeFeatures.size > 0) && (
          <Link href={buildHref({ lang: undefined, features: undefined })} className="ml-auto text-xs text-accent hover:underline">
            Clear filters
          </Link>
        )}
      </div>

      <p className="mt-6 mb-4 text-sm text-fg-subtle">{listings.length} APIs</p>
      {listings.length === 0 ? (
        <p className="rounded-lg border border-border bg-bg-elevated px-4 py-8 text-center text-sm text-fg-muted">
          No APIs match these filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <ApiCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}
