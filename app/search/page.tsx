import { Suspense } from "react";
import Link from "next/link";
import { intentSearch, getDomains } from "@/lib/data";
import { hasIntentSignal } from "@/lib/intent-search";
import { ApiCard } from "@/components/api-card";
import { SearchBar } from "@/components/search-bar";
import { OnboardingCoachmarks } from "@/components/onboarding-coachmarks";

export const revalidate = 60;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const { results, intent } = q ? await intentSearch(q) : { results: [], intent: null };

  let interpretedAs: string | null = null;
  if (intent && hasIntentSignal(intent)) {
    const parts: string[] = [];
    if (intent.domainSlugs.length > 0) {
      const domains = await getDomains();
      const names = intent.domainSlugs
        .map((slug) => domains.find((d) => d.slug === slug)?.name)
        .filter((n): n is string => Boolean(n));
      if (names.length > 0) parts.push(names.join(", "));
    }
    if (intent.freeTierOnly) parts.push("free tier only");
    if (intent.preferCheap) parts.push("cheapest first");
    if (intent.residualQuery) parts.push(`matching "${intent.residualQuery}"`);
    if (parts.length > 0) interpretedAs = parts.join(" · ");
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <Suspense fallback={null}>
        <OnboardingCoachmarks />
      </Suspense>
      <div className="mx-auto max-w-xl">
        <SearchBar size="lg" defaultValue={q} />
      </div>

      <div className="mt-8">
        {!q ? (
          <div className="text-center text-sm text-fg-muted">
            <p>Search for an API by name, provider, or use case.</p>
            <p className="mt-2 text-fg-subtle">
              Try &ldquo;payments&rdquo;, &ldquo;free AI API&rdquo;, or &ldquo;cheap maps API&rdquo;.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center text-sm text-fg-muted">
            <p>
              No results for <span className="text-fg">&ldquo;{q}&rdquo;</span>.
            </p>
            <p className="mt-2 text-fg-subtle">
              Try a broader term, or browse by{" "}
              <Link href="/" className="text-accent hover:underline">
                domain
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <p className="mb-1 text-sm text-fg-subtle">
              {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{q}&rdquo;
            </p>
            {interpretedAs && (
              <p className="mb-4 text-xs text-fg-subtle">
                Interpreted as: <span className="text-accent">{interpretedAs}</span>
              </p>
            )}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((listing) => (
                <ApiCard key={listing.id} listing={listing} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
