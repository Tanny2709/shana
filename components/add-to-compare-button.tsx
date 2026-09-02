"use client";

import { useCompare, type CompareItem } from "@/lib/compare-context";

export function AddToCompareButton({ item }: { item: CompareItem }) {
  const { isSelected, toggle, atLimit } = useCompare();
  const selected = isSelected(item.slug);
  const disabled = !selected && atLimit;

  return (
    <button
      type="button"
      onClick={() => toggle(item)}
      disabled={disabled}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors ${
        selected
          ? "border-accent text-accent"
          : "border-border text-fg-muted hover:border-border-strong hover:text-fg"
      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
    >
      {selected ? "Added to compare" : "Add to compare"}
    </button>
  );
}
