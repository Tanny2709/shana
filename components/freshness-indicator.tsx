import type { ListingStatus } from "@prisma/client";
import { timeAgo } from "@/lib/format";
import { getFreshnessTier, FRESHNESS_COPY } from "@/lib/freshness";

const TIER_COLOR: Record<ReturnType<typeof getFreshnessTier>, string> = {
  fresh: "bg-success",
  aging: "bg-warning",
  stale: "bg-red-500",
};

export function FreshnessIndicator({ date, status = "active" }: { date: Date; status?: ListingStatus }) {
  const tier = getFreshnessTier(date, status);
  const copy = FRESHNESS_COPY[tier];

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-fg-subtle">
      <span className={`h-1.5 w-1.5 rounded-full ${TIER_COLOR[tier]}`} aria-hidden />
      {tier === "stale" && status === "needs_review" ? copy.label : `${copy.label} ${timeAgo(date)}`}
    </span>
  );
}
