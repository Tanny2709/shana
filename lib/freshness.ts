import type { ListingStatus } from "@prisma/client";
import { daysSince } from "@/lib/format";

export type FreshnessTier = "fresh" | "aging" | "stale";

export function getFreshnessTier(lastVerifiedAt: Date, status: ListingStatus): FreshnessTier {
  if (status === "needs_review") return "stale";
  const days = daysSince(lastVerifiedAt);
  if (days <= 30) return "fresh";
  if (days <= 90) return "aging";
  return "stale";
}

export const FRESHNESS_COPY: Record<FreshnessTier, { dot: string; label: string }> = {
  fresh: { dot: "🟢", label: "Verified" },
  aging: { dot: "🟡", label: "Verified" },
  stale: { dot: "🔴", label: "Verification needed" },
};

type ConfidenceInput = {
  rateLimits: string | null;
  pricingSummary: string;
  docsUrl: string;
  lastVerifiedAt: Date;
  status: ListingStatus;
};

export type ConfidenceLevel = "High" | "Medium" | "Low";

export interface DataConfidence {
  level: ConfidenceLevel;
  checks: { label: string; ok: boolean }[];
}

// "Data confidence" is a count of which structured fields are actually
// present/fresh — not a re-statement of the Directory Score, and not a
// guess at correctness (we can't verify a provider's docs are accurate,
// only that we have the fields and checked recently).
export function getDataConfidence(listing: ConfidenceInput): DataConfidence {
  const tier = getFreshnessTier(listing.lastVerifiedAt, listing.status);

  const checks = [
    { label: "Pricing", ok: listing.pricingSummary.length > 0 },
    { label: "Rate limits", ok: Boolean(listing.rateLimits) },
    { label: "Documentation link", ok: Boolean(listing.docsUrl) },
    { label: "Recently verified", ok: tier !== "stale" },
  ];

  const passed = checks.filter((c) => c.ok).length;
  const level: ConfidenceLevel = passed === checks.length ? "High" : passed >= checks.length - 1 ? "Medium" : "Low";

  return { level, checks };
}
