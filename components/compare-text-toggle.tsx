"use client";

import { useCompare, type CompareItem } from "@/lib/compare-context";

// Text-button variant of CompareToggle for card footers, matching the
// "+ Compare" secondary action from the product brief.
export function CompareTextToggle({ item }: { item: CompareItem }) {
  const { isSelected, toggle, atLimit } = useCompare();
  const selected = isSelected(item.slug);
  const disabled = !selected && atLimit;

  return (
    <button
      type="button"
      title={disabled ? "Compare up to 3 at a time" : undefined}
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => toggle(item)}
      className={`text-xs font-medium transition-colors ${
        selected ? "text-accent" : "text-fg-muted hover:text-fg"
      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
    >
      {selected ? "✓ Comparing" : "+ Compare"}
    </button>
  );
}
