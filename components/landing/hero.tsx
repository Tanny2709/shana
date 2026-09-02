import Link from "next/link";
import { GradientMesh } from "@/components/landing/gradient-mesh";
import { HeroSearchPreview, type PreviewResult } from "@/components/landing/hero-search-preview";

export function Hero({
  listingCount,
  domainCount,
  previewResults,
}: {
  listingCount: number;
  domainCount: number;
  previewResults: PreviewResult[];
}) {
  return (
    <div className="relative overflow-hidden">
      <GradientMesh />
      <div className="relative mx-auto max-w-2xl px-4 py-24 text-center sm:py-32">
        <p className="text-xs font-medium uppercase tracking-widest text-fg-subtle">
          The API discovery directory
        </p>
        <h1 className="mt-4 text-[clamp(2.25rem,6vw,3.5rem)] font-semibold leading-[1.05] tracking-tight text-fg">
          Find the right API.
          <br />
          Without the research rabbit hole.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base text-fg-muted">
          A searchable directory of APIs with pricing, free tiers, authentication, use cases,
          documentation, and direct links to get started.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/browse"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
          >
            Explore the API Directory →
          </Link>
          <Link
            href="/use-cases"
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
          >
            Browse by Use Case
          </Link>
        </div>

        <HeroSearchPreview results={previewResults} />

        <p className="mt-8 text-xs text-fg-subtle">
          {listingCount}+ APIs · {domainCount} domains · Recently verified
        </p>
      </div>
    </div>
  );
}
