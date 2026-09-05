import { notFound } from "next/navigation";
import { getDomainBySlug, getListingsByDomain, type ListingSort } from "@/lib/data";
import { ApiCard } from "@/components/api-card";
import { FilterSidebar } from "@/components/filter-sidebar";
import { BookmarkButton } from "@/components/bookmark-button";
import type { AuthMethod, PricingModel } from "@prisma/client";

export const revalidate = 60;

export default async function DomainPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  // Neither query depends on the other's result (the listings query only
  // needs the slug, already known) — fetch in parallel instead of waiting
  // on the domain lookup first.
  const [domain, listings] = await Promise.all([
    getDomainBySlug(slug),
    getListingsByDomain(slug, {
      pricingModel: sp.pricing as PricingModel | undefined,
      authMethod: sp.auth as AuthMethod | undefined,
      freeTierOnly: sp.free === "1",
      sort: (sp.sort as ListingSort | undefined) ?? "name",
    }),
  ]);
  if (!domain) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">{domain.name}</h1>
          {domain.description && <p className="mt-1 text-sm text-fg-muted">{domain.description}</p>}
        </div>
        <BookmarkButton type="domain" targetId={domain.id} label={domain.name} size={22} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_1fr]">
        <aside className="hidden lg:block">
          <FilterSidebar />
        </aside>

        <div className="lg:hidden">
          <details className="rounded-lg border border-border bg-bg-elevated">
            <summary className="cursor-pointer px-4 py-2.5 text-sm font-medium text-fg">
              Filters
            </summary>
            <div className="border-t border-border px-4 py-4">
              <FilterSidebar />
            </div>
          </details>
        </div>

        <div>
          <p className="mb-4 text-sm text-fg-subtle">
            {listings.length} {listings.length === 1 ? "API" : "APIs"}
          </p>
          {listings.length === 0 ? (
            <p className="rounded-lg border border-border bg-bg-elevated px-4 py-8 text-center text-sm text-fg-muted">
              No APIs match these filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <ApiCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
