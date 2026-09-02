"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { recordEngagement } from "@/lib/engagement";
import { useToast } from "@/lib/toast-context";

export interface CompareItem {
  id: string;
  slug: string;
  name: string;
  providerName: string;
}

const MAX_COMPARE = 3;
const STORAGE_KEY = "compare-items";

interface CompareContextValue {
  items: CompareItem[];
  isSelected: (slug: string) => boolean;
  toggle: (item: CompareItem) => void;
  remove: (slug: string) => void;
  clear: () => void;
  atLimit: boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Reading localStorage must happen post-mount (it's unavailable during
    // SSR/hydration) — this one-time sync-after-mount is the standard fix
    // for hydration-safe persisted state, not a subscription.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore malformed/unavailable storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage write failures (e.g. private browsing)
    }
  }, [items, hydrated]);

  function toggle(item: CompareItem) {
    let outcome: "added" | "removed" | "limit" = "added";
    setItems((prev) => {
      const exists = prev.some((i) => i.slug === item.slug);
      if (exists) {
        outcome = "removed";
        return prev.filter((i) => i.slug !== item.slug);
      }
      if (prev.length >= MAX_COMPARE) {
        outcome = "limit";
        return prev;
      }
      outcome = "added";
      return [...prev, item];
    });

    if (outcome === "added") {
      void recordEngagement(item.id, "compare_add");
      showToast(`Added ${item.name} to compare`);
    } else if (outcome === "removed") {
      showToast(`Removed ${item.name} from compare`);
    } else {
      showToast("Compare up to 3 APIs at a time");
    }
  }

  function remove(slug: string) {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }

  function clear() {
    setItems([]);
  }

  const value: CompareContextValue = {
    items,
    isSelected: (slug) => items.some((i) => i.slug === slug),
    toggle,
    remove,
    clear,
    atLimit: items.length >= MAX_COMPARE,
  };

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within a CompareProvider");
  return ctx;
}

export { MAX_COMPARE };
