"use client";

import { SearchBar } from "@/components/search-bar";
import { GradientMesh } from "@/components/landing/gradient-mesh";
import { StatsBar } from "@/components/landing/stats-bar";
import { HeroTerminal, type TerminalQuery } from "@/components/landing/hero-terminal";
import { useDemoModal } from "@/lib/demo-modal-context";

export function Hero({
  listingCount,
  domainCount,
  terminalQueries,
}: {
  listingCount: number;
  domainCount: number;
  terminalQueries: TerminalQuery[];
}) {
  const { openDemo } = useDemoModal();

  return (
    <div className="relative overflow-hidden">
      <GradientMesh />
      <div className="relative mx-auto max-w-2xl px-4 py-20 text-center sm:py-28">
        <h1 className="text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
          Every API. One place to find the key.
        </h1>
        <p className="mt-4 text-base text-fg-muted">
          How to get a key, what it costs, and where to sign up — for APIs across AI, payments,
          maps, and communication. We never store your keys.
        </p>

        <div
          className="mt-8 rounded-lg transition-shadow duration-150 ease-out focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_22%,transparent)]"
        >
          <SearchBar size="lg" autoFocus />
        </div>

        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={openDemo}
            className="text-sm text-fg-muted underline decoration-dotted underline-offset-4 transition-colors hover:text-fg"
          >
            Watch how it works
          </button>
        </div>

        <HeroTerminal queries={terminalQueries} />

        <div className="mt-10">
          <StatsBar listingCount={listingCount} domainCount={domainCount} />
        </div>
      </div>
    </div>
  );
}
