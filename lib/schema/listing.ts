import { z } from "zod";

// Shared validation for a proposed API listing — used by the /contribute form,
// the server actions that create Contributions, and the standalone JSON
// contribution path documented in CONTRIBUTING.md (validated via
// scripts/validate-contribution.ts).

export const pricingModelValues = [
  "free",
  "freemium",
  "pay_as_you_go",
  "subscription",
  "credit_based",
] as const;

export const authMethodValues = ["api_key", "oauth", "both", "none"] as const;

const urlField = z.string().trim().url("Must be a valid URL");

const commaList = z
  .string()
  .transform((v) =>
    v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );

export const listingInputSchema = z.object({
  // Provider
  providerName: z.string().trim().min(1, "Provider name is required"),
  providerSlug: z
    .string()
    .trim()
    .min(1, "Provider slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  providerWebsite: urlField,
  providerDescription: z.string().trim().optional(),
  providerLogoUrl: z.union([urlField, z.literal("")]).optional(),

  // Listing
  name: z.string().trim().min(1, "API name is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Listing slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  shortDescription: z.string().trim().min(1, "A short description is required").max(200),
  useCases: commaList,
  docsUrl: urlField,
  signupUrl: urlField,
  authMethod: z.enum(authMethodValues),
  freeTierAvailable: z.boolean(),
  freeTierDetails: z.string().trim().optional(),
  pricingModel: z.enum(pricingModelValues),
  pricingSummary: z.string().trim().min(1, "Pricing summary is required"),
  rateLimits: z.string().trim().optional(),
  howToGetKey: commaList,
  domainSlugs: z.array(z.string()).min(1, "Select at least one domain"),
});

export type ListingInput = z.infer<typeof listingInputSchema>;

// Raw JSON shape used by the file-based contribution path (arrays as arrays,
// not comma-separated strings) — see CONTRIBUTING.md.
export const listingJsonSchema = listingInputSchema.extend({
  useCases: z.array(z.string()).min(1),
  howToGetKey: z.array(z.string()).default([]),
});

export type ListingJson = z.infer<typeof listingJsonSchema>;
