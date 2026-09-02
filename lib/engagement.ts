"use server";

import { prisma } from "@/lib/prisma";
import type { EngagementType } from "@prisma/client";

// Fire-and-forget event recording — never blocks or fails the page/click
// it's attached to. No user identity is attached (see schema comment).
export async function recordEngagement(apiListingId: string, type: EngagementType) {
  try {
    await prisma.engagementEvent.create({ data: { apiListingId, type } });
  } catch {
    // Recording engagement should never break the feature it's attached to.
  }
}

const TRENDING_WINDOW_DAYS = 7;

// Ranks listings by recent `view` events. Returns an empty array (not
// placeholder/zero rows) until enough real activity exists — see
// lib/data.ts's getTrending, which is the only caller and treats an empty
// result as "don't render this section."
export async function getTrendingListingIds(limit = 4): Promise<string[]> {
  const since = new Date(Date.now() - TRENDING_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const grouped = await prisma.engagementEvent.groupBy({
    by: ["apiListingId"],
    where: { type: "view", createdAt: { gte: since } },
    _count: true,
    orderBy: { _count: { apiListingId: "desc" } },
    take: limit,
  });
  return grouped.map((g) => g.apiListingId);
}

export interface EngagementStats {
  views: number;
  keyClicks: number;
  docsClicks: number;
  compareAdds: number;
}

export async function getEngagementStats(apiListingId: string): Promise<EngagementStats> {
  const counts = await prisma.engagementEvent.groupBy({
    by: ["type"],
    where: { apiListingId },
    _count: true,
  });
  const byType = Object.fromEntries(counts.map((c) => [c.type, c._count])) as Record<EngagementType, number>;
  return {
    views: byType.view ?? 0,
    keyClicks: byType.key_click ?? 0,
    docsClicks: byType.docs_click ?? 0,
    compareAdds: byType.compare_add ?? 0,
  };
}
