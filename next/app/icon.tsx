import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 32,
        background:
          "radial-gradient(circle at 35% 30%, #ffffff, #3ef0ff 30%, #8b5cff 75%)",
        color: "#030309",
        fontSize: 26,
        fontWeight: 900,
        letterSpacing: -1,
      }}
    >
      SS
    </div>,
    size,
  );
}
