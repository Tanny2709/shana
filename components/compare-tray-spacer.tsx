"use client";

import { useCompare } from "@/lib/compare-context";

// Reserves space at the bottom of the page so the fixed CompareTray doesn't
// cover footer content when it's showing.
export function CompareTraySpacer() {
  const { items } = useCompare();
  if (items.length === 0) return null;
  return <div className="h-16" aria-hidden />;
}
