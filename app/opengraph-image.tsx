import { ImageResponse } from "next/og";

export const alt = "chunk-engine — one chunking engine, three languages";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Uses the default embedded font (no external fetch) to keep the build hermetic.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0e0e10",
          color: "#f5f5f4",
        }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ width: 120, height: 22, borderRadius: 7, background: "#e8511e" }} />
            <div style={{ width: 80, height: 22, borderRadius: 7, background: "#ff7a3c", opacity: 0.8 }} />
            <div style={{ width: 100, height: 22, borderRadius: 7, background: "#ff7a3c", opacity: 0.6 }} />
            <div style={{ width: 60, height: 22, borderRadius: 7, background: "#ff7a3c", opacity: 0.4 }} />
          </div>
          <div style={{ fontSize: 40, color: "#a1a1aa", marginLeft: 8 }}>chunk-engine</div>
        </div>
        <div style={{ marginTop: 44, fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>
          One chunking engine.
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, color: "#ff7a3c", lineHeight: 1.05 }}>
          Python, JavaScript, Rust.
        </div>
        <div style={{ marginTop: 40, fontSize: 32, color: "#a1a1aa" }}>
          36 formats · one Rust core · byte-identical output
        </div>
      </div>
    ),
    { ...size }
  );
}
