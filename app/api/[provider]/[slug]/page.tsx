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
  // write can get cut off once the response is sent. Neither call depends
  // on the other's result, so they run in parallel rather than adding a
  // full extra round-trip in series.
  const domainSlugs = listing.domains.map((d) => d.domain.slug);
  const [, alternatives] = await Promise.all([
    recordEngagement(listing.id, "view"),
    getAlternatives(listing, domainSlugs, 3),
  ]);

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
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
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

      {/* Score + quick facts + data confidence sit in a sticky sidebar on
          desktop (via lg:order) so the most decision-relevant info stays
          visible without scrolling. On mobile there's no sidebar to pin, so
          this block comes first in source order instead — score still
          shows right after the header, not buried at the bottom. */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <aside className="flex flex-col gap-4 lg:order-2 lg:sticky lg:top-20 lg:h-fit">
          <ScoreBreakdown score={score} />

          <div className="rounded-lg border border-border bg-bg-elevated p-4">
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-fg-subtle">Quick facts</h2>
            <div className="flex flex-col gap-3">
              <QuickFact icon="pricing" label="Pricing" value={pricingModelLabel(listing.pricingModel)} />
              <QuickFact icon="freeTier" label="Free tier" value={listing.freeTierAvailable ? "Yes" : "No"} />
              <QuickFact icon="auth" label="Auth" value={authMethodLabel(listing.authMethod)} />
              <QuickFact
                icon="status"
                label="Status"
                value={listing.status === "active" ? "Operational" : "Needs review"}
              />
            </div>
          </div>

          <DataConfidence confidence={confidence} lastVerifiedAt={listing.lastVerifiedAt} />
        </aside>

        <div className="flex flex-col gap-8 lg:order-1">
          {(listing.useCases.length > 0 || goodToKnow.length > 0 || considerAlternativesIf.length > 0) && (
            <section>
              <h2 className="mb-3 text-sm font-medium text-fg">Best for</h2>
              <BestForSection
                bestFor={listing.useCases}
                goodToKnow={goodToKnow}
                considerAlternativesIf={considerAlternativesIf}
              />
            </section>
          )}

          {listing.howToGetKey.length > 0 && (
            <section>
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

          <section>
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
            <section>
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

          <section>
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
            <section>
              <h2 className="mb-3 text-sm font-medium text-fg">Alternatives</h2>
              <AlternativesSection alternatives={alternatives} />
            </section>
          )}
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-4">
        <ReportOutdatedButton apiListingId={listing.id} />
      </div>
    </main>
  );
}

const QUICK_FACT_ICONS = {
  pricing: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5a2 2 0 0 0-2-1.5h-1a2 2 0 0 0 0 4h1a2 2 0 0 1 0 4h-1a2 2 0 0 1-2-1.5M12 6v1.5M12 16.5V18" />
    </svg>
  ),
  freeTier: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="9" width="18" height="11" rx="1" />
      <path d="M12 9v11M3 13h18M12 9C10 6 7 5 7 7c0 1.2 1.5 2 5 2ZM12 9c2-3 5-4 5-2 0 1.2-1.5 2-5 2Z" />
    </svg>
  ),
  auth: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="15" r="4" />
      <path d="m10.5 12.5 8-8M16 7l2 2M19 4l2 2" />
    </svg>
  ),
  status: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l2-7 4 14 2-7h6" />
    </svg>
  ),
} as const;

function QuickFact({
  icon,
  label,
  value,
}: {
  icon: keyof typeof QUICK_FACT_ICONS;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border text-fg-subtle">
        {QUICK_FACT_ICONS[icon]}
      </span>
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wide text-fg-subtle">{label}</p>
        <p className="text-sm text-fg">{value}</p>
      </div>
    </div>
  );
}
