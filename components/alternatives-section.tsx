import Link from "next/link";
import type { DirectoryScore } from "@/lib/scoring";
import { pricingModelLabel } from "@/lib/format";
import { ProviderMark } from "@/components/provider-mark";
import { ScoreBadge } from "@/components/score-badge";

interface Alternative {
  id: string;
  slug: string;
  name: string;
  pricingModel: string;
  provider: { name: string; slug: string; logoUrl: string | null };
  directoryScore: DirectoryScore;
  tag: string | null;
}

export function AlternativesSection({ alternatives }: { alternatives: Alternative[] }) {
  if (alternatives.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {alternatives.map((alt) => (
        <Link
          key={alt.id}
          href={`/api/${alt.provider.slug}/${alt.slug}`}
          className="flex flex-col gap-2 rounded-lg border border-border bg-bg-elevated p-4 transition-colors hover:border-border-strong"
        >
          <div className="flex items-center gap-2">
            <ProviderMark name={alt.provider.name} logoUrl={alt.provider.logoUrl} size={24} />
            <span className="text-sm font-medium text-fg">{alt.name}</span>
          </div>
          {alt.tag && (
            <span className="w-fit rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
              {alt.tag}
            </span>
          )}
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs text-fg-muted">{pricingModelLabel(alt.pricingModel)}</span>
            <ScoreBadge overall={alt.directoryScore.overall} />
          </div>
          <span className="text-xs font-medium text-accent">View →</span>
        </Link>
      ))}
    </div>
  );
}
