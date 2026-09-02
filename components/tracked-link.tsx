"use client";

import { recordEngagement } from "@/lib/engagement";
import type { EngagementType } from "@prisma/client";
import type { ReactNode } from "react";

// A click here opens a new tab (target="_blank") so there's no navigation
// in the current tab to interrupt — recordEngagement just fires alongside
// it, client-initiated, not tied to the current page's response lifecycle.
export function TrackedLink({
  href,
  apiListingId,
  type,
  className,
  children,
}: {
  href: string;
  apiListingId: string;
  type: EngagementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        void recordEngagement(apiListingId, type);
      }}
    >
      {children}
    </a>
  );
}
