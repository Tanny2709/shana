"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { listingInputSchema, type ListingInput } from "@/lib/schema/listing";
import type { AuthMethod, PricingModel } from "@prisma/client";

export interface ContributeFormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof ListingInput, string>>;
}

function parseFormData(formData: FormData) {
  return {
    providerName: String(formData.get("providerName") ?? ""),
    providerSlug: String(formData.get("providerSlug") ?? ""),
    providerWebsite: String(formData.get("providerWebsite") ?? ""),
    providerDescription: String(formData.get("providerDescription") ?? ""),
    providerLogoUrl: String(formData.get("providerLogoUrl") ?? ""),
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    useCases: String(formData.get("useCases") ?? ""),
    docsUrl: String(formData.get("docsUrl") ?? ""),
    signupUrl: String(formData.get("signupUrl") ?? ""),
    authMethod: String(formData.get("authMethod") ?? ""),
    freeTierAvailable: formData.get("freeTierAvailable") === "on",
    freeTierDetails: String(formData.get("freeTierDetails") ?? ""),
    pricingModel: String(formData.get("pricingModel") ?? ""),
    pricingSummary: String(formData.get("pricingSummary") ?? ""),
    rateLimits: String(formData.get("rateLimits") ?? ""),
    howToGetKey: String(formData.get("howToGetKey") ?? ""),
    domainSlugs: formData.getAll("domainSlugs").map(String),
  };
}

export async function submitListingContribution(
  apiListingId: string | null,
  _prevState: ContributeFormState,
  formData: FormData,
): Promise<ContributeFormState> {
  const raw = parseFormData(formData);
  const result = listingInputSchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: Partial<Record<keyof ListingInput, string>> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof ListingInput;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Please fix the errors below.", fieldErrors };
  }

  const submitterName = String(formData.get("submitterName") ?? "").trim();
  const submitterEmail = String(formData.get("submitterEmail") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  await prisma.contribution.create({
    data: {
      type: apiListingId ? "edit" : "new_listing",
      apiListingId: apiListingId ?? undefined,
      payload: result.data,
      submitterName: submitterName || undefined,
      submitterEmail: submitterEmail || undefined,
      notes: notes || undefined,
    },
  });

  return { status: "success", message: "Thanks! Your contribution is pending review." };
}

export interface ReportFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function submitReport(
  apiListingId: string,
  _prevState: ReportFormState,
  formData: FormData,
): Promise<ReportFormState> {
  const notes = String(formData.get("notes") ?? "").trim();
  if (!notes) {
    return { status: "error", message: "Please describe what's outdated." };
  }

  await prisma.contribution.create({
    data: {
      type: "report",
      apiListingId,
      payload: {},
      notes,
    },
  });

  return { status: "success", message: "Thanks — we'll take a look." };
}

async function requireAdmin() {
  // Route-level protection lives in middleware.ts (HTTP Basic Auth on /admin).
  // This is a defense-in-depth check for the mutating actions themselves.
  const { headers } = await import("next/headers");
  const h = await headers();
  const auth = h.get("authorization");
  const expected = `Basic ${Buffer.from(
    `${process.env.ADMIN_USER}:${process.env.ADMIN_PASSWORD}`,
  ).toString("base64")}`;
  if (!process.env.ADMIN_USER || !process.env.ADMIN_PASSWORD || auth !== expected) {
    throw new Error("Unauthorized");
  }
}

export async function approveContribution(contributionId: string) {
  await requireAdmin();

  const contribution = await prisma.contribution.findUniqueOrThrow({
    where: { id: contributionId },
  });

  if (contribution.type === "report") {
    await prisma.apiListing.update({
      where: { id: contribution.apiListingId! },
      data: { status: "needs_review" },
    });
  } else {
    const payload = listingInputSchema.parse(contribution.payload);

    const provider = await prisma.provider.upsert({
      where: { slug: payload.providerSlug },
      update: {
        name: payload.providerName,
        website: payload.providerWebsite,
        description: payload.providerDescription || null,
        logoUrl: payload.providerLogoUrl || null,
      },
      create: {
        name: payload.providerName,
        slug: payload.providerSlug,
        website: payload.providerWebsite,
        description: payload.providerDescription || null,
        logoUrl: payload.providerLogoUrl || null,
      },
    });

    const domains = await prisma.domain.findMany({
      where: { slug: { in: payload.domainSlugs } },
    });

    const listingData = {
      providerId: provider.id,
      name: payload.name,
      shortDescription: payload.shortDescription,
      useCases: payload.useCases,
      docsUrl: payload.docsUrl,
      signupUrl: payload.signupUrl,
      authMethod: payload.authMethod as AuthMethod,
      freeTierAvailable: payload.freeTierAvailable,
      freeTierDetails: payload.freeTierDetails || null,
      pricingModel: payload.pricingModel as PricingModel,
      pricingSummary: payload.pricingSummary,
      rateLimits: payload.rateLimits || null,
      howToGetKey: payload.howToGetKey,
      lastVerifiedAt: new Date(),
      status: "active" as const,
    };

    const listing = await prisma.apiListing.upsert({
      where: { slug: payload.slug },
      update: listingData,
      create: { slug: payload.slug, ...listingData },
    });

    await prisma.apiListingDomain.deleteMany({ where: { apiListingId: listing.id } });
    for (const domain of domains) {
      await prisma.apiListingDomain.create({
        data: { apiListingId: listing.id, domainId: domain.id },
      });
    }
  }

  await prisma.contribution.update({
    where: { id: contributionId },
    data: { status: "approved" },
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function rejectContribution(contributionId: string, formData: FormData) {
  await requireAdmin();
  const reviewNotes = String(formData.get("reviewNotes") ?? "").trim();
  await prisma.contribution.update({
    where: { id: contributionId },
    data: { status: "rejected", reviewNotes: reviewNotes || undefined },
  });
  revalidatePath("/admin");
}
