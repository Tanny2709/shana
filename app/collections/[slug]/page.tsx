import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getRelatedCollections, collections } from "@/lib/collections";
import { getListingsBySlugsCard } from "@/lib/data";
import { ApiCard } from "@/components/api-card";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};
  return {
    title: collection.title,
    description: collection.description,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: { title: collection.title, description: collection.description, url: `/collections/${collection.slug}` },
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const listings = await getListingsBySlugsCard(collection.listingSlugs);
  const related = getRelatedCollections(slug);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-fg">{collection.title}</h1>
      <p className="mt-1 text-sm text-fg-muted">{collection.description}</p>
      <p className="mt-4 max-w-2xl text-sm text-fg-muted">{collection.intro}</p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {listings.map((listing) => (
          <div key={listing.id}>
            <ApiCard listing={listing} />
            {collection.reasons?.[listing.slug] && (
              <p className="mt-2 rounded-md border border-border bg-bg-elevated px-3 py-2 text-xs text-fg-muted">
                <span className="font-medium text-fg">Why it&rsquo;s here: </span>
                {collection.reasons[listing.slug]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link
          href={`/compare?ids=${listings
            .slice(0, 3)
            .map((l) => l.slug)
            .join(",")}`}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:opacity-90"
        >
          Compare these APIs →
        </Link>
      </div>

      {related.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-4 text-sm font-medium text-fg">Related collections</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {related.map((c) => (
              <Link
                key={c.slug}
                href={`/collections/${c.slug}`}
                className="flex flex-col gap-1 rounded-lg border border-border bg-bg-elevated p-4 transition-colors hover:border-border-strong"
              >
                <span className="text-sm font-medium text-fg">{c.title}</span>
                <span className="text-xs text-fg-muted">{c.description}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
