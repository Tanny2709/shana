"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { getDomainColorVar } from "@/lib/domain-colors";
import { pricingModelLabel } from "@/lib/format";

export interface TerminalResult {
  id: string;
  name: string;
  providerName: string;
  domainName: string | null;
  domainSlug: string | null;
  pricingModel: string;
}

export interface TerminalQuery {
  query: string;
  results: TerminalResult[];
}

const TYPE_MS = 50;
const DELETE_MS = 28;
const HOLD_MS = 1700;

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

export function HeroTerminal({ queries }: { queries: TerminalQuery[] }) {
  const reducedMotion = useReducedMotion();
  const [queryIndex, setQueryIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(reducedMotion ? queries[0]?.query.length ?? 0 : 0);
  const [phase, setPhase] = useState<"typing" | "hold" | "deleting">(reducedMotion ? "hold" : "typing");

  const current = queries[queryIndex] ?? queries[0];

  useEffect(() => {
    if (reducedMotion || !current) return;

    if (phase === "typing") {
      if (charIndex < current.query.length) {
        const t = setTimeout(() => setCharIndex((c) => c + 1), TYPE_MS);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("hold"), HOLD_MS);
      return () => clearTimeout(t);
    }
    if (phase === "hold") {
      const t = setTimeout(() => setPhase("deleting"), HOLD_MS);
      return () => clearTimeout(t);
    }
    if (phase === "deleting") {
      if (charIndex > 0) {
        const t = setTimeout(() => setCharIndex((c) => c - 1), DELETE_MS);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => {
        setQueryIndex((i) => (i + 1) % queries.length);
        setPhase("typing");
      }, 250);
      return () => clearTimeout(t);
    }
  }, [phase, charIndex, current, queries.length, reducedMotion]);

  if (!current) return null;

  const typed = current.query.slice(0, charIndex);
  const showResults = reducedMotion || phase === "hold" || (phase === "deleting" && charIndex === current.query.length);

  return (
    <div className="relative mx-auto mt-10 max-w-lg">
      {/* Saturated gradient glow behind the terminal — the richest motion on
          the page, everything else in the hero stays secondary to it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-2xl opacity-40 blur-2xl"
        style={{ background: "var(--landing-gradient)", animation: "drift-1 10s ease-in-out infinite" }}
      />

      <div className="relative overflow-hidden rounded-lg border border-border-strong bg-bg-elevated text-left shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--landing-coral)" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--landing-amber)" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--landing-blue)" }} />
          <span className="ml-2 text-[11px] text-fg-subtle">Quick search</span>
          <kbd className="ml-auto rounded border border-border px-1.5 py-0.5 text-[10px] text-fg-subtle">⌘K</kbd>
        </div>

        <div className="px-4 py-3.5">
          <div className="flex items-center gap-2 font-mono text-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-fg-subtle">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span className="text-fg">{typed}</span>
            <span className="h-4 w-[2px] bg-accent" style={{ animation: reducedMotion ? undefined : "landing-idle-glow 1s step-end infinite" }} />
          </div>
        </div>

        <div className="flex min-h-[132px] flex-col gap-1 border-t border-border px-2 py-2">
          {showResults &&
            current.results.map((r) => {
              const color = r.domainSlug ? getDomainColorVar(r.domainSlug) : "var(--landing-blue)";
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-2.5 rounded-md px-2 py-2 animate-fade-slide-up"
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[11px] font-medium"
                    style={{ background: `color-mix(in srgb, ${color} 20%, transparent)`, color }}
                  >
                    {r.providerName.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-fg">{r.name}</p>
                    <p className="truncate text-[11px] text-fg-subtle">{r.providerName}</p>
                  </div>
                  {r.domainName && (
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{ background: `color-mix(in srgb, ${color} 18%, transparent)`, color }}
                    >
                      {r.domainName}
                    </span>
                  )}
                  <span className="shrink-0 text-[10px] text-fg-subtle">{pricingModelLabel(r.pricingModel)}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
