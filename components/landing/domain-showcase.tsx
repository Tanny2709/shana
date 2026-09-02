"use client";

import { useRef } from "react";
import Link from "next/link";
import { useInView } from "@/lib/hooks/use-in-view";
import { getDomainColorVar } from "@/lib/domain-colors";
import { ProviderMark } from "@/components/provider-mark";

export interface DomainPreview {
  id: string;
  name: string;
  slug: string;
  count: number;
  preview: { name: string; provider: { name: string; logoUrl: string | null } }[];
}

export function DomainShowcase({ domains }: { domains: DomainPreview[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; scrollLeft: number; dragging: boolean }>({
    startX: 0,
    scrollLeft: 0,
    dragging: false,
  });

  function onPointerDown(e: React.PointerEvent) {
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = { startX: e.clientX, scrollLeft: el.scrollLeft, dragging: true };
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    const el = scrollerRef.current;
    if (!el || !drag.current.dragging) return;
    el.scrollLeft = drag.current.scrollLeft - (e.clientX - drag.current.startX);
  }

  function onPointerUp() {
    drag.current.dragging = false;
  }

  return (
    <div
      ref={scrollerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      className="flex cursor-grab gap-4 overflow-x-auto pb-2 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {domains.map((domain, i) => (
        <DomainShowcaseCard key={domain.id} domain={domain} index={i} />
      ))}
    </div>
  );
}

function DomainShowcaseCard({ domain, index }: { domain: DomainPreview; index: number }) {
  const { ref, inView } = useInView<HTMLAnchorElement>();
  const color = getDomainColorVar(domain.slug);

  return (
    <Link
      ref={ref}
      href={`/domain/${domain.slug}`}
      style={
        {
          ...(inView ? { animationDelay: `${index * 90}ms` } : { opacity: 0 }),
          "--card-color": color,
        } as unknown as React.CSSProperties
      }
      className={`group relative flex w-64 shrink-0 flex-col gap-4 overflow-hidden rounded-lg border border-border p-5 transition-colors hover:border-border-strong ${
        inView ? "animate-fade-slide-up" : ""
      }`}
    >
      {/* Domain-colored top glow — a soft continuous idle pulse (~7s loop) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background: "radial-gradient(ellipse at top, var(--card-color), transparent 70%)",
          opacity: 0.28,
          animation: "landing-idle-glow 7s ease-in-out infinite",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
        style={{ background: "var(--card-color)" }}
      />

      <div className="relative">
        <h3 className="text-sm font-medium text-fg">{domain.name}</h3>
        <p className="mt-0.5 text-xs text-fg-subtle">
          {domain.count} {domain.count === 1 ? "API" : "APIs"}
        </p>
      </div>

      {domain.preview.length > 0 && (
        <div className="relative flex items-center gap-1.5 border-t border-border pt-3">
          <div className="flex -space-x-2">
            {domain.preview.slice(0, 4).map((p) => (
              <div key={p.provider.name} className="rounded-full ring-2 ring-bg-elevated">
                <ProviderMark name={p.provider.name} logoUrl={p.provider.logoUrl} size={26} />
              </div>
            ))}
          </div>
          <span className="truncate text-[11px] text-fg-subtle">
            {domain.preview
              .slice(0, 3)
              .map((p) => p.provider.name)
              .join(", ")}
          </span>
        </div>
      )}
    </Link>
  );
}
