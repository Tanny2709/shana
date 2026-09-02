"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getMyBookmarkIds, toggleBookmark } from "@/lib/actions/bookmarks";
import { useToast } from "@/lib/toast-context";
import type { BookmarkType } from "@prisma/client";

interface BookmarkContextValue {
  isBookmarked: (type: BookmarkType, targetId: string) => boolean;
  toggle: (type: BookmarkType, targetId: string, label: string) => Promise<void>;
  authenticated: boolean;
}

const BookmarkContext = createContext<BookmarkContextValue | null>(null);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [domainIds, setDomainIds] = useState<Set<string>>(new Set());
  const [listingIds, setListingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Resets/refetches the locally-held bookmark set whenever auth status
    // changes (login, logout, or initial session resolution) — this is a
    // one-shot sync with an external system (the session + the server's
    // bookmark table), not a subscription, so a direct setState here is
    // the correct shape despite the lint rule's general guidance.
    if (status !== "authenticated") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDomainIds(new Set());
      setListingIds(new Set());
      return;
    }
    getMyBookmarkIds().then(({ domainIds, listingIds }) => {
      setDomainIds(new Set(domainIds));
      setListingIds(new Set(listingIds));
    });
  }, [status]);

  function isBookmarked(type: BookmarkType, targetId: string) {
    return (type === "domain" ? domainIds : listingIds).has(targetId);
  }

  async function toggle(type: BookmarkType, targetId: string, label: string) {
    if (status !== "authenticated") {
      router.push("/signup");
      return;
    }

    const setFn = type === "domain" ? setDomainIds : setListingIds;
    const wasBookmarked = isBookmarked(type, targetId);

    setFn((prev) => {
      const next = new Set(prev);
      if (wasBookmarked) next.delete(targetId);
      else next.add(targetId);
      return next;
    });

    const result = await toggleBookmark(type, targetId);

    if (result.status === "unauthenticated") {
      setFn((prev) => {
        const next = new Set(prev);
        if (wasBookmarked) next.add(targetId);
        else next.delete(targetId);
        return next;
      });
      router.push("/signup");
      return;
    }

    showToast(result.status === "added" ? `Added ${label} to bookmarks` : `Removed ${label} from bookmarks`);
  }

  return (
    <BookmarkContext.Provider value={{ isBookmarked, toggle, authenticated: status === "authenticated" }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error("useBookmarks must be used within a BookmarkProvider");
  return ctx;
}
