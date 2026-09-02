-- Enable trigram similarity (typo-tolerant / substring matching) used by
-- the search query in lib/data.ts.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Trigram indexes for fuzzy matching on listing and provider names.
CREATE INDEX IF NOT EXISTS api_listings_name_trgm_idx
  ON "api_listings" USING GIN ("name" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS providers_name_trgm_idx
  ON "providers" USING GIN ("name" gin_trgm_ops);

-- No persisted index for the full-text ranking query in lib/data.ts — at
-- directory scale (dozens to low hundreds of listings) an unindexed
-- to_tsvector() scan is effectively free, and it sidesteps Postgres's
-- IMMUTABLE-function requirements for indexing a multi-column expression.
-- Worth revisiting with a generated tsvector column if the catalog grows large.
