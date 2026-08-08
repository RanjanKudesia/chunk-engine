"use client";

import * as React from "react";
import { useTheme } from "next-themes";

/**
 * The half of `<Mermaid>` that actually loads mermaid. Split out so
 * `components/mermaid.tsx` can `next/dynamic(..., { ssr: false })` it — see the
 * comment there for why the library is kept off every page without a diagram.
 *
 * Palette comes from the design tokens in `app/globals.css` (mermaid cannot
 * read CSS variables — it inlines colours into the SVG at render time), so the
 * two maps below must be kept in step with those tokens. Dark is the site
 * default; `next-themes` reports the resolved theme and we re-render on change.
 */

type ThemeVars = Record<string, string>;

const DARK: ThemeVars = {
  background: "#161618",
  mainBkg: "#1c1c20",
  primaryColor: "#1c1c20",
  primaryTextColor: "#f5f5f4",
  primaryBorderColor: "#26262b",
  secondaryColor: "#161618",
  tertiaryColor: "#161618",
  secondaryBorderColor: "#26262b",
  tertiaryBorderColor: "#26262b",
  secondaryTextColor: "#f5f5f4",
  tertiaryTextColor: "#f5f5f4",
  lineColor: "#a1a1aa",
  textColor: "#f5f5f4",
  nodeBorder: "#26262b",
  clusterBkg: "#0e0e10",
  clusterBorder: "#26262b",
  titleColor: "#f5f5f4",
  edgeLabelBackground: "#161618",
  labelBoxBkgColor: "#1c1c20",
  labelBoxBorderColor: "#26262b",
  labelTextColor: "#f5f5f4",
  actorBkg: "#1c1c20",
  actorBorder: "#e8511e",
  actorTextColor: "#f5f5f4",
  signalColor: "#a1a1aa",
  signalTextColor: "#f5f5f4",
  noteBkgColor: "#0e0e10",
  noteBorderColor: "#26262b",
  noteTextColor: "#f5f5f4",
};

const LIGHT: ThemeVars = {
  background: "#ffffff",
  mainBkg: "#f3efe8",
  primaryColor: "#f3efe8",
  primaryTextColor: "#1c1917",
  primaryBorderColor: "#e7e2d9",
  secondaryColor: "#ffffff",
  tertiaryColor: "#ffffff",
  secondaryBorderColor: "#e7e2d9",
  tertiaryBorderColor: "#e7e2d9",
  secondaryTextColor: "#1c1917",
  tertiaryTextColor: "#1c1917",
  lineColor: "#78716c",
  textColor: "#1c1917",
  nodeBorder: "#e7e2d9",
  clusterBkg: "#faf8f5",
  clusterBorder: "#e7e2d9",
  titleColor: "#1c1917",
  edgeLabelBackground: "#ffffff",
  labelBoxBkgColor: "#f3efe8",
  labelBoxBorderColor: "#e7e2d9",
  labelTextColor: "#1c1917",
  actorBkg: "#f3efe8",
  actorBorder: "#e8511e",
  actorTextColor: "#1c1917",
  signalColor: "#78716c",
  signalTextColor: "#1c1917",
  noteBkgColor: "#faf8f5",
  noteBorderColor: "#e7e2d9",
  noteTextColor: "#1c1917",
};

let renderSeq = 0;

export function MermaidRender({
  chart,
  title,
}: {
  chart: string;
  title?: string;
}) {
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = React.useState<string | null>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    const isDark = resolvedTheme !== "light"; // dark is the site default

    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          darkMode: isDark,
          themeVariables: {
            ...(isDark ? DARK : LIGHT),
            fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui",
            fontSize: "14px",
          },
          flowchart: { curve: "basis", useMaxWidth: true },
          sequence: { useMaxWidth: true },
        });
        renderSeq += 1;
        const { svg: out } = await mermaid.render(
          `mermaid-${renderSeq}`,
          chart.trim()
        );
        if (!cancelled) {
          setSvg(out);
          setFailed(false);
        }
      } catch {
        if (!cancelled) {
          setSvg(null);
          setFailed(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, resolvedTheme]);

  // Diagram source is authored in this repo, and mermaid runs with
  // securityLevel "strict" (no inline HTML, no click handlers).
  if (svg) {
    return (
      <figure className="not-prose my-6 overflow-x-auto rounded-xl border border-border bg-surface p-4">
        <div
          className="[&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        {title ? (
          <figcaption className="mt-3 text-center text-xs text-muted-foreground">
            {title}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  // Never lose the content: fall back to the diagram source itself.
  return (
    <figure className="not-prose my-6 overflow-x-auto rounded-xl border border-border bg-surface p-4">
      {failed ? (
        <p className="mb-2 text-xs text-muted-foreground">
          Diagram source (could not be rendered here):
        </p>
      ) : null}
      <pre className="overflow-x-auto font-mono text-xs text-muted-foreground">
        {chart.trim()}
      </pre>
      {title ? (
        <figcaption className="mt-3 text-center text-xs text-muted-foreground">
          {title}
        </figcaption>
      ) : null}
    </figure>
  );
}
