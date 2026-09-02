import type { ApiListing } from "@prisma/client";

// "Best for" reuses the existing useCases field directly — it was already
// exactly this information (see prisma/seed.ts), just not surfaced this
// prominently. "Good to know" and "Consider alternatives if" are generated
// from real fields via disclosed rules below, not hand-written editorial
// copy — so nothing here claims something the data doesn't support.

type GoodToKnowInput = Pick<
  ApiListing,
  "authMethod" | "freeTierAvailable" | "pricingModel" | "rateLimits"
>;

export function getGoodToKnow(listing: GoodToKnowInput): string[] {
  const items: string[] = [];

  if (listing.authMethod === "api_key" || listing.authMethod === "both") {
    items.push("Requires an API key");
  }
  if (listing.authMethod === "oauth" || listing.authMethod === "both") {
    items.push("Supports OAuth");
  }
  if (listing.authMethod === "none") {
    items.push("No authentication required");
  }

  items.push(listing.freeTierAvailable ? "Free tier available" : "No free tier — paid from the first request");

  if (listing.pricingModel === "pay_as_you_go") items.push("Production usage is pay-as-you-go");
  if (listing.pricingModel === "subscription") items.push("Production usage requires a subscription plan");
  if (listing.pricingModel === "credit_based") items.push("Billed via prepaid credits");

  if (!listing.rateLimits) items.push("Rate limits not published — check docs before high-volume use");

  return items;
}

type ConsiderAlternativesInput = Pick<ApiListing, "freeTierAvailable" | "pricingModel" | "authMethod">;

export function getConsiderAlternativesIf(listing: ConsiderAlternativesInput): string[] {
  const items: string[] = [];

  if (!listing.freeTierAvailable) {
    items.push("You need a free tier to prototype before paying");
  }
  if (listing.pricingModel === "subscription") {
    items.push("You want to pay only for what you use, not a flat plan");
  }
  if (listing.authMethod === "oauth") {
    items.push("You want the simplest possible auth setup (a plain API key)");
  }

  return items;
}
