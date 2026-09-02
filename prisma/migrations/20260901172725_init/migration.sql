-- CreateEnum
CREATE TYPE "PricingModel" AS ENUM ('free', 'freemium', 'pay_as_you_go', 'subscription', 'credit_based');

-- CreateEnum
CREATE TYPE "AuthMethod" AS ENUM ('api_key', 'oauth', 'both', 'none');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('active', 'deprecated', 'needs_review');

-- CreateEnum
CREATE TYPE "ContributionType" AS ENUM ('new_listing', 'edit', 'report');

-- CreateEnum
CREATE TYPE "ContributionStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "providers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo_url" TEXT,
    "website" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_listings" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "use_cases" TEXT[],
    "docs_url" TEXT NOT NULL,
    "signup_url" TEXT NOT NULL,
    "auth_method" "AuthMethod" NOT NULL,
    "free_tier_available" BOOLEAN NOT NULL DEFAULT false,
    "free_tier_details" TEXT,
    "pricing_model" "PricingModel" NOT NULL,
    "pricing_summary" TEXT NOT NULL,
    "rate_limits" TEXT,
    "how_to_get_key" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "last_verified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ListingStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domains" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_listing_domains" (
    "api_listing_id" TEXT NOT NULL,
    "domain_id" TEXT NOT NULL,

    CONSTRAINT "api_listing_domains_pkey" PRIMARY KEY ("api_listing_id","domain_id")
);

-- CreateTable
CREATE TABLE "contributions" (
    "id" TEXT NOT NULL,
    "type" "ContributionType" NOT NULL,
    "api_listing_id" TEXT,
    "payload" JSONB NOT NULL,
    "submitter_name" TEXT,
    "submitter_email" TEXT,
    "notes" TEXT,
    "status" "ContributionStatus" NOT NULL DEFAULT 'pending',
    "review_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contributions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "providers_slug_key" ON "providers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "api_listings_slug_key" ON "api_listings"("slug");

-- CreateIndex
CREATE INDEX "api_listings_provider_id_idx" ON "api_listings"("provider_id");

-- CreateIndex
CREATE INDEX "api_listings_status_idx" ON "api_listings"("status");

-- CreateIndex
CREATE UNIQUE INDEX "domains_slug_key" ON "domains"("slug");

-- CreateIndex
CREATE INDEX "contributions_status_idx" ON "contributions"("status");

-- AddForeignKey
ALTER TABLE "api_listings" ADD CONSTRAINT "api_listings_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_listing_domains" ADD CONSTRAINT "api_listing_domains_api_listing_id_fkey" FOREIGN KEY ("api_listing_id") REFERENCES "api_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_listing_domains" ADD CONSTRAINT "api_listing_domains_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_api_listing_id_fkey" FOREIGN KEY ("api_listing_id") REFERENCES "api_listings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
