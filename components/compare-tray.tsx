"use client";

import Link from "next/link";
import { useCompare } from "@/lib/compare-context";

export function CompareTray() {
  const { items, remove, clear } = useCompare();

  if (items.length === 0) return null;

  const href = `/compare?ids=${items.map((i) => i.slug).join(",")}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <span className="text-xs font-medium text-fg-muted">
          Compare ({items.length}/3)
        </span>
        <div className="flex flex-1 flex-wrap gap-1.5">
          {items.map((item) => (
            <span
              key={item.slug}
              className="flex items-center gap-1 rounded-full border border-border bg-bg-elevated py-0.5 pl-2.5 pr-1 text-xs text-fg"
            >
              {item.name}
              <button
                type="button"
                onClick={() => remove(item.slug)}
                aria-label={`Remove ${item.name} from comparison`}
                className="flex h-4 w-4 items-center justify-center rounded-full text-fg-subtle hover:text-fg"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={clear}
          className="text-xs text-fg-subtle hover:text-fg"
        >
          Clear
        </button>
        <Link
          href={href}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-opacity ${
            items.length >= 2
              ? "bg-accent text-accent-fg hover:opacity-90"
              : "pointer-events-none bg-bg-elevated text-fg-subtle"
          }`}
        >
          Compare
        </Link>
      </div>
    </div>
  );
}
