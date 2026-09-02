"use client";

import { useState } from "react";
import { useBookmarks } from "@/lib/bookmark-context";
import type { BookmarkType } from "@prisma/client";

export function BookmarkButton({
  type,
  targetId,
  label,
  size = 18,
  className = "",
}: {
  type: BookmarkType;
  targetId: string;
  label: string;
  size?: number;
  className?: string;
}) {
  const { isBookmarked, toggle } = useBookmarks();
  const [pulsing, setPulsing] = useState(false);
  const bookmarked = isBookmarked(type, targetId);

  return (
    <button
      type="button"
      aria-pressed={bookmarked}
      aria-label={bookmarked ? `Remove ${label} from bookmarks` : `Bookmark ${label}`}
      title={bookmarked ? "Remove bookmark" : "Bookmark"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setPulsing(true);
        setTimeout(() => setPulsing(false), 200);
        void toggle(type, targetId, label);
      }}
      className={`flex shrink-0 items-center justify-center text-fg-subtle transition-colors hover:text-fg ${
        bookmarked ? "text-accent hover:text-accent" : ""
      } ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: pulsing ? "scale(1.25)" : "scale(1)",
          transition: "transform 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <path d="M19 21 12 16l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
