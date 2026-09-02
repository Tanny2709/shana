"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { BookmarkType } from "@prisma/client";

export async function getMyBookmarkIds() {
  const session = await auth();
  if (!session?.user) return { domainIds: [] as string[], listingIds: [] as string[] };

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    select: { type: true, targetId: true },
  });

  return {
    domainIds: bookmarks.filter((b) => b.type === "domain").map((b) => b.targetId),
    listingIds: bookmarks.filter((b) => b.type === "api_listing").map((b) => b.targetId),
  };
}

export async function toggleBookmark(type: BookmarkType, targetId: string) {
  const session = await auth();
  if (!session?.user) return { status: "unauthenticated" as const };

  const userId = session.user.id;
  const existing = await prisma.bookmark.findUnique({
    where: { userId_type_targetId: { userId, type, targetId } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    revalidatePath("/bookmarks");
    return { status: "removed" as const };
  }

  await prisma.bookmark.create({ data: { userId, type, targetId } });
  revalidatePath("/bookmarks");
  return { status: "added" as const };
}
