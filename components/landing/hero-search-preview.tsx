"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { pricingModelLabel } from "@/lib/format";

export interface PreviewResult {
  id: string;
  slug: string;
  providerSlug: string;
  name: string;
  domainName: string | null;
  pricingModel: string;
  freeTierAvailable: boolean;
  freeTierDetails: string | null;
}

const QUERY = "payment API with a free tier";
const TYPE_MS = 30;
const RESULT_DELAY_MS = 300;
const RESULT_STAGGER_MS = 130;

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const mq = window.matchMedia(reducedMotionQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  );
}

// A single, one-shot demonstration (not a loop) — real query, real results,
// fetched server-side and passed in. Settles into its final state and
// stays there; this is a product preview, not an ambient animation.
export function HeroSearchPreview({ results }: { results: PreviewResult[] }) {
  const reducedMotion = useReducedMotion();
  const [charIndex, setCharIndex] = useState(reducedMotion ? QUERY.length : 0);
  const [visibleResults, setVisibleResults] = useState(reducedMotion ? results.length : 0);

  useEffect(() => {
    if (reducedMotion) return;
    if (charIndex >= QUERY.length) return;
    const t = setTimeout(() => setCharIndex((c) => c + 1), TYPE_MS);
    return () => clearTimeout(t);
  }, [charIndex, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    if (charIndex < QUERY.length) return;
    if (visibleResults >= results.length) return;
    const delay = visibleResults === 0 ? RESULT_DELAY_MS : RESULT_STAGGER_MS;
    const t = setTimeout(() => setVisibleResults((c) => c + 1), delay);
    return () => clearTimeout(t);
  }, [charIndex, visibleResults, results.length, reducedMotion]);

  const typed = QUERY.slice(0, charIndex);
  const doneTyping = charIndex >= QUERY.length;

  return (
    <div className="relative mx-auto mt-10 w-full max-w-xl text-left">
      <div className="rounded-xl border border-border bg-bg-elevated shadow-2xl">
        <div className="border-b border-border px-5 py-4">
          <p className="mb-2 text-xs text-fg-subtle">Search the API directory</p>
          <div className="flex items-center gap-2.5 font-mono text-[15px]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-fg-subtle">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span className="text-fg">{typed}</span>
            {!doneTyping && (
              <span className="h-4 w-[2px] bg-accent" style={{ animation: "landing-idle-glow 1s step-end infinite" }} />
            )}
          </div>
        </div>

        <div className="flex flex-col divide-y divide-border">
          {results.slice(0, visibleResults).map((r) => (
            <Link
              key={r.id}
              href={`/api/${r.providerSlug}/${r.slug}`}
              className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-bg-hover animate-fade-slide-up"
            >
              <div>
                <p className="text-sm font-medium text-fg">{r.name}</p>
                <p className="mt-0.5 text-xs text-fg-subtle">
                  {r.domainName ?? "—"} · {pricingModelLabel(r.pricingModel)}
                </p>
              </div>
              {r.freeTierAvailable && (
                <span className="shrink-0 text-xs text-success">✓ Free tier</span>
              )}
            </Link>
          ))}
          {visibleResults === 0 && (
            <div className="px-5 py-6 text-center text-xs text-fg-subtle">Searching…</div>
          )}
        </div>
      </div>
    </div>
  );
}
