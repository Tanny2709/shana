"use client";

import { useCompare, type CompareItem } from "@/lib/compare-context";

export function CompareToggle({ item }: { item: CompareItem }) {
  const { isSelected, toggle, atLimit } = useCompare();
  const selected = isSelected(item.slug);
  const disabled = !selected && atLimit;

  return (
    <button
      type="button"
      title={selected ? "Remove from comparison" : disabled ? "Compare up to 3 at a time" : "Add to comparison"}
      aria-pressed={selected}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(item);
      }}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
        selected
          ? "border-accent bg-accent text-accent-fg"
          : "border-border text-transparent hover:border-border-strong hover:text-fg-subtle"
      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </button>
  );
}
