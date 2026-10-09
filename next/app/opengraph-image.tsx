import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.roles.join(" & ")}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        color: "#eceeff",
        background:
          "radial-gradient(circle at 75% 40%, rgba(139,92,255,0.55), transparent 45%), radial-gradient(circle at 70% 45%, rgba(62,240,255,0.45), transparent 30%), #030309",
        fontFamily: "monospace",
      }}
    >
      <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#3ef0ff" }}>
        SOFTWARE ENGINEER
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{ fontSize: 140, fontWeight: 800, lineHeight: 0.9, letterSpacing: -4 }}
        >
          SIVA
        </div>
        <div
          style={{ fontSize: 140, fontWeight: 800, lineHeight: 0.9, letterSpacing: -4 }}
        >
          SUNDAR
        </div>
        <div style={{ marginTop: 32, fontSize: 28, letterSpacing: 6, opacity: 0.75 }}>
          {site.roles.join("  /  ").toUpperCase()}
        </div>
      </div>
    </div>,
    size,
  );
}
