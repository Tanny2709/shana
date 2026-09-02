import { ImageResponse } from "next/og";
import { getListingDetail } from "@/lib/data";
import { pricingModelLabel } from "@/lib/format";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ provider: string; slug: string }>;
}) {
  const { provider, slug } = await params;
  const listing = await getListingDetail(provider, slug);

  const name = listing?.name ?? "API";
  const providerName = listing?.provider.name ?? "";
  const description = listing?.shortDescription ?? "";
  const pricing = listing ? pricingModelLabel(listing.pricingModel) : "";
  const initial = providerName.trim().charAt(0).toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              border: "2px solid rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              color: "#a1a1aa",
            }}
          >
            {initial}
          </div>
          <div style={{ fontSize: 28, color: "#a1a1aa", display: "flex" }}>{providerName}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 700, color: "#f4f4f5", lineHeight: 1.1, display: "flex" }}>
            {name}
          </div>
          <div style={{ fontSize: 28, color: "#a1a1aa", display: "flex", maxWidth: 900 }}>
            {description}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {pricing && (
            <div
              style={{
                display: "flex",
                fontSize: 22,
                color: "#a1a1aa",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 9999,
                padding: "8px 20px",
              }}
            >
              {pricing}
            </div>
          )}
          <div style={{ display: "flex", fontSize: 22, color: "#71717a" }}>
            API Reference Directory
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
