import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const alt = "REZZUM RSS-to-social media automation platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#f7f9fb",
          color: "#111827",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "64px",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(17, 24, 39, 0.1)",
            borderRadius: "32px",
            boxShadow: "0 28px 80px rgba(0, 83, 218, 0.12)",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            height: "100%",
            justifyContent: "space-between",
            padding: "56px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                alignItems: "center",
                background: "#0053da",
                borderRadius: "24px",
                color: "#ffffff",
                display: "flex",
                fontSize: "44px",
                fontWeight: 800,
                height: "96px",
                justifyContent: "center",
                width: "96px",
              }}
            >
              R
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ fontSize: "42px", fontWeight: 800 }}>{siteConfig.name}</div>
              <div
                style={{
                  color: "#6b7280",
                  fontSize: "22px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                RSS to social
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "28px",
              maxWidth: "940px",
            }}
          >
            <div
              style={{
                fontSize: "74px",
                fontWeight: 800,
                lineHeight: 0.98,
              }}
            >
              Turn RSS content into client-ready social campaigns.
            </div>
            <div
              style={{
                color: "#4b5563",
                fontSize: "32px",
                lineHeight: 1.35,
              }}
            >
              AI-assisted drafts, human review, scheduling, and publishing for Facebook,
              LinkedIn, and X.
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
