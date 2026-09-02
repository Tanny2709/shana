"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({
  size = "md",
  defaultValue = "",
  autoFocus = false,
  showShortcut = false,
}: {
  size?: "md" | "lg";
  defaultValue?: string;
  autoFocus?: boolean;
  showShortcut?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  const isLarge = size === "lg";

  return (
    <form onSubmit={onSubmit} className="relative w-full">
      <svg
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle"
        width={isLarge ? 18 : 15}
        height={isLarge ? 18 : 15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search APIs by name, provider, or use case..."
        autoFocus={autoFocus}
        className={
          isLarge
            ? "w-full rounded-lg border border-border bg-bg-elevated py-3.5 pl-11 pr-4 text-base text-fg placeholder:text-fg-subtle outline-none transition-colors focus:border-accent"
            : `w-full rounded-md border border-border bg-bg-elevated py-1.5 pl-9 text-sm text-fg placeholder:text-fg-subtle outline-none transition-colors focus:border-accent ${
                showShortcut ? "pr-11" : "pr-3"
              }`
        }
      />
      {showShortcut && (
        <kbd
          id="onboarding-cmdk"
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border px-1.5 py-0.5 text-[11px] text-fg-subtle"
        >
          ⌘K
        </kbd>
      )}
    </form>
  );
}
