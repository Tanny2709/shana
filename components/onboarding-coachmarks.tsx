"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const STEPS = [
  {
    targetId: "onboarding-search",
    title: "Search everything",
    body: "Search by name, provider, or use case — every API in the directory is one query away.",
  },
  {
    targetId: "onboarding-cmdk",
    title: "Jump instantly",
    body: "Press ⌘K (or Ctrl+K) from anywhere to open quick search.",
  },
  {
    targetId: "onboarding-bookmarks",
    title: "Your bookmarks",
    body: "APIs and domains you bookmark show up here, across visits.",
  },
];

interface Position {
  top: number;
  left: number;
}

export function OnboardingCoachmarks() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("onboarding") === "1";

  const [stepIndex, setStepIndex] = useState(0);
  const [position, setPosition] = useState<Position | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!active || dismissed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPosition(null);
      return;
    }
    const target = document.getElementById(STEPS[stepIndex].targetId);
    if (!target) {
      // Target not present (e.g. narrow viewport hides the header nav) —
      // skip straight past it rather than showing a floating tooltip
      // pointing at nothing.
      if (stepIndex < STEPS.length - 1) {
        setStepIndex((i) => i + 1);
      } else {
        setPosition(null);
      }
      return;
    }
    const rect = target.getBoundingClientRect();
    setPosition({ top: rect.bottom + 10, left: Math.max(12, Math.min(rect.left, window.innerWidth - 300)) });
  }, [active, dismissed, stepIndex]);

  function finish() {
    setDismissed(true);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("onboarding");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  if (!active || dismissed || !position) return null;

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  return (
    <div
      className="fixed z-50 w-72 rounded-lg border border-border bg-bg-elevated p-4 shadow-lg animate-fade-slide-up"
      style={{ top: position.top, left: position.left }}
    >
      <p className="text-sm font-medium text-fg">{step.title}</p>
      <p className="mt-1 text-xs text-fg-muted">{step.body}</p>
      <div className="mt-3 flex items-center justify-between">
        <button type="button" onClick={finish} className="text-xs text-fg-subtle hover:text-fg">
          Skip
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-fg-subtle">
            {stepIndex + 1}/{STEPS.length}
          </span>
          <button
            type="button"
            onClick={() => (isLast ? finish() : setStepIndex((i) => i + 1))}
            className="rounded bg-accent px-2.5 py-1 text-xs font-medium text-accent-fg hover:opacity-90"
          >
            {isLast ? "Got it" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
