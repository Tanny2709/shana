import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getListingsByIds, getDomainsByIds } from "@/lib/data";
import { ApiCard } from "@/components/api-card";
import { DomainTile } from "@/components/domain-tile";
import { EmptyState } from "@/components/empty-state";

export const metadata = { title: "Bookmarks" };
export const dynamic = "force-dynamic";

type Tab = "apis" | "domains";

export default async function BookmarksPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; sort?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const sp = await searchParams;
  const tab: Tab = sp.tab === "domains" ? "domains" : "apis";
  const sort = sp.sort === "name" ? "name" : "recent";

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id, type: tab === "apis" ? "api_listing" : "domain" },
    orderBy: { createdAt: "desc" },
  });
  const orderedIds = bookmarks.map((b) => b.targetId);

  const tabClass = (active: boolean) =>
    `rounded-md px-3 py-1.5 text-sm transition-colors ${
      active ? "bg-accent text-accent-fg" : "text-fg-muted hover:text-fg"
    }`;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-fg">Bookmarks</h1>
      <p className="mt-1 text-sm text-fg-muted">Domains and APIs you&rsquo;ve saved.</p>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="flex gap-1 rounded-md border border-border bg-bg-elevated p-1">
          <Link href="/bookmarks?tab=apis" className={tabClass(tab === "apis")}>
            APIs
          </Link>
          <Link href="/bookmarks?tab=domains" className={tabClass(tab === "domains")}>
            Domains
          </Link>
        </div>
        <div className="flex gap-1 text-xs">
          <Link
            href={`/bookmarks?tab=${tab}&sort=recent`}
            className={sort === "recent" ? "text-accent" : "text-fg-subtle hover:text-fg"}
          >
            Recent
          </Link>
          <span className="text-fg-subtle">·</span>
          <Link
            href={`/bookmarks?tab=${tab}&sort=name`}
            className={sort === "name" ? "text-accent" : "text-fg-subtle hover:text-fg"}
          >
            A–Z
          </Link>
        </div>
      </div>

      <div className="mt-6">
        {tab === "apis" ? (
          <ApiBookmarks ids={orderedIds} sort={sort} />
        ) : (
          <DomainBookmarks ids={orderedIds} sort={sort} />
        )}
      </div>
    </main>
  );
}

async function ApiBookmarks({ ids, sort }: { ids: string[]; sort: "recent" | "name" }) {
  const listings = await getListingsByIds(ids);
  const ordered =
    sort === "recent"
      ? ids.map((id) => listings.find((l) => l.id === id)).filter((l): l is NonNullable<typeof l> => Boolean(l))
      : [...listings].sort((a, b) => a.name.localeCompare(b.name));

  if (ordered.length === 0) {
    return (
      <EmptyState
        title="No bookmarked APIs yet"
        description="Bookmark an API from any listing card to save it here."
        ctaHref="/"
        ctaLabel="Browse APIs"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {ordered.map((listing) => (
        <ApiCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

async function DomainBookmarks({ ids, sort }: { ids: string[]; sort: "recent" | "name" }) {
  const domains = await getDomainsByIds(ids);
  const ordered =
    sort === "recent"
      ? ids.map((id) => domains.find((d) => d.id === id)).filter((d): d is NonNullable<typeof d> => Boolean(d))
      : [...domains].sort((a, b) => a.name.localeCompare(b.name));

  if (ordered.length === 0) {
    return (
      <EmptyState
        title="No bookmarked domains yet"
        description="Bookmark a domain from the homepage or its page header to save it here."
        ctaHref="/"
        ctaLabel="Browse domains"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {ordered.map((d) => (
        <DomainTile key={d.id} id={d.id} name={d.name} slug={d.slug} count={d._count.listings} />
      ))}
    </div>
  );
}
