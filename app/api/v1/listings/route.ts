import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonResponse, corsPreflight } from "@/lib/api-response";
import type { AuthMethod, PricingModel } from "@prisma/client";

export const dynamic = "force-dynamic";

const PRICING_MODELS = ["free", "freemium", "pay_as_you_go", "subscription", "credit_based"];
const AUTH_METHODS = ["api_key", "oauth", "both", "none"];
const MAX_LIMIT = 100;

export async function OPTIONS() {
  return corsPreflight();
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const domain = params.get("domain") ?? undefined;
  const pricingModel = params.get("pricingModel") ?? undefined;
  const authMethod = params.get("authMethod") ?? undefined;
  const freeTier = params.get("freeTier");
  const page = Math.max(1, Number(params.get("page")) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(params.get("limit")) || 20));

  if (pricingModel && !PRICING_MODELS.includes(pricingModel)) {
    return jsonResponse(
      { error: `Invalid pricingModel. Must be one of: ${PRICING_MODELS.join(", ")}` },
      { status: 400 },
    );
  }
  if (authMethod && !AUTH_METHODS.includes(authMethod)) {
    return jsonResponse(
      { error: `Invalid authMethod. Must be one of: ${AUTH_METHODS.join(", ")}` },
      { status: 400 },
    );
  }

  const where = {
    status: "active" as const,
    ...(domain ? { domains: { some: { domain: { slug: domain } } } } : {}),
    ...(pricingModel ? { pricingModel: pricingModel as PricingModel } : {}),
    ...(authMethod ? { authMethod: authMethod as AuthMethod } : {}),
    ...(freeTier === "true" ? { freeTierAvailable: true } : {}),
  };

  const [listings, total] = await Promise.all([
    prisma.apiListing.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        provider: { select: { name: true, slug: true, website: true, logoUrl: true } },
        domains: { select: { domain: { select: { name: true, slug: true } } } },
      },
    }),
    prisma.apiListing.count({ where }),
  ]);

  const data = listings.map((l) => ({
    slug: l.slug,
    name: l.name,
    provider: l.provider,
    shortDescription: l.shortDescription,
    useCases: l.useCases,
    docsUrl: l.docsUrl,
    signupUrl: l.signupUrl,
    authMethod: l.authMethod,
    freeTierAvailable: l.freeTierAvailable,
    freeTierDetails: l.freeTierDetails,
    pricingModel: l.pricingModel,
    pricingSummary: l.pricingSummary,
    rateLimits: l.rateLimits,
    domains: l.domains.map((d) => d.domain),
    lastVerifiedAt: l.lastVerifiedAt,
  }));

  return jsonResponse({
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
