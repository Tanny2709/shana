import Link from "next/link";
import { searchListings, getListingsBySlugs, getListingsBySlugsCard, getUseCaseCounts } from "@/lib/data";
import { ApiCard } from "@/components/api-card";
import { PricingTable } from "@/components/pricing-table";
import { RevealBlock } from "@/components/landing/reveal-block";

// Every block below renders real seeded data through the app's real
// components (<ApiCard />, <PricingTable />) — not icons or illustrations —
// so this section can never drift out of sync with the actual product.
// Each is wrapped in RevealBlock for the staggered entrance + slow idle
// glow called for in §4 (80-120ms steps, ~8-12s idle loop).
export async function FeaturesLive() {
  const [searchResults, compareListings, bookmarkExample, useCases] = await Promise.all([
    searchListings("stripe"),
    getListingsBySlugs(["openai-api", "claude-api"]),
    getListingsBySlugsCard(["openai-api"]),
    getUseCaseCounts(),
  ]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search everything — a real query against the real search index */}
      <RevealBlock index={0} glow>
        <div className="rounded-lg border border-border bg-bg-elevated p-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[240px_1fr]">
            <div>
              <h3 className="text-sm font-medium text-fg">Search everything</h3>
              <p className="mt-1 text-xs text-fg-muted">
                Typo-tolerant, ranked search across every API&rsquo;s name, provider, and use cases.
              </p>
              <Link href="/search" className="mt-3 inline-block text-xs text-accent hover:underline">
                Try it →
              </Link>
            </div>
            <div>
              <div className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg">
                stripe
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {searchResults.slice(0, 2).map((listing) => (
                  <ApiCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </RevealBlock>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Compare side by side — two real listings, real PricingTable */}
        <RevealBlock index={1} glow>
          <div className="rounded-lg border border-border bg-bg-elevated p-5">
            <h3 className="text-sm font-medium text-fg">Compare side by side</h3>
            <p className="mt-1 text-xs text-fg-muted">
              Pick 2 or 3 APIs and line up pricing, rate limits, and auth methods.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {compareListings.map((listing) => (
                <div key={listing.id}>
                  <p className="mb-1.5 text-xs font-medium text-fg-subtle">{listing.name}</p>
                  <PricingTable
                    pricingModel={listing.pricingModel}
                    pricingSummary={listing.pricingSummary}
                    freeTierAvailable={listing.freeTierAvailable}
                    freeTierDetails={listing.freeTierDetails}
                    rateLimits={listing.rateLimits}
                  />
                </div>
              ))}
            </div>
            <Link href="/compare" className="mt-3 inline-block text-xs text-accent hover:underline">
              Open comparison →
            </Link>
          </div>
        </RevealBlock>

        {/* Bookmark & save — the real, fully-interactive ApiCard bookmark toggle */}
        <RevealBlock index={2} glow>
          <div className="rounded-lg border border-border bg-bg-elevated p-5">
            <h3 className="text-sm font-medium text-fg">Bookmark & save</h3>
            <p className="mt-1 text-xs text-fg-muted">
              Save domains and APIs to your account — the icon below is live, not a mockup.
            </p>
            <div className="mt-3">{bookmarkExample[0] && <ApiCard listing={bookmarkExample[0]} />}</div>
          </div>
        </RevealBlock>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Curated collections */}
        <RevealBlock index={3} glow>
          <div className="rounded-lg border border-border bg-bg-elevated p-5">
            <h3 className="text-sm font-medium text-fg">Curated collections</h3>
            <p className="mt-1 text-xs text-fg-muted">Hand-picked groups for common needs.</p>
            <Link
              href="/collections/best-free-ai-apis"
              className="mt-3 flex items-center justify-between rounded-md border border-border bg-bg px-3 py-2 text-xs text-fg hover:border-border-strong"
            >
              Best free AI APIs
              <span className="text-fg-subtle">→</span>
            </Link>
          </div>
        </RevealBlock>

        {/* Browse by use case — real tag cloud, real counts */}
        <RevealBlock index={4} glow>
          <div className="rounded-lg border border-border bg-bg-elevated p-5">
            <h3 className="text-sm font-medium text-fg">Browse by use case</h3>
            <p className="mt-1 text-xs text-fg-muted">A second axis into the directory.</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {useCases.slice(0, 6).map(({ useCase, count }) => (
                <Link
                  key={useCase}
                  href={`/search?q=${encodeURIComponent(useCase)}`}
                  className="flex items-center gap-1 rounded-full border border-border bg-bg px-2.5 py-1 text-[11px] text-fg-muted hover:border-border-strong hover:text-fg"
                >
                  {useCase} <span className="text-fg-subtle">{count}</span>
                </Link>
              ))}
            </div>
          </div>
        </RevealBlock>
      </div>
    </div>
  );
}
