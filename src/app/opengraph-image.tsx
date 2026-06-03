import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Negsai — Soluciones tecnológicas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #050a10 0%, #004b67 50%, #0084a3 100%)",
          color: "#f0f9ff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 8,
            color: "#0097b2",
            marginBottom: 24,
          }}
        >
          NEGSAI
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15, maxWidth: 900 }}>
          Desarrollo de software, IA y automatización
        </div>
        <div style={{ fontSize: 28, marginTop: 32, color: "#94a3b8" }}>
          Ecuador · Latinoamérica · negsai.com
        </div>
      </div>
    ),
    { ...size },
  );
}
