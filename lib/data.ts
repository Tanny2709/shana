import { prisma } from "@/lib/prisma";
import { computeScore, type DirectoryScore } from "@/lib/scoring";
import { parseSearchIntent, hasIntentSignal, type ParsedIntent } from "@/lib/intent-search";
import { getTrendingListingIds } from "@/lib/engagement";
import type { AuthMethod, PricingModel } from "@prisma/client";

export type ListingSort = "name" | "recent";

export interface ListingFilters {
  pricingModel?: PricingModel;
  freeTierOnly?: boolean;
  authMethod?: AuthMethod;
  sort?: ListingSort;
}

const listingCard = {
  select: {
    id: true,
    slug: true,
    name: true,
    shortDescription: true,
    pricingModel: true,
    freeTierAvailable: true,
    freeTierDetails: true,
    authMethod: true,
    rateLimits: true,
    pricingSummary: true,
    howToGetKey: true,
    useCases: true,
    docsUrl: true,
    signupUrl: true,
    lastVerifiedAt: true,
    createdAt: true,
    status: true,
    officialSdks: true,
    supportedLanguages: true,
    restSupport: true,
    graphqlSupport: true,
    webhookSupport: true,
    websocketSupport: true,
    provider: { select: { name: true, slug: true, logoUrl: true } },
    domains: { select: { domain: { select: { name: true, slug: true } } } },
  },
} as const;

export async function getDomains() {
  return prisma.domain.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { listings: { where: { apiListing: { status: "active" } } } },
      },
    },
  });
}

export async function getDomainsWithPreview(previewCount = 4) {
  const domains = await getDomains();
  return Promise.all(
    domains.map(async (domain) => {
      const preview = await prisma.apiListing.findMany({
        where: { status: "active", domains: { some: { domain: { slug: domain.slug } } } },
        orderBy: { name: "asc" },
        take: previewCount,
        select: { name: true, provider: { select: { name: true, logoUrl: true } } },
      });
      return { ...domain, preview };
    }),
  );
}

export async function getProviderNames() {
  const providers = await prisma.provider.findMany({
    where: { listings: { some: { status: "active" } } },
    orderBy: { name: "asc" },
    select: { name: true, slug: true },
  });
  return providers;
}

export async function getStats() {
  const [listingCount, domainCount, providerCount, freeTierCount] = await Promise.all([
    prisma.apiListing.count({ where: { status: "active" } }),
    prisma.domain.count(),
    prisma.provider.count({ where: { listings: { some: { status: "active" } } } }),
    prisma.apiListing.count({ where: { status: "active", freeTierAvailable: true } }),
  ]);
  return { listingCount, domainCount, providerCount, freeTierCount };
}

export async function getPricingBreakdown() {
  const groups = await prisma.apiListing.groupBy({
    by: ["pricingModel"],
    where: { status: "active" },
    _count: true,
  });
  const total = groups.reduce((sum, g) => sum + g._count, 0);
  return pricingModelValuesOrdered
    .map((model) => {
      const match = groups.find((g) => g.pricingModel === model);
      return { model, count: match?._count ?? 0 };
    })
    .filter((g) => g.count > 0)
    .map((g) => ({ ...g, pct: total > 0 ? Math.round((g.count / total) * 100) : 0 }));
}

const pricingModelValuesOrdered = [
  "free",
  "freemium",
  "pay_as_you_go",
  "subscription",
  "credit_based",
] as const;

export async function getDomainBySlug(slug: string) {
  return prisma.domain.findUnique({ where: { slug } });
}

function buildWhere(filters: ListingFilters, domainSlug?: string) {
  return {
    status: "active" as const,
    ...(domainSlug ? { domains: { some: { domain: { slug: domainSlug } } } } : {}),
    ...(filters.pricingModel ? { pricingModel: filters.pricingModel } : {}),
    ...(filters.freeTierOnly ? { freeTierAvailable: true } : {}),
    ...(filters.authMethod ? { authMethod: filters.authMethod } : {}),
  };
}

function buildOrderBy(sort?: ListingSort) {
  if (sort === "recent") return { lastVerifiedAt: "desc" as const };
  return { name: "asc" as const };
}

export async function getListingsByDomain(domainSlug: string, filters: ListingFilters = {}) {
  return prisma.apiListing.findMany({
    where: buildWhere(filters, domainSlug),
    orderBy: buildOrderBy(filters.sort),
    ...listingCard,
  });
}

// Ranked search combining trigram similarity (typo/partial-word tolerance,
// via pg_trgm — see migrations/20260901181255_add_search_indexes) with
// Postgres full-text search (multi-word relevance across name/description/use
// cases) and a plain ILIKE fallback so short queries still match reliably.
export async function searchListings(query: string) {
  const q = query.trim();
  if (!q) return [];

  const ranked = await prisma.$queryRaw<{ id: string }[]>`
    SELECT al.id
    FROM "api_listings" al
    JOIN "providers" p ON p.id = al.provider_id
    WHERE al.status = 'active'
      AND (
        al.name ILIKE '%' || ${q} || '%'
        OR al.short_description ILIKE '%' || ${q} || '%'
        OR p.name ILIKE '%' || ${q} || '%'
        OR EXISTS (SELECT 1 FROM unnest(al.use_cases) uc WHERE uc ILIKE '%' || ${q} || '%')
        OR al.name % ${q}
        OR p.name % ${q}
        OR to_tsvector('english', al.name || ' ' || al.short_description || ' ' || array_to_string(al.use_cases, ' '))
           @@ websearch_to_tsquery('english', ${q})
      )
    ORDER BY GREATEST(
      similarity(al.name, ${q}),
      similarity(p.name, ${q}) * 0.9,
      ts_rank(
        to_tsvector('english', al.name || ' ' || al.short_description || ' ' || array_to_string(al.use_cases, ' ')),
        websearch_to_tsquery('english', ${q})
      ),
      CASE WHEN al.name ILIKE ${q} || '%' THEN 1 ELSE 0 END
    ) DESC
    LIMIT 30
  `;

  if (ranked.length === 0) return [];

  const listings = await prisma.apiListing.findMany({
    where: { id: { in: ranked.map((r) => r.id) } },
    ...listingCard,
  });
  const byId = new Map(listings.map((l) => [l.id, l]));
  return ranked.map((r) => byId.get(r.id)).filter((l): l is NonNullable<typeof l> => Boolean(l));
}

// Wraps searchListings with lightweight intent parsing (see
// lib/intent-search.ts) so queries like "free AI API" or "cheap maps API"
// resolve to real filters (domain, free tier) plus a re-ranked result set,
// instead of just full-text-matching the literal words "free" or "cheap"
// against descriptions. Falls back to the plain ranked search when no
// intent keywords are detected — normal queries like "stripe" are
// untouched.
export async function intentSearch(rawQuery: string): Promise<{ results: ListingCard[]; intent: ParsedIntent }> {
  const intent = parseSearchIntent(rawQuery);

  if (!hasIntentSignal(intent)) {
    return { results: await searchListings(rawQuery), intent };
  }

  const where = {
    status: "active" as const,
    ...(intent.domainSlugs.length > 0
      ? { domains: { some: { domain: { slug: { in: intent.domainSlugs } } } } }
      : {}),
    ...(intent.freeTierOnly ? { freeTierAvailable: true } : {}),
  };

  let listings = await prisma.apiListing.findMany({ where, ...listingCard });

  if (intent.residualQuery) {
    const q = intent.residualQuery;
    const filtered = listings.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.shortDescription.toLowerCase().includes(q) ||
        l.useCases.some((uc) => uc.toLowerCase().includes(q)),
    );
    // If the leftover text doesn't match anything (e.g. it was just noise),
    // keep the domain/free-tier-filtered set rather than showing zero results.
    if (filtered.length > 0) listings = filtered;
  }

  listings = intent.preferCheap
    ? [...listings].sort((a, b) => PRICING_RANK[b.pricingModel] - PRICING_RANK[a.pricingModel])
    : [...listings].sort((a, b) => a.name.localeCompare(b.name));

  return { results: listings, intent };
}

const PRICING_RANK: Record<PricingModel, number> = {
  free: 4,
  freemium: 3,
  pay_as_you_go: 2,
  credit_based: 1,
  subscription: 0,
};

export async function getListingDetail(providerSlug: string, listingSlug: string) {
  return prisma.apiListing.findFirst({
    where: { slug: listingSlug, provider: { slug: providerSlug } },
    include: {
      provider: true,
      domains: { include: { domain: true } },
    },
  });
}

export async function getAllListingsForIndex() {
  return prisma.apiListing.findMany({
    where: { status: "active" },
    orderBy: { name: "asc" },
    select: {
      name: true,
      slug: true,
      shortDescription: true,
      provider: { select: { slug: true, name: true } },
      domains: { select: { domain: { select: { name: true } } } },
    },
  });
}

export type ListingCard = Awaited<ReturnType<typeof getListingsByDomain>>[number];

export async function getAllListingsFull() {
  return prisma.apiListing.findMany({
    where: { status: { not: "deprecated" } },
    orderBy: { name: "asc" },
    include: {
      provider: true,
      domains: { include: { domain: true } },
    },
  });
}

export type ListingFull = Awaited<ReturnType<typeof getAllListingsFull>>[number];

const compareSelect = {
  select: {
    id: true,
    slug: true,
    name: true,
    shortDescription: true,
    useCases: true,
    docsUrl: true,
    signupUrl: true,
    authMethod: true,
    freeTierAvailable: true,
    freeTierDetails: true,
    pricingModel: true,
    pricingSummary: true,
    rateLimits: true,
    lastVerifiedAt: true,
    provider: { select: { name: true, slug: true, logoUrl: true } },
  },
} as const;

export async function getListingsBySlugs(slugs: string[]) {
  if (slugs.length === 0) return [];
  const listings = await prisma.apiListing.findMany({
    where: { slug: { in: slugs }, status: "active" },
    ...compareSelect,
  });
  // Preserve the order the slugs were requested in.
  const bySlug = new Map(listings.map((l) => [l.slug, l]));
  return slugs.map((s) => bySlug.get(s)).filter((l): l is NonNullable<typeof l> => Boolean(l));
}

// Same slug lookup as getListingsBySlugs, but in the ListingCard shape
// (domains + status included) that <ApiCard /> requires.
export async function getListingsBySlugsCard(slugs: string[]) {
  if (slugs.length === 0) return [];
  const listings = await prisma.apiListing.findMany({
    where: { slug: { in: slugs }, status: "active" },
    ...listingCard,
  });
  const bySlug = new Map(listings.map((l) => [l.slug, l]));
  return slugs.map((s) => bySlug.get(s)).filter((l): l is NonNullable<typeof l> => Boolean(l));
}

export type ListingCompare = Awaited<ReturnType<typeof getListingsBySlugs>>[number];

export async function getListingsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  return prisma.apiListing.findMany({
    where: { id: { in: ids }, status: "active" },
    orderBy: { name: "asc" },
    ...listingCard,
  });
}

export async function getDomainsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  return prisma.domain.findMany({
    where: { id: { in: ids } },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { listings: { where: { apiListing: { status: "active" } } } },
      },
    },
  });
}

// ---------------------------------------------------------------------
// Directory Score + discovery sections. Score is computed on read (never
// stored) so it can't drift from the real fields that back it — see
// lib/scoring.ts for the disclosed methodology.
// ---------------------------------------------------------------------

export type ScoredListing = ListingCard & { directoryScore: DirectoryScore };

async function getAllActiveListingsScored(): Promise<ScoredListing[]> {
  const listings = await prisma.apiListing.findMany({
    where: { status: "active" },
    ...listingCard,
  });

  const providerCounts = new Map<string, number>();
  for (const l of listings) {
    providerCounts.set(l.provider.slug, (providerCounts.get(l.provider.slug) ?? 0) + 1);
  }

  return listings.map((l) => ({
    ...l,
    directoryScore: computeScore(l, providerCounts.get(l.provider.slug) ?? 1),
  }));
}

export async function getHighestRated(limit = 4) {
  const listings = await getAllActiveListingsScored();
  return listings.sort((a, b) => b.directoryScore.overall - a.directoryScore.overall).slice(0, limit);
}

export async function getBestFreeApis(limit = 4) {
  const listings = await getAllActiveListingsScored();
  const free = listings.filter((l) => l.freeTierAvailable).sort((a, b) => b.directoryScore.overall - a.directoryScore.overall);

  // Pick the top-scoring free-tier listing per domain first, so this row
  // reads as "the best free option in each area" rather than duplicating
  // Highest Rated whenever free-tier listings also happen to score well.
  const seenDomains = new Set<string>();
  const diverse: typeof free = [];
  for (const l of free) {
    const domainSlug = l.domains[0]?.domain.slug;
    if (domainSlug && !seenDomains.has(domainSlug)) {
      seenDomains.add(domainSlug);
      diverse.push(l);
    }
  }
  for (const l of free) {
    if (diverse.length >= limit) break;
    if (!diverse.includes(l)) diverse.push(l);
  }

  return diverse.slice(0, limit);
}

export async function getBestValue(limit = 4) {
  // "Value" = strong score, weighted up further if a free tier exists —
  // deliberately not just "highest score" so this section reads
  // differently from Highest Rated rather than duplicating it.
  const listings = await getAllActiveListingsScored();
  return listings
    .map((l) => ({ ...l, valueScore: l.directoryScore.overall + (l.freeTierAvailable ? 10 : 0) }))
    .sort((a, b) => b.valueScore - a.valueScore)
    .slice(0, limit);
}

export type BrowseSort = "score" | "value" | "recent-added" | "recent-verified" | "name";

export async function getAllActiveListingsSorted(sort: BrowseSort) {
  if (sort === "score" || sort === "value") {
    const listings = await getAllActiveListingsScored();
    if (sort === "score") {
      return listings.sort((a, b) => b.directoryScore.overall - a.directoryScore.overall);
    }
    return listings
      .map((l) => ({ ...l, valueScore: l.directoryScore.overall + (l.freeTierAvailable ? 10 : 0) }))
      .sort((a, b) => b.valueScore - a.valueScore);
  }

  const orderBy =
    sort === "recent-added"
      ? { createdAt: "desc" as const }
      : sort === "recent-verified"
        ? { lastVerifiedAt: "desc" as const }
        : { name: "asc" as const };

  return prisma.apiListing.findMany({ where: { status: "active" }, orderBy, ...listingCard });
}

// Trending — the one homepage section we deliberately did NOT ship
// earlier, since it needs real view data. Returns [] (not fake/placeholder
// rows) until at least a few real page views have accumulated; the
// homepage only renders this row when it's non-empty.
export async function getTrending(limit = 4) {
  const ids = await getTrendingListingIds(limit);
  if (ids.length === 0) return [];
  const listings = await prisma.apiListing.findMany({ where: { id: { in: ids }, status: "active" }, ...listingCard });
  const byId = new Map(listings.map((l) => [l.id, l]));
  return ids.map((id) => byId.get(id)).filter((l): l is NonNullable<typeof l> => Boolean(l));
}

export async function getRecentlyAdded(limit = 4) {
  return prisma.apiListing.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
    take: limit,
    ...listingCard,
  });
}

export async function getRecentlyVerified(limit = 4) {
  return prisma.apiListing.findMany({
    where: { status: "active" },
    orderBy: { lastVerifiedAt: "desc" },
    take: limit,
    ...listingCard,
  });
}

// Alternatives ranking: same domain first, then how many use cases overlap,
// then pricing compatibility (free tier match, then same pricing model) —
// all from real fields, no fabricated "similarity" score.
export async function getAlternatives(
  listing: { id: string; useCases: string[]; freeTierAvailable: boolean; pricingModel: PricingModel },
  domainSlugs: string[],
  limit = 3,
) {
  if (domainSlugs.length === 0) return [];

  const candidates = await prisma.apiListing.findMany({
    where: {
      status: "active",
      id: { not: listing.id },
      domains: { some: { domain: { slug: { in: domainSlugs } } } },
    },
    ...listingCard,
  });

  const ranked = candidates
    .map((c) => {
      const sharedUseCases = c.useCases.filter((uc) => listing.useCases.includes(uc)).length;
      const sameFreeTier = c.freeTierAvailable === listing.freeTierAvailable ? 1 : 0;
      const samePricingModel = c.pricingModel === listing.pricingModel ? 1 : 0;
      const relevance = sharedUseCases * 3 + sameFreeTier + samePricingModel;
      return { listing: c, relevance };
    })
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit)
    .map((r) => r.listing);

  const providerCounts = new Map<string, number>();
  for (const l of ranked) providerCounts.set(l.provider.slug, (providerCounts.get(l.provider.slug) ?? 0) + 1);

  return ranked.map((l) => ({
    ...l,
    directoryScore: computeScore(l, providerCounts.get(l.provider.slug) ?? 1),
    // Contextual tag vs. the listing being viewed — only claimed when the
    // underlying data actually supports it.
    tag: getAlternativeTag(l, listing),
  }));
}

function getAlternativeTag(
  candidate: { freeTierAvailable: boolean; pricingModel: PricingModel; authMethod: AuthMethod },
  current: { freeTierAvailable: boolean; pricingModel: PricingModel },
): string | null {
  if (candidate.freeTierAvailable && !current.freeTierAvailable) return "Better free tier";
  const pricingRank: Record<PricingModel, number> = {
    free: 4,
    freemium: 3,
    pay_as_you_go: 2,
    credit_based: 1,
    subscription: 0,
  };
  if (pricingRank[candidate.pricingModel] > pricingRank[current.pricingModel]) return "Cheaper alternative";
  if (candidate.authMethod === "api_key") return "Simpler auth";
  return null;
}

// ---------------------------------------------------------------------
// Provider pages
// ---------------------------------------------------------------------

export async function getProviderDetail(slug: string) {
  const provider = await prisma.provider.findUnique({ where: { slug } });
  if (!provider) return null;

  const listings = await prisma.apiListing.findMany({
    where: { status: "active", provider: { slug } },
    orderBy: { name: "asc" },
    ...listingCard,
  });

  const domainSlugs = [...new Set(listings.flatMap((l) => l.domains.map((d) => d.domain.slug)))];

  const relatedProviders =
    domainSlugs.length === 0
      ? []
      : await prisma.provider.findMany({
          where: {
            slug: { not: slug },
            listings: {
              some: { status: "active", domains: { some: { domain: { slug: { in: domainSlugs } } } } },
            },
          },
          select: {
            name: true,
            slug: true,
            logoUrl: true,
            _count: { select: { listings: { where: { status: "active" } } } },
          },
          orderBy: { name: "asc" },
          take: 6,
        });

  return { provider, listings, domainSlugs, relatedProviders };
}

export async function getSupportedLanguages() {
  const listings = await prisma.apiListing.findMany({
    where: { status: "active" },
    select: { supportedLanguages: true },
  });
  const counts = new Map<string, number>();
  for (const { supportedLanguages } of listings) {
    for (const lang of supportedLanguages) counts.set(lang, (counts.get(lang) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count || a.language.localeCompare(b.language));
}

export async function getUseCaseCounts() {
  const listings = await prisma.apiListing.findMany({
    where: { status: "active" },
    select: { useCases: true },
  });
  const counts = new Map<string, number>();
  for (const { useCases } of listings) {
    for (const uc of useCases) {
      counts.set(uc, (counts.get(uc) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([useCase, count]) => ({ useCase, count }))
    .sort((a, b) => b.count - a.count || a.useCase.localeCompare(b.useCase));
}
