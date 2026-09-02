"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useDemoModal } from "@/lib/demo-modal-context";

const DEMO_STEP_MS = 5000;

const STEPS = [
  { key: "search", label: "Search", cursorAnim: "demo-cursor-search" },
  { key: "filter", label: "Filter", cursorAnim: "demo-cursor-filter" },
  { key: "detail", label: "Detail page", cursorAnim: "demo-cursor-detail" },
  { key: "bookmark", label: "Bookmark", cursorAnim: "demo-cursor-bookmark" },
] as const;

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(reducedMotionQuery);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  );
}

export function DemoModal() {
  const { open, closeDemo } = useDemoModal();
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Reset to the first step whenever the modal closes, so it always
    // reopens at the start of the walkthrough rather than mid-loop.
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStepIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open || reducedMotion) return;
    const timer = setTimeout(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, DEMO_STEP_MS);
    return () => clearTimeout(timer);
  }, [open, reducedMotion, stepIndex]);

  function tryItYourself() {
    closeDemo();
    router.push("/signup");
  }

  if (!open) return null;

  const step = STEPS[stepIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={closeDemo}
      role="dialog"
      aria-modal="true"
      aria-label="Product walkthrough"
    >
      <div
        className="w-full max-w-xl rounded-lg border border-border bg-bg-elevated p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-fg">How it works</h2>
          <button
            type="button"
            onClick={closeDemo}
            aria-label="Close"
            className="text-fg-subtle hover:text-fg"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar — restarts (remounts via key) on every step change,
            whether triggered by the timer or a manual dot click. */}
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-bg">
          {!reducedMotion && (
            <div
              key={stepIndex}
              className="h-full animate-progress-fill bg-accent"
              style={{ animationDuration: `${DEMO_STEP_MS}ms` }}
            />
          )}
        </div>

        <div key={stepIndex} className="animate-fade-slide-up mt-5">
          <DemoStage step={step.key} cursorAnim={step.cursorAnim} animate={!reducedMotion} onSignUp={tryItYourself} />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-1.5">
            {STEPS.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setStepIndex(i)}
                aria-label={`Show ${s.label} step`}
                aria-current={i === stepIndex}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === stepIndex ? "bg-accent" : "bg-border-strong"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={tryItYourself}
            className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg hover:opacity-90"
          >
            Try it yourself
          </button>
        </div>
      </div>
    </div>
  );
}

function DemoStage({
  step,
  cursorAnim,
  animate,
  onSignUp,
}: {
  step: (typeof STEPS)[number]["key"];
  cursorAnim: string;
  animate: boolean;
  onSignUp: () => void;
}) {
  return (
    <div className="relative h-56 overflow-hidden rounded-md border border-border bg-bg p-4">
      {step === "search" && <SearchStage animate={animate} />}
      {step === "filter" && <FilterStage animate={animate} />}
      {step === "detail" && <DetailStage animate={animate} />}
      {step === "bookmark" && <BookmarkStage animate={animate} onSignUp={onSignUp} />}
      {animate && (
        <div
          className="absolute top-0 left-0 h-3 w-3 rounded-full bg-fg shadow-[0_0_0_4px_var(--bg)]"
          style={{ animation: `${cursorAnim} ${DEMO_STEP_MS}ms cubic-bezier(0.16, 1, 0.3, 1) forwards` }}
        />
      )}
    </div>
  );
}

function SearchStage({ animate }: { animate: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-64 rounded-md border border-border bg-bg-elevated px-3 py-2">
        <span
          className="inline-block overflow-hidden whitespace-nowrap align-middle text-sm text-fg"
          style={
            animate
              ? { animation: `demo-typewriter ${DEMO_STEP_MS * 0.35}ms steps(6) forwards`, animationDelay: `${DEMO_STEP_MS * 0.4}ms`, width: 0 }
              : { width: "auto" }
          }
        >
          stripe
        </span>
      </div>
      <div
        className="mt-2 flex flex-col gap-1.5 opacity-0"
        style={animate ? { animation: "fade-slide-up 300ms ease-out forwards", animationDelay: `${DEMO_STEP_MS * 0.75}ms` } : { opacity: 1 }}
      >
        <div className="h-8 w-52 rounded border border-border bg-bg-elevated" />
        <div className="h-8 w-44 rounded border border-border bg-bg-elevated" />
      </div>
    </div>
  );
}

function FilterStage({ animate }: { animate: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="flex w-16 flex-col gap-2 text-[10px] text-fg-subtle">
        <span>Pricing</span>
        <span
          className="flex items-center gap-1 rounded border border-border px-1.5 py-1"
          style={
            animate
              ? { animation: "fade-slide-up 200ms ease-out forwards", animationDelay: `${DEMO_STEP_MS * 0.55}ms`, background: "color-mix(in srgb, var(--accent) 15%, transparent)" }
              : {}
          }
        >
          Free tier
        </span>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-10 rounded border border-border bg-bg-elevated"
            style={
              i < 2 && animate
                ? { animation: "fade-slide-up 250ms ease-out forwards", animationDelay: `${DEMO_STEP_MS * 0.6}ms`, opacity: 0 }
                : i >= 2
                  ? { opacity: 0.3 }
                  : {}
            }
          />
        ))}
      </div>
    </div>
  );
}

function DetailStage({ animate }: { animate: boolean }) {
  return (
    <div
      className="flex flex-col gap-2 opacity-0"
      style={animate ? { animation: "fade-slide-up 300ms ease-out forwards", animationDelay: `${DEMO_STEP_MS * 0.5}ms` } : { opacity: 1 }}
    >
      <div className="h-4 w-40 rounded bg-bg-elevated" />
      <div className="h-2 w-56 rounded bg-bg-elevated" />
      <div className="mt-2 h-8 w-28 rounded bg-accent/60" />
      <div className="mt-3 flex flex-col gap-1.5 rounded border border-border">
        <div className="flex justify-between border-b border-border px-2 py-1.5 text-[10px] text-fg-subtle">
          <span>Model</span>
          <span>Free tier</span>
        </div>
        <div className="flex justify-between px-2 py-1.5 text-[10px] text-fg-subtle">
          <span>Rate limits</span>
          <span>10 rps</span>
        </div>
      </div>
    </div>
  );
}

function BookmarkStage({ animate, onSignUp }: { animate: boolean; onSignUp: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 rounded bg-bg-elevated" />
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-fg-subtle"
          style={animate ? { animation: "demo-click-pulse 400ms ease-out", animationDelay: `${DEMO_STEP_MS * 0.55}ms` } : undefined}
        >
          <path d="M19 21 12 16l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <div
        className="flex items-center gap-2 rounded-md border border-dashed border-border-strong px-3 py-2 opacity-0"
        style={animate ? { animation: "fade-slide-up 300ms ease-out forwards", animationDelay: `${DEMO_STEP_MS * 0.62}ms` } : { opacity: 1 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-fg-subtle">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="text-xs text-fg-muted">Sign up to save bookmarks</span>
        <button
          type="button"
          onClick={onSignUp}
          className="ml-auto shrink-0 rounded bg-accent px-2 py-1 text-[11px] font-medium text-accent-fg hover:opacity-90"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
