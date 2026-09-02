"use client";

import { useInView } from "@/lib/hooks/use-in-view";
import { useCountUp } from "@/lib/hooks/use-count-up";
import { pricingModelLabel } from "@/lib/format";

interface PricingBreakdown {
  model: string;
  count: number;
  pct: number;
}

const CARD_ICONS = {
  apis: (
    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0H5a2 2 0 0 1-2-2v-4m6 6h10a2 2 0 0 0 2-2v-4M3 9h18M3 15h18" />
  ),
  domains: <path d="M3 6h18M3 12h18M3 18h18" />,
  free: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  providers: (
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  ),
} as const;

function StatCard({
  icon,
  value,
  suffix,
  label,
  inView,
  delay,
}: {
  icon: keyof typeof CARD_ICONS;
  value: number;
  suffix?: string;
  label: string;
  inView: boolean;
  delay: number;
}) {
  const count = useCountUp(value, inView);
  return (
    <div
      style={inView ? { animationDelay: `${delay}ms` } : { opacity: 0 }}
      className={`flex flex-col gap-3 rounded-lg border border-border bg-bg-elevated p-5 ${
        inView ? "animate-fade-slide-up" : ""
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
        {CARD_ICONS[icon]}
      </svg>
      <div>
        <p className="text-2xl font-semibold tracking-tight text-fg">
          {count}
          {suffix}
        </p>
        <p className="mt-0.5 text-xs text-fg-subtle">{label}</p>
      </div>
    </div>
  );
}

export function StatsGrid({
  listingCount,
  domainCount,
  providerCount,
  freeTierCount,
  pricingBreakdown,
}: {
  listingCount: number;
  domainCount: number;
  providerCount: number;
  freeTierCount: number;
  pricingBreakdown: PricingBreakdown[];
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <div ref={ref}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon="apis" value={listingCount} label="APIs indexed" inView={inView} delay={0} />
        <StatCard icon="domains" value={domainCount} label="Domains covered" inView={inView} delay={100} />
        <StatCard icon="free" value={freeTierCount} label="With a free tier" inView={inView} delay={200} />
        <StatCard icon="providers" value={providerCount} label="Providers" inView={inView} delay={300} />
      </div>

      {pricingBreakdown.length > 0 && (
        <div
          style={inView ? { animationDelay: "400ms" } : { opacity: 0 }}
          className={`mt-3 rounded-lg border border-border bg-bg-elevated p-5 ${inView ? "animate-fade-slide-up" : ""}`}
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-fg-subtle">
            Pricing models across the directory
          </p>
          <div className="flex flex-col gap-3">
            {pricingBreakdown.map((b) => (
              <div key={b.model} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-xs text-fg-muted">{pricingModelLabel(b.model)}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg">
                  <div
                    className="h-full rounded-full bg-accent transition-[width] duration-700 ease-out"
                    style={{ width: inView ? `${b.pct}%` : "0%" }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-xs text-fg-subtle">{b.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
