import Link from "next/link";
import { notFound } from "next/navigation";
import { getProviderDetail } from "@/lib/data";
import { ProviderMark } from "@/components/provider-mark";
import { ApiCard } from "@/components/api-card";
import { ExternalLinkIcon } from "@/components/external-link-icon";
import type { Metadata } from "next";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getProviderDetail(slug);
  if (!detail) return {};
  return {
    title: detail.provider.name,
    description: detail.provider.description ?? `${detail.listings.length} APIs from ${detail.provider.name}.`,
    alternates: { canonical: `/provider/${slug}` },
  };
}

export default async function ProviderPage({ params }: PageProps) {
  const { slug } = await params;
  const detail = await getProviderDetail(slug);
  if (!detail || detail.listings.length === 0) notFound();

  const { provider, listings, relatedProviders } = detail;

  const domains = [...new Map(listings.flatMap((l) => l.domains.map((d) => [d.domain.slug, d.domain]))).values()];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <ProviderMark name={provider.name} logoUrl={provider.logoUrl} size={48} />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-fg">{provider.name}</h1>
            {provider.description && <p className="mt-1 text-sm text-fg-muted">{provider.description}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <a
                href={provider.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent hover:underline"
              >
                Website
                <ExternalLinkIcon />
              </a>
              <span className="text-fg-subtle">·</span>
              <span className="text-fg-muted">
                {listings.length} {listings.length === 1 ? "API" : "APIs"}
              </span>
              <span className="text-fg-subtle">·</span>
              <span className="text-fg-muted">
                {domains.length} {domains.length === 1 ? "domain" : "domains"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {domains.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {domains.map((d) => (
            <Link
              key={d.slug}
              href={`/domain/${d.slug}`}
              className="rounded border border-border px-1.5 py-0.5 text-[11px] text-fg-muted hover:border-border-strong hover:text-fg"
            >
              {d.name}
            </Link>
          ))}
        </div>
      )}

      <section className="mt-10">
        <h2 className="mb-4 text-sm font-medium text-fg">
          {listings.length === 1 ? "API" : "APIs"} from {provider.name}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <ApiCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {relatedProviders.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-sm font-medium text-fg">Related providers</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {relatedProviders.map((p) => (
              <Link
                key={p.slug}
                href={`/provider/${p.slug}`}
                className="flex flex-col items-center gap-2 rounded-lg border border-border bg-bg-elevated p-3 text-center transition-colors hover:border-border-strong"
              >
                <ProviderMark name={p.name} logoUrl={p.logoUrl} size={28} />
                <span className="text-xs font-medium text-fg">{p.name}</span>
                <span className="text-[10px] text-fg-subtle">{p._count.listings} APIs</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
