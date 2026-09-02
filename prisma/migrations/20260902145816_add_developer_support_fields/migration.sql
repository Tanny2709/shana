-- AlterTable
ALTER TABLE "api_listings" ADD COLUMN     "graphql_support" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "official_sdks" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "rest_support" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "supported_languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "webhook_support" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "websocket_support" BOOLEAN NOT NULL DEFAULT false;
