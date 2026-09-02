import type { ApiListing, PricingModel, AuthMethod } from "@prisma/client";

// The "Directory Score" — a transparent, deterministic score computed from
// fields that actually exist on a listing (never fabricated, never a
// stand-in for real user reviews or industry rankings). Every rule below
// is disclosed in the methodology copy on the detail page
// (components/score-breakdown.tsx) so the number is never presented as
// more objective than it is.
//
// Category weights (sum to 100), matching the shape the product brief
// specified: Documentation 20, Pricing 20, Developer Experience 20,
// Free Tier 15, Maturity 15, Community 10.

type ScoringInput = Pick<
  ApiListing,
  | "howToGetKey"
  | "rateLimits"
  | "pricingModel"
  | "freeTierAvailable"
  | "freeTierDetails"
  | "authMethod"
  | "pricingSummary"
>;

export interface ScoreBreakdown {
  documentation: number;
  pricing: number;
  developerExperience: number;
  freeTier: number;
  maturity: number;
  community: number;
}

export const SCORE_MAX: ScoreBreakdown = {
  documentation: 20,
  pricing: 20,
  developerExperience: 20,
  freeTier: 15,
  maturity: 15,
  community: 10,
};

export interface DirectoryScore {
  overall: number;
  breakdown: ScoreBreakdown;
}

const PRICING_ATTRACTIVENESS: Record<PricingModel, number> = {
  free: 20,
  freemium: 17,
  pay_as_you_go: 14,
  credit_based: 12,
  subscription: 10,
};

const AUTH_SIMPLICITY: Record<AuthMethod, number> = {
  none: 20,
  api_key: 18,
  both: 15,
  oauth: 13,
};

/**
 * @param providerListingCount how many other active listings this provider
 *   has in the directory — used as a (weak, disclosed) proxy for API
 *   program maturity. Pass 1 if unknown.
 */
export function computeScore(listing: ScoringInput, providerListingCount: number): DirectoryScore {
  // Documentation: has a docs link (baseline, true for every listing),
  // plus credit for how many "how to get key" steps are documented, plus
  // whether rate limits are specified.
  const stepCredit = Math.min(listing.howToGetKey.length, 4) * 2; // 0-8
  const documentation = Math.round(8 + stepCredit + (listing.rateLimits ? 4 : 0));

  const pricing = PRICING_ATTRACTIVENESS[listing.pricingModel];

  const developerExperience = AUTH_SIMPLICITY[listing.authMethod];

  const freeTier = !listing.freeTierAvailable
    ? 0
    : listing.freeTierDetails && listing.freeTierDetails.length > 0
      ? 15
      : 10;

  // Maturity: weak proxy from how many other active listings the same
  // provider has, plus a small credit for substantive pricing/rate-limit
  // detail already present on this listing.
  const providerBreadthCredit = Math.min(Math.max(providerListingCount - 1, 0), 3) * 2; // 0-6
  const detailCredit = (listing.rateLimits ? 3 : 0) + (listing.pricingSummary.length > 30 ? 3 : 0); // 0-6
  const maturity = Math.min(6 + providerBreadthCredit + detailCredit, 15);

  // Community: no real signal exists yet (no reviews, stars, or usage
  // data) — a flat, disclosed baseline is applied uniformly rather than
  // inventing per-listing variation with no basis.
  const community = 6;

  const breakdown: ScoreBreakdown = { documentation, pricing, developerExperience, freeTier, maturity, community };
  const overall = Object.values(breakdown).reduce((sum, v) => sum + v, 0);

  return { overall, breakdown };
}
