-- CreateEnum
CREATE TYPE "EngagementType" AS ENUM ('view', 'key_click', 'docs_click', 'compare_add');

-- CreateTable
CREATE TABLE "engagement_events" (
    "id" TEXT NOT NULL,
    "api_listing_id" TEXT NOT NULL,
    "type" "EngagementType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "engagement_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "engagement_events_api_listing_id_type_idx" ON "engagement_events"("api_listing_id", "type");

-- CreateIndex
CREATE INDEX "engagement_events_type_created_at_idx" ON "engagement_events"("type", "created_at");

-- AddForeignKey
ALTER TABLE "engagement_events" ADD CONSTRAINT "engagement_events_api_listing_id_fkey" FOREIGN KEY ("api_listing_id") REFERENCES "api_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
