import { getListingDetail } from "@/lib/data";
import { jsonResponse, corsPreflight } from "@/lib/api-response";

export async function OPTIONS() {
  return corsPreflight();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ provider: string; slug: string }> },
) {
  const { provider, slug } = await params;
  const listing = await getListingDetail(provider, slug);

  if (!listing || listing.status !== "active") {
    return jsonResponse({ error: "Not found" }, { status: 404 });
  }

  return jsonResponse({
    slug: listing.slug,
    name: listing.name,
    provider: {
      name: listing.provider.name,
      slug: listing.provider.slug,
      website: listing.provider.website,
      logoUrl: listing.provider.logoUrl,
    },
    shortDescription: listing.shortDescription,
    useCases: listing.useCases,
    docsUrl: listing.docsUrl,
    signupUrl: listing.signupUrl,
    authMethod: listing.authMethod,
    freeTierAvailable: listing.freeTierAvailable,
    freeTierDetails: listing.freeTierDetails,
    pricingModel: listing.pricingModel,
    pricingSummary: listing.pricingSummary,
    rateLimits: listing.rateLimits,
    howToGetKey: listing.howToGetKey,
    domains: listing.domains.map((d) => ({ name: d.domain.name, slug: d.domain.slug })),
    lastVerifiedAt: listing.lastVerifiedAt,
  });
}
