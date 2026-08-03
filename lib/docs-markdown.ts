import fs from "node:fs";
import path from "node:path";

import { samples } from "@/data/samples";
import { languageList } from "@/data/languages";

/**
 * Server-only: reconstruct a clean Markdown rendering of a docs page from its
 * source `.mdx`, for the "Copy as Markdown" button and the `/md/*` raw
 * endpoints (LLM- and tool-friendly).
 *
 * The `content/docs` tree is read **once at module load** into a Map (a single
 * fs pass over a fixed subfolder — no per-request dynamic fs), then each page's
 * raw source is transformed on demand: frontmatter/imports stripped,
 * `<LangCode id="…" />` expanded into real fenced code blocks (all three
 * languages, from data/samples), and doc-only JSX wrappers unwrapped.
 */

const DOCS_DIR = path.join(process.cwd(), "content", "docs");
const FENCE: Record<string, string> = { py: "python", js: "ts", rs: "rust" };

/** slug-key ("streaming.mdx", "framework-integration/python.mdx") -> raw mdx. */
const RAW_BY_KEY: Map<string, string> = (() => {
  const map = new Map<string, string>();
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".mdx")) {
        map.set(path.relative(DOCS_DIR, full), fs.readFileSync(full, "utf8"));
      }
    }
  };
  try {
    walk(DOCS_DIR);
  } catch {
    // build environments without the folder — leave the map empty
  }
  return map;
})();

function rawForSlug(slug: string[]): string | null {
  const base = slug.length ? slug.join("/") : "index";
  return RAW_BY_KEY.get(`${base}.mdx`) ?? RAW_BY_KEY.get(`${base}/index.mdx`) ?? null;
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
  const raw = rawForSlug(slug ?? []);
  if (raw == null) return null;

  const body = raw
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
  return `${header}${body}\n`;
}
