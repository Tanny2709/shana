"use client";

import type { ReactNode } from "react";
import { useInView } from "@/lib/hooks/use-in-view";

export function ScrollReveal({ children }: { children: ReactNode }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  return (
    <div ref={ref} className={inView ? "animate-fade-slide-up" : "opacity-0"}>
      {children}
    </div>
  );
}
