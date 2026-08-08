"use client";

import dynamic from "next/dynamic";

/**
 * Mermaid diagrams in MDX: `<Mermaid chart={`graph LR; A --> B`} />`.
 *
 * ## Why an explicit component and not a ```mermaid fence
 *
 * Fumadocs highlights every fence with Shiki at *build* time, in a rehype pass:
 * by the time a `pre` override could see the node, the diagram source has
 * already been shredded into `<span>` token elements, and reassembling it means
 * walking the highlighted tree and hoping the token text round-trips. The
 * alternative — a custom remark plugin in `source.config.ts` that rewrites
 * `mermaid` fences into MDX element nodes before the highlighter runs — works,
 * but it is a build-pipeline change that every future contributor has to know
 * about, for the sake of three characters of authoring syntax.
 *
 * An explicit component costs nothing at build time, keeps the source string
 * intact, and is what `lib/docs-markdown.ts` reverses back into a real
 * ```mermaid fence for the `/md/*` mirror — so LLM consumers still get fenced
 * mermaid, which is the only form they can use.
 *
 * ## Why the dynamic import
 *
 * `mermaid` is ~1MB of parser and layout engine and touches `document` on load.
 * `ssr: false` keeps it out of the server bundle and out of every docs page
 * that has no diagram — only a page that actually renders a `<Mermaid>` pays
 * for it. (`ssr: false` is only legal inside a Client Component, hence the
 * "use client" here.)
 */
const MermaidRender = dynamic(
  () => import("@/components/mermaid-render").then((m) => m.MermaidRender),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden
        className="my-6 h-40 animate-pulse rounded-xl border border-border bg-surface"
      />
    ),
  }
);

export function Mermaid({ chart, title }: { chart: string; title?: string }) {
  return <MermaidRender chart={chart} title={title} />;
}
