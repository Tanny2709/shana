"use client";

import type { ReactNode } from "react";
import { DemoModalProvider } from "@/lib/demo-modal-context";
import { Hero } from "@/components/landing/hero";
import type { TerminalQuery } from "@/components/landing/hero-terminal";
import { DemoModal } from "@/components/landing/demo-modal";
import { DomainShowcase, type DomainPreview } from "@/components/landing/domain-showcase";
import { StatsGrid } from "@/components/landing/stats-grid";

interface PricingBreakdown {
  model: string;
  count: number;
  pct: number;
}

export function LandingContent({
  listingCount,
  domainCount,
  providerCount,
  freeTierCount,
  pricingBreakdown,
  domains,
  featuresSlot,
  previewSlot,
  terminalQueries,
  discoverySlot,
}: {
  listingCount: number;
  domainCount: number;
  providerCount: number;
  freeTierCount: number;
  pricingBreakdown: PricingBreakdown[];
  domains: DomainPreview[];
  featuresSlot: ReactNode;
  previewSlot: ReactNode;
  terminalQueries: TerminalQuery[];
  discoverySlot: ReactNode;
}) {
  return (
    <DemoModalProvider>
      <Hero listingCount={listingCount} domainCount={domainCount} terminalQueries={terminalQueries} />

      <section className="mx-auto mt-16 w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-10">{discoverySlot}</div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-6xl px-4 sm:px-6">
        <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-fg-subtle">
          What you can do
        </h2>
        <p className="mb-4 text-sm text-fg-muted">
          One directory, several ways in — browse, compare, save, and build on top of it.
        </p>
        {featuresSlot}
      </section>

      <section className="mx-auto mt-16 w-full max-w-6xl px-4 sm:px-6">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-fg-subtle">
          By the numbers
        </h2>
        <StatsGrid
          listingCount={listingCount}
          domainCount={domainCount}
          providerCount={providerCount}
          freeTierCount={freeTierCount}
          pricingBreakdown={pricingBreakdown}
        />
      </section>

      <section className="mx-auto mt-16 w-full max-w-6xl px-4 sm:px-6">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-fg-subtle">
          Browse by domain
        </h2>
        <DomainShowcase domains={domains} />
      </section>

      <section className="mx-auto mt-16 w-full max-w-6xl px-4 sm:px-6">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-fg-subtle">
          See it in action
        </h2>
        {previewSlot}
      </section>

      <DemoModal />
    </DemoModalProvider>
  );
}
