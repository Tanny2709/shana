"use client";

import { useInView } from "@/lib/hooks/use-in-view";
import { useCountUp } from "@/lib/hooks/use-count-up";

export function StatsBar({
  listingCount,
  domainCount,
}: {
  listingCount: number;
  domainCount: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const apis = useCountUp(listingCount, inView);
  const domains = useCountUp(domainCount, inView);

  return (
    <div ref={ref} className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-fg-muted">
      <span>
        <span className="font-semibold text-fg">{apis}</span> APIs
      </span>
      <span className="text-fg-subtle">·</span>
      <span>
        <span className="font-semibold text-fg">{domains}</span> domains
      </span>
      <span className="text-fg-subtle">·</span>
      <span>updated daily</span>
    </div>
  );
}
