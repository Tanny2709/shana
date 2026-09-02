# Contributing

There are two ways to propose a new API listing or an edit to an existing one.
Both land in the same review queue — nothing goes live without a maintainer
approving it at `/admin`.

## Option 1: the `/contribute` form

Go to `/contribute` on a running instance of the app. Pick "Submit a new API"
or "Edit an existing listing," fill in the form, and submit. This creates a
`Contribution` record with status `pending`.

## Option 2: a JSON file + pull request

If you'd rather contribute via git:

1. Add a JSON file to [`/contributions`](./contributions) — name it
   `<provider-slug>-<listing-slug>.json`. See
   [`contributions/example.json`](./contributions/example.json) for the shape,
   or the fields below.
2. Validate it locally:
   ```bash
   npm run validate:contributions
   ```
3. Open a pull request. A maintainer reviews the JSON and either imports it
   through `/admin` (as a pending contribution) or merges it directly into
   `prisma/seed.ts`.

### JSON field reference

| Field | Type | Notes |
|---|---|---|
| `providerName` | string | Company/org name |
| `providerSlug` | string | lowercase-with-hyphens, unique |
| `providerWebsite` | string (URL) | |
| `providerDescription` | string | optional |
| `providerLogoUrl` | string (URL) | optional |
| `name` | string | API product name |
| `slug` | string | lowercase-with-hyphens, unique |
| `shortDescription` | string | one sentence, ≤200 chars |
| `useCases` | string[] | e.g. `["Chatbots", "Code generation"]` |
| `docsUrl` | string (URL) | |
| `signupUrl` | string (URL) | the actual key-generation/signup page — this is what "Get API Key" links to |
| `authMethod` | `"api_key"` \| `"oauth"` \| `"both"` \| `"none"` | |
| `freeTierAvailable` | boolean | |
| `freeTierDetails` | string | optional, required in spirit if `freeTierAvailable` is true |
| `pricingModel` | `"free"` \| `"freemium"` \| `"pay_as_you_go"` \| `"subscription"` \| `"credit_based"` | |
| `pricingSummary` | string | short, human-readable (e.g. "$2.50 / 1M input tokens") |
| `rateLimits` | string | optional |
| `howToGetKey` | string[] | ordered steps, e.g. `["Sign up", "Go to Settings → API Keys", ...]` |
| `domainSlugs` | string[] | one or more of the existing domain slugs (see `prisma/seed.ts` for the current list — currently `ai-ml`, `payments`, `maps-geolocation`, `communication`) |

The schema is enforced by [`lib/schema/listing.ts`](./lib/schema/listing.ts)
(zod) — the same validation the `/contribute` form and the JSON validator
script both run against, so a file that passes `validate:contributions` will
also pass the form's server-side checks.

### What we're a stickler about

- **`signupUrl` must be the real, direct key-generation page** — not the
  provider's marketing homepage or a generic "docs" link. This is a directory
  of how to *get* a key, so that link is the whole point.
- We never ask for or store an actual API key. If your PR includes one by
  accident, remove it before submitting.
- Keep `pricingSummary` factual and current — if a provider's pricing has
  tiers too complex for one line, summarize the common case and put the rest
  in `rateLimits` or link out via `docsUrl`.

## Reporting outdated info

Every API detail page has a "Report outdated info" link. Using it creates a
`report`-type `Contribution` against that listing, which flags it for a
maintainer to re-verify (and marks the listing `needs_review` once approved).
