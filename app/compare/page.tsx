import Link from "next/link";
import { getListingsBySlugsCard } from "@/lib/data";
import { computeScore } from "@/lib/scoring";
import { ProviderMark } from "@/components/provider-mark";
import { PricingTable } from "@/components/pricing-table";
import { FreshnessIndicator } from "@/components/freshness-indicator";
import { RemoveFromCompareButton } from "@/components/remove-from-compare-button";
import { ScoreBadge } from "@/components/score-badge";
import { authMethodLabel } from "@/lib/format";

export const revalidate = 60;

export const metadata = {
  title: "Compare APIs",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids = "" } = await searchParams;
  const slugs = ids
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const listings = slugs.length > 0 ? await getListingsBySlugsCard(slugs) : [];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-fg">Compare APIs</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Pick 2 or 3 APIs from any listing page (the checkmark on each card) and compare them
        side by side.
      </p>

      {listings.length < 2 ? (
        <div className="mt-8 rounded-lg border border-border bg-bg-elevated px-6 py-12 text-center">
          <p className="text-sm text-fg-muted">
            {listings.length === 0
              ? "Nothing to compare yet."
              : "Select at least one more API to compare."}
          </p>
          <Link href="/" className="mt-3 inline-block text-sm text-accent hover:underline">
            Browse APIs
          </Link>
        </div>
      ) : (
        <div
          className="mt-8 grid grid-cols-1 gap-4"
          style={{ gridTemplateColumns: `repeat(${listings.length}, minmax(0, 1fr))` }}
        >
          {listings.map((listing) => (
            <div key={listing.id} className="flex flex-col gap-4">
              <div className="rounded-lg border border-border bg-bg-elevated p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <ProviderMark name={listing.provider.name} logoUrl={listing.provider.logoUrl} />
                    <div>
                      <Link
                        href={`/api/${listing.provider.slug}/${listing.slug}`}
                        className="text-sm font-medium text-fg hover:underline"
                      >
                        {listing.name}
                      </Link>
                      <p className="text-xs text-fg-subtle">{listing.provider.name}</p>
                    </div>
                  </div>
                  <RemoveFromCompareButton slug={listing.slug} />
                </div>
                <p className="mt-3 text-sm text-fg-muted">{listing.shortDescription}</p>
                <div className="mt-3 flex items-center justify-between">
                  <FreshnessIndicator date={listing.lastVerifiedAt} status={listing.status} />
                  <ScoreBadge overall={computeScore(listing, 1).overall} />
                </div>
                <a
                  href={listing.signupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-accent px-3 py-2 text-xs font-medium text-accent-fg hover:opacity-90"
                >
                  Get API Key
                </a>
              </div>

              <PricingTable
                pricingModel={listing.pricingModel}
                pricingSummary={listing.pricingSummary}
                freeTierAvailable={listing.freeTierAvailable}
                freeTierDetails={listing.freeTierDetails}
                rateLimits={listing.rateLimits}
              />

              <div className="rounded-lg border border-border bg-bg-elevated p-4">
                <h3 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-fg-subtle">
                  Auth method
                </h3>
                <p className="text-sm text-fg">{authMethodLabel(listing.authMethod)}</p>

                {listing.useCases.length > 0 && (
                  <>
                    <h3 className="mb-1.5 mt-4 text-xs font-medium uppercase tracking-wide text-fg-subtle">
                      Use cases
                    </h3>
                    <ul className="flex flex-wrap gap-1.5">
                      {listing.useCases.map((uc) => (
                        <li
                          key={uc}
                          className="rounded-full border border-border px-2 py-0.5 text-[11px] text-fg-muted"
                        >
                          {uc}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
