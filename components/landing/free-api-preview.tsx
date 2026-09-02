import Link from "next/link";
import type { ScoredListing } from "@/lib/data";
import { ProviderMark } from "@/components/provider-mark";
import { ScoreBadge } from "@/components/score-badge";

export function FreeApiPreview({ listings }: { listings: ScoredListing[] }) {
  return (
    <div>
      <div className="mx-auto max-w-lg text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-fg-subtle">Start for $0</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          Good APIs don&rsquo;t always need a credit card.
        </h2>
        <p className="mt-3 text-sm text-fg-muted">
          Discover APIs with free tiers, sandboxes, and developer-friendly plans.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {listings.map((l) => (
          <Link
            key={l.id}
            href={`/api/${l.provider.slug}/${l.slug}`}
            className="flex flex-col gap-3 rounded-xl border border-border bg-bg-elevated p-5 transition-colors hover:border-border-strong"
          >
            <div className="flex items-center gap-2.5">
              <ProviderMark name={l.provider.name} logoUrl={l.provider.logoUrl} size={28} />
              <span className="text-sm font-medium text-fg">{l.name}</span>
            </div>
            <span className="w-fit rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
              Free tier
            </span>
            {l.freeTierDetails && <p className="line-clamp-2 text-xs text-fg-muted">{l.freeTierDetails}</p>}
            <ScoreBadge overall={l.directoryScore.overall} />
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/free-apis" className="text-sm font-medium text-accent hover:underline">
          Explore free APIs →
        </Link>
      </div>
    </div>
  );
}
