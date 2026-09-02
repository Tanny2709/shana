# API Reference Directory

A searchable, domain-organized directory of APIs: how to get a key, pricing
and rate limits, use cases, and a direct link to the provider's key-generation
page. This project never stores or brokers actual API keys — it's a map, not
a vault.

Tech stack: Next.js (App Router) + TypeScript + Tailwind CSS + Prisma +
PostgreSQL (Supabase for hosted dev). Deploy target: Vercel.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in DATABASE_URL / DIRECT_URL
npx prisma migrate dev # apply the schema to your database
npx prisma db seed     # seed real sample data
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database

Uses Supabase Postgres. Grab both connection strings from
**Project Settings → Database → Connection pooling**:

- `DATABASE_URL` — Transaction pooler, port `6543`, with `?pgbouncer=true`. Used by the app at runtime (serverless-safe).
- `DIRECT_URL` — Session pooler, port `5432`. Used by Prisma Migrate for schema changes.

The direct (non-pooler) `db.<project>.supabase.co:5432` host is IPv6-only;
if your network/host doesn't support IPv6, use the pooler hosts
(`aws-0-<region>.pooler.supabase.com`) for both instead.

### Admin access

`/admin` (the contribution review queue) is gated by HTTP Basic Auth. Set
`ADMIN_USER` / `ADMIN_PASSWORD` in `.env` — without them, `/admin` returns
503.

## Data model

Defined in [prisma/schema.prisma](prisma/schema.prisma):

- **Provider** — a company/org that exposes one or more APIs (name, slug, logo, website, description).
- **ApiListing** — a single API product. Belongs to a `Provider`, tagged with one or more `Domain`s. Captures:
  - `useCases[]`, `docsUrl`, `signupUrl` (the redirect target for "Get API Key")
  - `authMethod` (api_key / oauth / both / none)
  - `freeTierAvailable` + `freeTierDetails`
  - `pricingModel` (free / freemium / pay_as_you_go / subscription / credit_based) + `pricingSummary` (short human string) + `rateLimits`
  - `howToGetKey[]` — ordered steps
  - `lastVerifiedAt`, `status` (active / deprecated / needs_review)
- **Domain** — a category (AI/ML, Payments, Maps & Geolocation, Communication, ...). Many-to-many with `ApiListing` via the `ApiListingDomain` join table, so a listing can carry multiple domain tags.
- **Contribution** — a pending community-submitted new listing, edit, or "report outdated info" flag, stored as a JSON payload against an optional `ApiListing`, reviewed via an admin queue (Phase 2).

This shape was chosen to hold four different pricing shapes (free, per-request,
tiered/subscription, credit-based) in one `pricingModel` enum + a free-text
`pricingSummary`/`rateLimits` for the details that don't fit a rigid schema —
validated against the 26 real APIs in the seed data.

## Seed data

[prisma/seed.ts](prisma/seed.ts) seeds 26 real APIs across 4 domains (AI/ML,
Payments, Maps & Geolocation, Communication) — e.g. OpenAI, Anthropic, Stripe,
Twilio, Google Maps Platform, SendGrid, Mapbox, Cohere. Idempotent (upserts by
slug), safe to re-run.

## Directory Score & decision-support

Every listing gets a **Directory Score** (0–100), computed deterministically
from real fields — never stored, never seeded by hand — so it can't drift
from the data it's based on. See [lib/scoring.ts](lib/scoring.ts) for the
full disclosed rubric (Documentation 20, Pricing 20, Developer Experience
20, Free Tier 15, Maturity 15, Community 10 — Community has no real signal
yet, so a flat baseline is applied uniformly rather than invented). It's
never presented as a star rating or a crowd-sourced score.

Built on top of it, all computed from existing fields (no new schema):

- **Best for / Good to know / Consider alternatives if** on every detail
  page ([lib/best-for.ts](lib/best-for.ts)) — "Best for" reuses the existing
  `useCases[]` field directly; the other two are rule-based from
  `pricingModel`/`freeTierAvailable`/`authMethod`.
- **Alternatives** — same-domain listings ranked by shared use cases, free
  tier match, and pricing model, each with an honest contextual tag
  ("Cheaper alternative", "Better free tier", "Simpler auth") only shown
  when the data actually supports it (`getAlternatives` in
  [lib/data.ts](lib/data.ts)).
- **3-tier freshness + Data confidence** — 🟢 fresh (≤30d) / 🟡 aging (≤90d)
  / 🔴 stale or flagged `needs_review`
  ([lib/freshness.ts](lib/freshness.ts)); the detail page's confidence panel
  is a checklist of which structured fields are actually present, not a
  correctness guess.
- **Homepage discovery rows** — Highest Rated, Best Free APIs (diversified
  one-per-domain so it doesn't just duplicate Highest Rated), Best Value,
  Recently Added, Recently Verified. Deliberately no "Trending" row — that
  needs real view/click data that doesn't exist yet, so it's left out
  rather than faked.
- **`/browse`** — every active listing, sortable (score/value/recency/name).
- **`/free-apis`** — free-tier listings grouped by domain, each showing its
  real `freeTierDetails` text (not invented request quotas).

## Micro-interactions & polish

- **Toasts** now fire on every compare add/remove/limit-hit, not just
  bookmarks (`lib/compare-context.tsx`).
- **Skeleton loaders** (`app/**/loading.tsx`) on every list/detail route
  (`/search`, `/browse`, `/free-apis`, `/domain/[slug]`,
  `/api/[provider]/[slug]`, `/provider/[slug]`) — real Next.js Suspense
  boundaries, not a client-side spinner, shaped to match the real content
  so nothing jumps when it resolves.
- **Copy-to-clipboard** (`components/copy-button.tsx`) on the detail page's
  canonical link.
- **External-link indicators** (`components/external-link-icon.tsx`) on
  every outbound `target="_blank"` link that didn't already have one.

## Engagement tracking & Trending

`EngagementEvent` ([prisma/schema.prisma](prisma/schema.prisma)) records
`view` / `key_click` / `docs_click` / `compare_add` events with no user
identity attached — see [lib/engagement.ts](lib/engagement.ts). The
homepage's "🔥 Trending" row ranks listings by real `view` events in the
last 7 days and **renders nothing at all** (not zeros, not a placeholder)
until genuine activity exists — verified by hand: it was absent on a fresh
DB, appeared correctly ordered after real page visits, and disappeared
again once that test data was cleared. No fake popularity, ever.

Collections at `/collections/[slug]` also got an editorial pass: each has
an `intro` paragraph and per-listing "why it's here" reasons (only ever
stating something the data actually shows — free tier, score, pricing
model), plus a "Related collections" section computed from real listing
overlap between collections, not hand-wired links.

## Developer support (SDKs, languages, protocol)

`ApiListing` has six additive fields — `officialSdks[]`, `supportedLanguages[]`,
`restSupport`, `graphqlSupport`, `webhookSupport`, `websocketSupport` — the
one schema migration in this pass
([prisma/migrations/20260902145816_add_developer_support_fields](prisma/migrations/20260902145816_add_developer_support_fields)).
Seeded with real, conservative data for 23 of the 26 listings
(`DEVELOPER_SUPPORT` in [prisma/seed.ts](prisma/seed.ts)) — well-documented
facts about major providers (Stripe's SDK list, OpenAI's Realtime API using
WebSocket, etc.), not guesses. The 3 listings I wasn't confident enough
about (HERE, TomTom, OpenCage) are left at defaults rather than filled in
with invented values — empty means "not documented here," never "confirmed
absent," and the UI treats it that way.

Shown as a "Developer support" section on every detail page
([components/developer-support.tsx](components/developer-support.tsx)), and
filterable by language and by feature (Webhooks/GraphQL/WebSocket) on
`/browse`.

## Provider pages & intent-aware search

- **`/provider/<slug>`** — a provider's full listing lineup, domains, and
  related providers (those sharing a domain), built entirely from the
  existing `Provider` model (no schema changes). Linked from every provider
  name on `<ApiCard />` and the detail page.
- **Intent-aware search** — `intentSearch` in [lib/data.ts](lib/data.ts),
  backed by [lib/intent-search.ts](lib/intent-search.ts), pattern-matches
  queries like "free AI API" or "cheap maps API" into real filters (domain,
  free tier, cheapest-first sort) against a fixed, disclosed keyword list —
  no external NLP/ML service. Falls back to the plain ranked search for
  ordinary queries. The results page shows an "Interpreted as: …" line so
  the reinterpretation is never silent.
- **`/free-apis` filters** — domain, auth method, and minimum Directory
  Score, all URL-driven. Deliberately no "monthly request limit" or "credit
  card required" filters — that would need per-listing data that doesn't
  exist yet (see Phase 11/18 in the product brief).

## Compare & discovery

- **Compare** — the checkmark on any API card (or "Add to compare" on a detail
  page) adds it to a floating tray (persisted in `localStorage` via
  [lib/compare-context.tsx](lib/compare-context.tsx)), capped at 3. "Compare"
  in the tray goes to `/compare?ids=slug1,slug2,slug3` for a side-by-side view.
- **Collections** — hand-curated groups at `/collections/<slug>`, defined in
  [lib/collections.ts](lib/collections.ts) as a title/description plus an
  ordered list of listing slugs. Add an entry there to publish a new one.
- **Use cases** — `/use-cases` aggregates every listing's `useCases[]` into a
  tag cloud, a second axis into the directory alongside domains.

## SEO

- Every API detail page gets a keyword-rich title/description, canonical URL,
  Open Graph + Twitter card metadata, a dynamically generated OG image
  ([app/api/[provider]/[slug]/opengraph-image.tsx](<app/api/[provider]/[slug]/opengraph-image.tsx>)),
  and `WebAPI` JSON-LD structured data (name, description, provider, docs
  link, use cases as keywords — no fabricated pricing or ratings).
- `/sitemap.xml` ([app/sitemap.ts](app/sitemap.ts)) and `/robots.txt`
  ([app/robots.ts](app/robots.ts)) are generated from the live data;
  `/admin` and the internal search-index API are disallowed.
- Set `NEXT_PUBLIC_SITE_URL` in `.env` to the real deployed origin — it's
  used for canonical links, the sitemap, and structured data `url` fields.

## Search

`searchListings` in [lib/data.ts](lib/data.ts) runs a ranked Postgres query
combining trigram similarity (typo/partial-word tolerance via `pg_trgm`,
enabled in
[prisma/migrations/20260901181255_add_search_indexes](prisma/migrations/20260901181255_add_search_indexes)),
full-text search (`to_tsvector`/`websearch_to_tsquery` across name,
description, and use cases), and a plain `ILIKE` fallback — no external
search service required. Swapping in Meilisearch/Algolia later would mean
replacing this one function plus adding an indexing job; nothing else in the
app depends on the search implementation.

## Product demo & onboarding

"Watch how it works" on the homepage opens a scripted, looping walkthrough
([components/landing/demo-modal.tsx](components/landing/demo-modal.tsx)) —
a fixed timeline of DOM state changes (search → filter → detail → bookmark),
not a real embedded app instance, so it's fast and safe to show anonymous
visitors. Progress bar and dot indicators sync to the same per-step
duration; a persistent "Try it yourself" button and the bookmark step's
inline prompt both route straight to `/signup` (no separate signup-modal
duplicate — reuses the real page). Fully respects `prefers-reduced-motion`:
no cursor animation or auto-advance, just static content with manual dot
navigation.

After signup, `redirectTo: "/search?onboarding=1"` lands the new user in the
real app with a 3-step dismissible coachmark sequence
([components/onboarding-coachmarks.tsx](components/onboarding-coachmarks.tsx))
pointing at the search bar, the ⌘K shortcut, and the Bookmarks link (via
stable `id`s on those header elements) — skips gracefully past any step
whose target isn't in the DOM (e.g. header nav hidden on narrow viewports).

## Auth & bookmarks

Email/password auth via NextAuth (Auth.js) v5, JWT sessions, no external
provider required — see [lib/auth.ts](lib/auth.ts). Set `AUTH_SECRET` in
`.env` (`openssl rand -base64 32`). A "Continue with Google" button exists
on `/login` and `/signup` as a **visual placeholder only** (disabled, no
provider wired) — adding real Google sign-in later is just adding a
provider to `lib/auth.ts` and enabling that button; nothing else changes.

Signed-in users can bookmark domains and API listings (the bookmark icon on
domain tiles/pages and API cards) — see the `Bookmark` model in
[prisma/schema.prisma](prisma/schema.prisma) and
[lib/actions/bookmarks.ts](lib/actions/bookmarks.ts). Bookmarking is the
only thing gated behind auth — browsing, search, and detail pages stay
fully open. `/bookmarks` lists them, tabbed by type.

## Public API

`/api/v1` is a public, read-only, CORS-open JSON API over the directory
data — no auth required:

- `GET /api/v1/listings` — paginated (`page`, `limit`, max 100/page), filter
  by `domain`, `pricingModel`, `authMethod`, `freeTier=true`.
- `GET /api/v1/listings/<provider-slug>/<listing-slug>` — a single listing.
- `GET /api/v1/domains` — all domains with their listing counts.

## Automation

`GET /api/cron/check-stale` ([app/api/cron/check-stale/route.ts](app/api/cron/check-stale/route.ts)),
scheduled daily via [vercel.json](vercel.json) on Vercel:

1. Flags any active listing whose `lastVerifiedAt` is older than 90 days.
2. Fetches each active listing's `docsUrl` (with a real User-Agent — some
   provider sites block bare/bot requests) and flags it if unreachable.

Either condition sets the listing's `status` to `needs_review` — nothing is
ever auto-edited or deleted, since a failed fetch could be our timeout as
easily as an actually-dead link. Flagged listings surface for a human to
re-verify via `/admin`.

The endpoint is gated by `CRON_SECRET` (checked against an
`Authorization: Bearer <secret>` header — this is Vercel Cron's built-in
mechanism when `CRON_SECRET` is set as a project env var). On a non-Vercel
host, trigger it yourself on a schedule (e.g. a GitHub Actions cron calling
`curl -H "Authorization: Bearer $CRON_SECRET" https://<host>/api/cron/check-stale`).

## Contributing

Two paths — the `/contribute` form, or a JSON file + pull request — both land
in the same review queue at `/admin`. See [CONTRIBUTING.md](CONTRIBUTING.md)
for the full format and the field reference.

## Project structure

```
app/        Next.js App Router pages
components/ Reusable UI components
lib/        Shared utilities (Prisma client, data queries, server actions, zod schemas)
prisma/     schema.prisma, migrations/, seed.ts
contributions/  JSON-file contribution path (see CONTRIBUTING.md)
scripts/    validate-contribution.ts and other one-off scripts
proxy.ts    HTTP Basic Auth gate for /admin
```
