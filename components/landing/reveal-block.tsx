"use client";

import type { ReactNode } from "react";
import { useInView } from "@/lib/hooks/use-in-view";

// Landing-page-only entrance wrapper: staggered fade-slide-up (80-120ms
// steps per §4, more pronounced than the app's own 60-80ms) plus an
// optional slow idle glow so sections feel alive even at rest — small
// amplitude, continuous, never re-triggering.
export function RevealBlock({
  children,
  index = 0,
  glow = false,
  stepMs = 100,
}: {
  children: ReactNode;
  index?: number;
  glow?: boolean;
  stepMs?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);

  return (
    <div
      ref={ref}
      style={inView ? { animationDelay: `${index * stepMs}ms` } : { opacity: 0 }}
      className={`relative overflow-hidden rounded-lg ${inView ? "animate-fade-slide-up" : ""}`}
    >
      {glow && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-20 opacity-20"
          style={{
            background: "var(--landing-gradient)",
            backgroundSize: "200% 200%",
            animation: "landing-idle-glow 8s ease-in-out infinite, landing-gradient-drift 12s ease-in-out infinite",
          }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
