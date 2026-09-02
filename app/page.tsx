import Link from "next/link";
import {
  getDomainsWithPreview,
  getProviderNames,
  getStats,
  getPricingBreakdown,
  getListingsBySlugsCard,
  getBestFreeApis,
  getHighestRated,
  getRecentlyAdded,
  getRecentlyVerified,
  getBestValue,
  getTrending,
} from "@/lib/data";
import { LandingContent } from "@/components/landing/landing-content";
import { LogoMarquee } from "@/components/landing/logo-marquee";
import { FooterCTA } from "@/components/landing/footer-cta";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { FeaturesLive } from "@/components/landing/features-live";
import { LivePreviewStrip } from "@/components/landing/live-preview-strip";
import { DiscoveryRow } from "@/components/discovery-row";
import type { TerminalQuery } from "@/components/landing/hero-terminal";

// Real seed-data slugs backing the hero's live-typing search mockup —
// three genuine queries, each with 2 real matching listings.
const TERMINAL_QUERY_SETS: { query: string; slugs: string[] }[] = [
  { query: "stripe", slugs: ["stripe-api"] },
  { query: "geocoding", slugs: ["opencage-api", "mapbox-api"] },
  { query: "sms", slugs: ["twilio-api", "vonage-api"] },
];

export default async function Home() {
  const [
    domains,
    providers,
    stats,
    pricingBreakdown,
    terminalListingSets,
    bestFree,
    highestRated,
    recentlyAdded,
    recentlyVerified,
    bestValue,
    trending,
  ] = await Promise.all([
    getDomainsWithPreview(),
    getProviderNames(),
    getStats(),
    getPricingBreakdown(),
    Promise.all(TERMINAL_QUERY_SETS.map((q) => getListingsBySlugsCard(q.slugs))),
    getBestFreeApis(),
    getHighestRated(),
    getRecentlyAdded(),
    getRecentlyVerified(),
    getBestValue(),
    getTrending(),
  ]);

  const terminalQueries: TerminalQuery[] = TERMINAL_QUERY_SETS.map((q, i) => ({
    query: q.query,
    results: terminalListingSets[i].map((l) => ({
      id: l.id,
      name: l.name,
      providerName: l.provider.name,
      domainName: l.domains[0]?.domain.name ?? null,
      domainSlug: l.domains[0]?.domain.slug ?? null,
      pricingModel: l.pricingModel,
    })),
  }));

  const domainPreviews = domains.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    count: d._count.listings,
    preview: d.preview,
  }));

  return (
    <main className="flex-1">
      <LandingContent
        listingCount={stats.listingCount}
        domainCount={stats.domainCount}
        providerCount={stats.providerCount}
        freeTierCount={stats.freeTierCount}
        pricingBreakdown={pricingBreakdown}
        domains={domainPreviews}
        featuresSlot={<FeaturesLive />}
        previewSlot={<LivePreviewStrip />}
        terminalQueries={terminalQueries}
        discoverySlot={
          <>
            {trending.length > 0 && (
              <DiscoveryRow icon="🔥" title="Trending" listings={trending} viewAllHref="/browse" />
            )}
            <DiscoveryRow icon="⭐" title="Highest Rated" listings={highestRated} viewAllHref="/browse?sort=score" />
            <DiscoveryRow icon="🆓" title="Best Free APIs" listings={bestFree} viewAllHref="/free-apis" />
            <DiscoveryRow icon="💰" title="Best Value" listings={bestValue} viewAllHref="/browse?sort=value" />
            <DiscoveryRow
              icon="🆕"
              title="Recently Added"
              listings={recentlyAdded}
              viewAllHref="/browse?sort=recent-added"
            />
            <DiscoveryRow
              icon="✓"
              title="Recently Verified"
              listings={recentlyVerified}
              viewAllHref="/browse?sort=recent-verified"
            />
          </>
        }
      />

      <div className="mt-16">
        <LogoMarquee names={providers.map((p) => p.name)} />
      </div>

      <div className="mx-auto mt-16 max-w-6xl px-4 pb-16 sm:px-6">
        <ScrollReveal>
          <FooterCTA />
        </ScrollReveal>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <Link href="/use-cases" className="text-fg-muted hover:text-fg">
            Browse by use case →
          </Link>
          <Link href="/collections" className="text-fg-muted hover:text-fg">
            Curated collections →
          </Link>
        </div>
      </div>
    </main>
  );
}
