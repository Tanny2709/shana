"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface IndexEntry {
  name: string;
  slug: string;
  shortDescription: string;
  provider: { slug: string; name: string };
  domains: { domain: { name: string } }[];
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<IndexEntry[] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        close();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  useEffect(() => {
    if (open && entries === null) {
      fetch("/api/search-index")
        .then((r) => r.json())
        .then(setEntries)
        .catch(() => setEntries([]));
    }
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open, entries]);

  const filtered = (entries ?? []).filter((e) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      e.name.toLowerCase().includes(q) ||
      e.provider.name.toLowerCase().includes(q) ||
      e.shortDescription.toLowerCase().includes(q)
    );
  }).slice(0, 8);

  function go(entry: IndexEntry) {
    close();
    router.push(`/api/${entry.provider.slug}/${entry.slug}`);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[15vh]" onClick={close}>
      <div
        className="w-full max-w-lg rounded-lg border border-border bg-bg-elevated shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter" && filtered[activeIndex]) {
              go(filtered[activeIndex]);
            }
          }}
          placeholder="Jump to an API..."
          className="w-full border-b border-border bg-transparent px-4 py-3.5 text-base text-fg placeholder:text-fg-subtle outline-none"
        />
        <div className="max-h-80 overflow-y-auto p-1.5">
          {entries === null && (
            <p className="px-3 py-6 text-center text-sm text-fg-subtle">Loading...</p>
          )}
          {entries !== null && filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-fg-subtle">No matches</p>
          )}
          {filtered.map((entry, i) => (
            <button
              key={`${entry.provider.slug}-${entry.slug}`}
              onClick={() => go(entry)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex w-full flex-col gap-0.5 rounded-md px-3 py-2 text-left ${
                i === activeIndex ? "bg-bg-hover" : ""
              }`}
            >
              <span className="text-sm font-medium text-fg">
                {entry.name} <span className="font-normal text-fg-subtle">— {entry.provider.name}</span>
              </span>
              <span className="line-clamp-1 text-xs text-fg-muted">{entry.shortDescription}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-[11px] text-fg-subtle">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
