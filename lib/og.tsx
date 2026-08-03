export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Shared Open Graph card (1200×630) for per-page social images. Rendered by
 * `next/og` (satori) — inline styles only, default embedded font (no external
 * fetch, hermetic build). Mirrors the site's dark + molten-orange identity and
 * the stacked-chunk logo.
 */
export function OgCard({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  const sub =
    subtitle && subtitle.length > 130 ? `${subtitle.slice(0, 127)}…` : subtitle;

  return (
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
      {/* logo + wordmark */}
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ width: 96, height: 18, borderRadius: 6, background: "#e8511e" }} />
          <div style={{ width: 64, height: 18, borderRadius: 6, background: "#ff7a3c", opacity: 0.8 }} />
          <div style={{ width: 80, height: 18, borderRadius: 6, background: "#ff7a3c", opacity: 0.6 }} />
          <div style={{ width: 48, height: 18, borderRadius: 6, background: "#ff7a3c", opacity: 0.4 }} />
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#a1a1aa", marginLeft: 8 }}>
          chunk-engine
        </div>
      </div>

      {eyebrow ? (
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 26,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#e8511e",
          }}
        >
          {eyebrow}
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          marginTop: eyebrow ? 16 : 44,
          fontSize: 68,
          fontWeight: 700,
          lineHeight: 1.05,
        }}
      >
        {title}
      </div>

      {sub ? (
        <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#a1a1aa", lineHeight: 1.3 }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
}
