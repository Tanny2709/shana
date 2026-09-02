import Link from "next/link";
import { collections } from "@/lib/collections";

export const metadata = {
  title: "Collections",
};

export default function CollectionsIndexPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-fg">Collections</h1>
      <p className="mt-1 text-sm text-fg-muted">Hand-picked groups of APIs for common needs.</p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {collections.map((c) => (
          <Link
            key={c.slug}
            href={`/collections/${c.slug}`}
            className="flex flex-col gap-2 rounded-lg border border-border bg-bg-elevated p-5 transition-colors hover:border-border-strong"
          >
            <h2 className="text-sm font-medium text-fg">{c.title}</h2>
            <p className="text-sm text-fg-muted">{c.description}</p>
            <span className="mt-1 text-xs text-fg-subtle">{c.listingSlugs.length} APIs</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
