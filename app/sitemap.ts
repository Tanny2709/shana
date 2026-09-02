import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { collections } from "@/lib/collections";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [listings, domains, providers] = await Promise.all([
    prisma.apiListing.findMany({
      where: { status: "active" },
      select: { slug: true, updatedAt: true, provider: { select: { slug: true } } },
    }),
    prisma.domain.findMany({ select: { slug: true } }),
    prisma.provider.findMany({
      where: { listings: { some: { status: "active" } } },
      select: { slug: true },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/search`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/browse`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/free-apis`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/collections`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/use-cases`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/contribute`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const providerRoutes: MetadataRoute.Sitemap = providers.map((p) => ({
    url: `${SITE_URL}/provider/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const domainRoutes: MetadataRoute.Sitemap = domains.map((d) => ({
    url: `${SITE_URL}/domain/${d.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${SITE_URL}/collections/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const listingRoutes: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${SITE_URL}/api/${l.provider.slug}/${l.slug}`,
    lastModified: l.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...domainRoutes, ...providerRoutes, ...collectionRoutes, ...listingRoutes];
}
