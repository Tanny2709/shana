-- CreateIndex
CREATE INDEX "api_listing_domains_domain_id_idx" ON "api_listing_domains"("domain_id");

-- CreateIndex
CREATE INDEX "api_listings_status_created_at_idx" ON "api_listings"("status", "created_at");

-- CreateIndex
CREATE INDEX "api_listings_status_last_verified_at_idx" ON "api_listings"("status", "last_verified_at");
