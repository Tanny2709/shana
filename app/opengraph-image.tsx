import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
          background: "#0a0a0b",
          padding: "96px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 68, fontWeight: 700, color: "#f4f4f5", lineHeight: 1.15, display: "flex" }}>
          {SITE_NAME}
        </div>
        <div style={{ fontSize: 30, color: "#a1a1aa", display: "flex", maxWidth: 920 }}>
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size },
  );
}
