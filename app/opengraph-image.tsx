import { ImageResponse } from "next/og";

export const alt = "GMD Fences — custom fences, gates and automation in the USA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #060C17 0%, #0D1520 45%, #152035 100%)",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 76,
            fontWeight: 900,
            letterSpacing: -3,
            color: "#ffffff",
          }}
        >
          GMD <span style={{ color: "#F4C430", marginLeft: 12 }}>Fences</span>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "rgba(255,255,255,0.78)",
            maxWidth: 920,
            lineHeight: 1.35,
          }}
        >
          Custom fences, gates and automation for residential and commercial projects in the USA
        </div>
        <div style={{ marginTop: 36, fontSize: 22, color: "rgba(244,196,48,0.95)" }}>gmdfences.com</div>
      </div>
    ),
    { ...size },
  );
}
