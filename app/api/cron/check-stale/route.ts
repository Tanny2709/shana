import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const STALE_AFTER_DAYS = 90;
const FETCH_TIMEOUT_MS = 8000;

// A realistic User-Agent and a plain GET (not HEAD) avoid two classes of
// false positive observed against real provider docs sites: bot-blocking
// on requests with no/unusual UA, and servers that misroute HEAD (e.g.
// returning 404 for HEAD while GET on the same URL is a real 200).
const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (compatible; APIReferenceDirectoryBot/1.0; +https://example.com/bot)",
};

async function isUrlReachable(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: FETCH_HEADERS,
      signal: controller.signal,
      redirect: "follow",
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

// Scheduled job (see vercel.json) that:
//   1. Flags listings whose lastVerifiedAt is older than STALE_AFTER_DAYS.
//   2. Pings each active listing's docs URL and flags it if unreachable.
// Both just set status -> "needs_review"; nothing is ever auto-deleted or
// auto-edited, since a failed fetch could just as easily be our timeout as
// an actually-dead link — a human still makes the call in /admin.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured on the server." },
      { status: 503 },
    );
  }
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const staleThreshold = new Date(Date.now() - STALE_AFTER_DAYS * 24 * 60 * 60 * 1000);

  const active = await prisma.apiListing.findMany({
    where: { status: "active" },
    select: { id: true, slug: true, docsUrl: true, lastVerifiedAt: true },
  });

  const staleIds: string[] = [];
  const deadLinkIds: string[] = [];

  const reachability = await Promise.allSettled(
    active.map(async (listing) => {
      const isStaleByAge = listing.lastVerifiedAt < staleThreshold;
      if (isStaleByAge) staleIds.push(listing.id);

      const reachable = await isUrlReachable(listing.docsUrl);
      if (!reachable) deadLinkIds.push(listing.id);

      return { slug: listing.slug, isStaleByAge, reachable };
    }),
  );

  const flaggedIds = [...new Set([...staleIds, ...deadLinkIds])];

  if (flaggedIds.length > 0) {
    await prisma.apiListing.updateMany({
      where: { id: { in: flaggedIds } },
      data: { status: "needs_review" },
    });
  }

  return NextResponse.json({
    checked: active.length,
    flaggedStaleByAge: staleIds.length,
    flaggedDeadLink: deadLinkIds.length,
    totalFlagged: flaggedIds.length,
    details: reachability.map((r) => (r.status === "fulfilled" ? r.value : { error: "check failed" })),
  });
}
