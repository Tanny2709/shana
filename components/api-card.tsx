import Link from "next/link";
import type { ListingCard } from "@/lib/data";
import { pricingModelLabel, authMethodLabel } from "@/lib/format";
import { computeScore } from "@/lib/scoring";
import { FreshnessIndicator } from "@/components/freshness-indicator";
import { ProviderMark } from "@/components/provider-mark";
import { CompareTextToggle } from "@/components/compare-text-toggle";
import { BookmarkButton } from "@/components/bookmark-button";
import { ScoreBadge } from "@/components/score-badge";

export function ApiCard({ listing }: { listing: ListingCard }) {
  const primaryDomain = listing.domains[0]?.domain;
  // providerListingCount is unknown at this call site (most pages render
  // ApiCard from a plain list, not the scored bulk query) — 1 is a safe
  // baseline; see getAllActiveListingsScored for the fully-accurate score
  // used on the detail page and discovery sections.
  const score = computeScore(listing, 1);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-bg-elevated p-4 transition-colors hover:border-border-strong">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <ProviderMark name={listing.provider.name} logoUrl={listing.provider.logoUrl} />
          <div>
            <h3 className="text-sm font-medium text-fg">{listing.name}</h3>
            <Link
              href={`/provider/${listing.provider.slug}`}
              className="text-xs text-fg-subtle hover:text-fg hover:underline"
            >
              {listing.provider.name}
            </Link>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {listing.freeTierAvailable && (
            <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
              Free tier
            </span>
          )}
          <BookmarkButton type="api_listing" targetId={listing.id} label={listing.name} />
        </div>
      </div>

      <p className="line-clamp-2 text-sm text-fg-muted">{listing.shortDescription}</p>

      <div className="flex flex-wrap items-center gap-1.5">
        {primaryDomain && (
          <span className="rounded border border-border px-1.5 py-0.5 text-[11px] text-fg-muted">
            {primaryDomain.name}
          </span>
        )}
        <span className="rounded border border-border px-1.5 py-0.5 text-[11px] text-fg-muted">
          {pricingModelLabel(listing.pricingModel)}
        </span>
        <span className="rounded border border-border px-1.5 py-0.5 text-[11px] text-fg-muted">
          {authMethodLabel(listing.authMethod)}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between pt-1">
        <FreshnessIndicator date={listing.lastVerifiedAt} status={listing.status} />
        <ScoreBadge overall={score.overall} />
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <Link
          href={`/api/${listing.provider.slug}/${listing.slug}`}
          className="text-xs font-medium text-accent hover:underline"
        >
          View API →
        </Link>
        <CompareTextToggle
          item={{ id: listing.id, slug: listing.slug, name: listing.name, providerName: listing.provider.name }}
        />
      </div>
    </div>
  );
}
