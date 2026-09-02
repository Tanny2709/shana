import { Hero } from "@/components/landing/hero";
import type { PreviewResult } from "@/components/landing/hero-search-preview";
import { ProblemSection } from "@/components/landing/problem-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { ProductShowcase } from "@/components/landing/product-showcase";
import { UseCaseGrid } from "@/components/landing/use-case-grid";
import { FreeApiPreview } from "@/components/landing/free-api-preview";
import { TrustSection } from "@/components/landing/trust-section";
import { CollectionPreview } from "@/components/landing/collection-preview";
import { FinalCTA } from "@/components/landing/final-cta";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import type { ScoredListing } from "@/lib/data";
import type { Collection } from "@/lib/collections";

interface DomainItem {
  slug: string;
  name: string;
  description: string | null;
  count: number;
}

export function LandingContent({
  listingCount,
  domainCount,
  previewResults,
  domains,
  bestFree,
  collections,
}: {
  listingCount: number;
  domainCount: number;
  previewResults: PreviewResult[];
  domains: DomainItem[];
  bestFree: ScoredListing[];
  collections: Collection[];
}) {
  return (
    <>
      <Hero listingCount={listingCount} domainCount={domainCount} previewResults={previewResults} />

      <section className="mx-auto mt-24 w-full max-w-4xl px-4 sm:px-6">
        <ScrollReveal>
          <ProblemSection />
        </ScrollReveal>
      </section>

      <section className="mx-auto mt-24 w-full max-w-5xl px-4 sm:px-6">
        <ScrollReveal>
          <SolutionSection />
        </ScrollReveal>
      </section>

      <section className="mx-auto mt-24 w-full max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <ProductShowcase />
        </ScrollReveal>
      </section>

      <section className="mx-auto mt-24 w-full max-w-4xl px-4 sm:px-6">
        <ScrollReveal>
          <UseCaseGrid domains={domains} />
        </ScrollReveal>
      </section>

      <section className="mx-auto mt-24 w-full max-w-5xl px-4 sm:px-6">
        <ScrollReveal>
          <FreeApiPreview listings={bestFree} />
        </ScrollReveal>
      </section>

      <section className="mx-auto mt-24 w-full max-w-5xl px-4 sm:px-6">
        <ScrollReveal>
          <TrustSection />
        </ScrollReveal>
      </section>

      <section className="mx-auto mt-24 w-full max-w-5xl px-4 sm:px-6">
        <ScrollReveal>
          <CollectionPreview collections={collections} />
        </ScrollReveal>
      </section>

      <section className="mx-auto mt-24 mb-24 w-full max-w-4xl px-4 sm:px-6">
        <ScrollReveal>
          <FinalCTA />
        </ScrollReveal>
      </section>
    </>
  );
}
