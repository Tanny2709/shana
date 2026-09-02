import { getDomains, getStats, getBestFreeApis, intentSearch } from "@/lib/data";
import { collections as allCollections } from "@/lib/collections";
import { LandingContent } from "@/components/landing/landing-content";
import type { PreviewResult } from "@/components/landing/hero-search-preview";
import { SiteFooter } from "@/components/landing/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Shana — Find the Right API Faster" },
  description:
    "Discover APIs by use case, compare pricing and free tiers, explore alternatives, and find everything you need to get started.",
};

const HERO_QUERY = "payment API with a free tier";
const COLLECTION_SLUGS = ["best-free-ai-apis", "best-payment-apis", "cheap-maps-apis"];

export default async function Home() {
  const [domains, stats, bestFree, heroSearch] = await Promise.all([
    getDomains(),
    getStats(),
    getBestFreeApis(4),
    intentSearch(HERO_QUERY),
  ]);

  const previewResults: PreviewResult[] = heroSearch.results.slice(0, 4).map((l) => ({
    id: l.id,
    slug: l.slug,
    providerSlug: l.provider.slug,
    name: l.name,
    domainName: l.domains[0]?.domain.name ?? null,
    pricingModel: l.pricingModel,
    freeTierAvailable: l.freeTierAvailable,
    freeTierDetails: l.freeTierDetails,
  }));

  const domainItems = domains.map((d) => ({
    slug: d.slug,
    name: d.name,
    description: d.description,
    count: d._count.listings,
  }));

  const collections = allCollections.filter((c) => COLLECTION_SLUGS.includes(c.slug));

  return (
    <>
      <main className="flex-1">
        <LandingContent
          listingCount={stats.listingCount}
          domainCount={stats.domainCount}
          previewResults={previewResults}
          domains={domainItems}
          bestFree={bestFree}
          collections={collections}
        />
      </main>
      <SiteFooter />
    </>
  );
}
