import fs from "node:fs";
import path from "node:path";

import { samples } from "@/data/samples";
import { languageList } from "@/data/languages";

/**
 * Server-only: reconstruct a clean Markdown rendering of a docs page from its
 * source `.mdx`, for the "Copy as Markdown" button and the `/md/*` raw
 * endpoints (LLM- and tool-friendly).
 *
 * The transform strips frontmatter/imports, expands `<LangCode id="…" />` into
 * real fenced code blocks (all three languages, pulled from data/samples), and
 * unwraps the doc-only JSX wrappers so the output is portable Markdown.
 */

const DOCS_DIR = path.join(process.cwd(), "content", "docs");
const FENCE: Record<string, string> = { py: "python", js: "ts", rs: "rust" };

function resolveFile(slug: string[]): string | null {
  const base = slug.length ? slug.join("/") : "index";
  const candidates = [
    path.join(DOCS_DIR, `${base}.mdx`),
    path.join(DOCS_DIR, base, "index.mdx"),
  ];
  return candidates.find((p) => fs.existsSync(p)) ?? null;
}

function expandLangCode(id: string): string {
  const sample = samples[id];
  if (!sample) return "";
  return languageList
    .map((l) => {
      const snip = sample[l.id];
      if (!snip) return "";
      return `\`\`\`${FENCE[l.id] ?? l.id}\n${snip.code.trim()}\n\`\`\``;
    })
    .filter(Boolean)
    .join("\n\n");
}

export function getDocMarkdown(
  slug: string[] | undefined,
  meta: { title: string; description?: string }
): string | null {
  const file = resolveFile(slug ?? []);
  if (!file) return null;

  let raw = fs.readFileSync(file, "utf8");

  raw = raw
    // frontmatter
    .replace(/^---\n[\s\S]*?\n---\n/, "")
    // import lines
    .replace(/^import .*$/gm, "")
    // <LangCode id="x" /> -> real fenced code blocks
    .replace(/<LangCode\s+id="([^"]+)"\s*\/>/g, (_m, id: string) =>
      expandLangCode(id)
    )
    // <Card title="X" href="Y" description="Z" /> -> a markdown link
    .replace(/<Card\s+([^>]*?)\/>/g, (_m, attrs: string) => {
      const title = /title="([^"]*)"/.exec(attrs)?.[1] ?? "";
      const href = /href="([^"]*)"/.exec(attrs)?.[1] ?? "";
      const desc = /description="([^"]*)"/.exec(attrs)?.[1] ?? "";
      return `- [${title}](${href})${desc ? ` — ${desc}` : ""}`;
    })
    // unwrap doc-only JSX containers, keep their inner text
    .replace(/<\/?(Cards|Callout|Tabs|Tab|Steps|Step|Accordion|Accordions)\b[^>]*>/g, "")
    // collapse the blank lines those removals leave behind
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const header = `# ${meta.title}\n\n${meta.description ? `${meta.description}\n\n` : ""}`;
  return `${header}${raw}\n`;
}
