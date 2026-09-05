import Link from "next/link";
import { getDomains, getListingsByDomain } from "@/lib/data";
import { computeScore } from "@/lib/scoring";
import { authMethodLabel } from "@/lib/format";
import { ApiCard } from "@/components/api-card";
import type { AuthMethod } from "@prisma/client";

export const revalidate = 60;

export const metadata = {
  title: "Free APIs",
  description: "APIs you can start using for free — grouped by domain, with real free-tier details.",
};

const AUTH_METHODS: AuthMethod[] = ["api_key", "oauth", "both", "none"];
const MIN_SCORES = [0, 60, 75, 85];

export default async function FreeApisPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string; auth?: string; minScore?: string }>;
}) {
  const sp = await searchParams;
  const authFilter = AUTH_METHODS.includes(sp.auth as AuthMethod) ? (sp.auth as AuthMethod) : undefined;
  const minScore = MIN_SCORES.includes(Number(sp.minScore)) ? Number(sp.minScore) : 0;

  const allDomains = await getDomains();
  const domains = sp.domain ? allDomains.filter((d) => d.slug === sp.domain) : allDomains;

  const sections = await Promise.all(
    domains.map(async (d) => {
      const listings = await getListingsByDomain(d.slug, {
        freeTierOnly: true,
        authMethod: authFilter,
        sort: "name",
      });
      const scored = listings
        .map((l) => ({ ...l, directoryScore: computeScore(l, 1) }))
        .filter((l) => l.directoryScore.overall >= minScore);
      return { domain: d, listings: scored };
    }),
  );
  const withResults = sections.filter((s) => s.listings.length > 0);
  const totalFree = withResults.reduce((sum, s) => sum + s.listings.length, 0);

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const next = { domain: sp.domain, auth: sp.auth, minScore: sp.minScore, ...overrides };
    for (const [k, v] of Object.entries(next)) if (v) params.set(k, v);
    const qs = params.toString();
    return `/free-apis${qs ? `?${qs}` : ""}`;
  };

  const hasFilters = Boolean(sp.domain || sp.auth || sp.minScore);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">
          The best APIs you can start using for free.
        </h1>
        <p className="mt-3 text-sm text-fg-muted">
          {totalFree} APIs {withResults.length > 0 && `across ${withResults.length} domains `}have a genuine
          free tier — no invented request quotas, just what each provider actually documents.
        </p>
      </div>

      <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 rounded-lg border border-border bg-bg-elevated p-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <FilterGroup label="Domain">
            <FilterChip active={!sp.domain} href={buildHref({ domain: undefined })}>
              All
            </FilterChip>
            {allDomains.map((d) => (
              <FilterChip key={d.slug} active={sp.domain === d.slug} href={buildHref({ domain: d.slug })}>
                {d.name}
              </FilterChip>
            ))}
          </FilterGroup>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <FilterGroup label="Auth">
            <FilterChip active={!sp.auth} href={buildHref({ auth: undefined })}>
              Any
            </FilterChip>
            {AUTH_METHODS.map((m) => (
              <FilterChip key={m} active={sp.auth === m} href={buildHref({ auth: m })}>
                {authMethodLabel(m)}
              </FilterChip>
            ))}
          </FilterGroup>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <FilterGroup label="Min score">
            {MIN_SCORES.map((s) => (
              <FilterChip
                key={s}
                active={minScore === s}
                href={buildHref({ minScore: s === 0 ? undefined : String(s) })}
              >
                {s === 0 ? "Any" : `${s}+`}
              </FilterChip>
            ))}
          </FilterGroup>
          {hasFilters && (
            <Link href="/free-apis" className="ml-auto text-xs text-accent hover:underline">
              Clear filters
            </Link>
          )}
        </div>
      </div>

      {withResults.length === 0 ? (
        <p className="mt-12 rounded-lg border border-border bg-bg-elevated px-4 py-8 text-center text-sm text-fg-muted">
          No free-tier APIs match these filters.
        </p>
      ) : (
        <div className="mt-12 flex flex-col gap-12">
          {withResults.map((s) => (
            <section key={s.domain.slug} id={s.domain.slug} className="scroll-mt-20">
              <h2 className="mb-4 text-lg font-medium text-fg">Best Free {s.domain.name} APIs</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {s.listings.map((listing) => (
                  <div key={listing.id}>
                    <ApiCard listing={listing} />
                    {listing.freeTierDetails && (
                      <p className="mt-2 rounded-md border border-success/20 bg-success/5 px-3 py-2 text-xs text-fg-muted">
                        <span className="font-medium text-success">Free tier: </span>
                        {listing.freeTierDetails}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-xs font-medium text-fg-subtle">{label}</span>
      {children}
    </div>
  );
}

function FilterChip({ active, href, children }: { active: boolean; href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
        active ? "bg-accent text-accent-fg" : "border border-border text-fg-muted hover:text-fg"
      }`}
    >
      {children}
    </Link>
  );
}
