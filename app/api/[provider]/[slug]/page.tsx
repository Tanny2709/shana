import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingDetail, getAlternatives } from "@/lib/data";
import { computeScore } from "@/lib/scoring";
import { getGoodToKnow, getConsiderAlternativesIf } from "@/lib/best-for";
import { getDataConfidence } from "@/lib/freshness";
import { ProviderMark } from "@/components/provider-mark";
import { PricingTable } from "@/components/pricing-table";
import { FreshnessIndicator } from "@/components/freshness-indicator";
import { authMethodLabel, pricingModelLabel } from "@/lib/format";
import { ReportOutdatedButton } from "@/components/report-outdated-button";
import { AddToCompareButton } from "@/components/add-to-compare-button";
import { ScoreBadge } from "@/components/score-badge";
import { ScoreBreakdown } from "@/components/score-breakdown";
import { BestForSection } from "@/components/best-for-section";
import { AlternativesSection } from "@/components/alternatives-section";
import { DataConfidence } from "@/components/data-confidence";
import { DeveloperSupport } from "@/components/developer-support";
import { recordEngagement } from "@/lib/engagement";
import { TrackedLink } from "@/components/tracked-link";
import { CopyButton } from "@/components/copy-button";
import { ExternalLinkIcon } from "@/components/external-link-icon";
import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ provider: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { provider, slug } = await params;
  const listing = await getListingDetail(provider, slug);
  if (!listing) return {};

  const path = `/api/${provider}/${slug}`;
  const title = `${listing.name} API: pricing, rate limits & how to get a key`;

  return {
    title,
    description: listing.shortDescription,
    keywords: [listing.name, listing.provider.name, "API", ...listing.useCases],
    alternates: { canonical: path },
    openGraph: {
      title,
      description: listing.shortDescription,
      url: path,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: listing.shortDescription,
    },
  };
}

export default async function ApiDetailPage({ params }: PageProps) {
  const { provider, slug } = await params;
  const listing = await getListingDetail(provider, slug);
  if (!listing) notFound();

  // Awaited (not fire-and-forget) — on a serverless runtime an un-awaited
  // write can get cut off once the response is sent. It's one small
  // insert, so the added latency is negligible; failures are swallowed
  // inside recordEngagement so a DB hiccup never breaks the page.
  await recordEngagement(listing.id, "view");

  const domainSlugs = listing.domains.map((d) => d.domain.slug);
  const alternatives = await getAlternatives(listing, domainSlugs, 3);

  // providerListingCount isn't cheap to compute for a single listing without
  // an extra query — a small, honest one is worth it here since this score
  // is the one shown most prominently (vs. the card-grid fallback of 1).
  const score = computeScore(listing, 1);
  const goodToKnow = getGoodToKnow(listing);
  const considerAlternativesIf = getConsiderAlternativesIf(listing);
  const confidence = getDataConfidence(listing);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebAPI",
    name: listing.name,
    description: listing.shortDescription,
    url: `${SITE_URL}/api/${provider}/${slug}`,
    documentation: listing.docsUrl,
    provider: {
      "@type": "Organization",
      name: listing.provider.name,
      url: listing.provider.website,
    },
    keywords: listing.useCases.join(", "),
  };

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-2 flex flex-wrap gap-1.5">
        {listing.domains.map(({ domain }) => (
          <Link
            key={domain.id}
            href={`/domain/${domain.slug}`}
            className="rounded border border-border px-1.5 py-0.5 text-[11px] text-fg-muted hover:border-border-strong hover:text-fg"
          >
            {domain.name}
          </Link>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <ProviderMark name={listing.provider.name} logoUrl={listing.provider.logoUrl} size={48} />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-fg">{listing.name}</h1>
            <Link href={`/provider/${listing.provider.slug}`} className="text-sm text-fg-subtle hover:text-fg hover:underline">
              {listing.provider.name}
            </Link>
            <p className="mt-1 text-sm text-fg-muted">{listing.shortDescription}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <FreshnessIndicator date={listing.lastVerifiedAt} status={listing.status} />
              <span className="text-fg-subtle">·</span>
              <ScoreBadge overall={score.overall} />
              <span className="text-fg-subtle">·</span>
              <CopyButton value={`${SITE_URL}/api/${provider}/${slug}`} />
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <AddToCompareButton
            item={{ id: listing.id, slug: listing.slug, name: listing.name, providerName: listing.provider.name }}
          />
          <TrackedLink
            href={listing.signupUrl}
            apiListingId={listing.id}
            type="key_click"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
          >
            Get API Key
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </TrackedLink>
          <TrackedLink
            href={listing.docsUrl}
            apiListingId={listing.id}
            type="docs_click"
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
          >
            Documentation
            <ExternalLinkIcon />
          </TrackedLink>
        </div>
      </div>

      {/* Quick facts */}
      <section className="mt-8 grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border border-border bg-bg-elevated p-4 sm:grid-cols-4">
        <QuickFact label="Pricing" value={pricingModelLabel(listing.pricingModel)} />
        <QuickFact label="Free tier" value={listing.freeTierAvailable ? "Yes" : "No"} />
        <QuickFact label="Auth" value={authMethodLabel(listing.authMethod)} />
        <QuickFact label="Status" value={listing.status === "active" ? "Operational" : "Needs review"} />
      </section>

      {(listing.useCases.length > 0 || goodToKnow.length > 0 || considerAlternativesIf.length > 0) && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-medium text-fg">Best for</h2>
          <BestForSection
            bestFor={listing.useCases}
            goodToKnow={goodToKnow}
            considerAlternativesIf={considerAlternativesIf}
          />
        </section>
      )}

      {listing.howToGetKey.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-medium text-fg">How to get your key</h2>
          <ol className="flex flex-col gap-2.5">
            {listing.howToGetKey.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-fg-muted">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bg-elevated text-[11px] font-medium text-fg-subtle">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-medium text-fg">Pricing</h2>
        <PricingTable
          pricingModel={listing.pricingModel}
          pricingSummary={listing.pricingSummary}
          freeTierAvailable={listing.freeTierAvailable}
          freeTierDetails={listing.freeTierDetails}
          rateLimits={listing.rateLimits}
        />
      </section>

      {listing.useCases.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-medium text-fg">Use cases</h2>
          <ul className="flex flex-wrap gap-1.5">
            {listing.useCases.map((uc) => (
              <li key={uc}>
                <Link
                  href={`/search?q=${encodeURIComponent(uc)}`}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
                >
                  {uc}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-medium text-fg">Developer support</h2>
        <DeveloperSupport
          supportedLanguages={listing.supportedLanguages}
          restSupport={listing.restSupport}
          graphqlSupport={listing.graphqlSupport}
          webhookSupport={listing.webhookSupport}
          websocketSupport={listing.websocketSupport}
        />
      </section>

      {alternatives.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-medium text-fg">Alternatives</h2>
          <AlternativesSection alternatives={alternatives} />
        </section>
      )}

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ScoreBreakdown score={score} />
        <DataConfidence confidence={confidence} lastVerifiedAt={listing.lastVerifiedAt} />
      </section>

      <div className="mt-10 border-t border-border pt-4">
        <ReportOutdatedButton apiListingId={listing.id} />
      </div>
    </main>
  );
}

function QuickFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-fg-subtle">{label}</p>
      <p className="mt-0.5 text-sm text-fg">{value}</p>
    </div>
  );
}
