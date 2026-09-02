import Link from "next/link";
import type { Collection } from "@/lib/collections";

export function CollectionPreview({ collections }: { collections: Collection[] }) {
  return (
    <div>
      <div className="mx-auto max-w-lg text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-fg-subtle">Curated</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          Hand-picked collections, for when you don&rsquo;t know where to start.
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-3">
        {collections.map((c) => (
          <Link
            key={c.slug}
            href={`/collections/${c.slug}`}
            className="group flex flex-col justify-between gap-6 rounded-xl border border-border bg-bg-elevated p-6 transition-colors hover:border-border-strong"
          >
            <div>
              <h3 className="text-base font-medium text-fg">{c.title}</h3>
              <p className="mt-1.5 text-sm text-fg-muted">{c.description}</p>
            </div>
            <span className="text-sm text-fg-subtle transition-colors group-hover:text-accent">
              {c.listingSlugs.length} APIs →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/collections" className="text-sm font-medium text-accent hover:underline">
          See all collections →
        </Link>
      </div>
    </div>
  );
}
