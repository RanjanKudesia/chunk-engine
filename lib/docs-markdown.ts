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
 * raw source is transformed on demand:
 *
 *  - frontmatter and `import` lines stripped;
 *  - `<LangCode id="…" />` expanded into real fenced code blocks (every
 *    language the sample defines, from data/samples);
 *  - `<LangOnly id="py">…</LangOnly>` **flattened, not filtered** — the browser
 *    shows one language, the mirror shows all of them behind a bold
 *    **Python** / **JavaScript** / **Rust** label, because an LLM reading
 *    `/md/*` wants the whole page, not one reader's preference;
 *  - `<InstallTabs />` expanded into all three install commands, labelled and
 *    generated from data/languages.ts — a reader who fetched `/md/installation`
 *    came for exactly those commands;
 *  - `<LangSelect />` dropped (it is a UI control, meaningless as text);
 *  - `<Mermaid chart={`…`} />` turned back into a ```mermaid fence — the only
 *    form a downstream tool can consume. Hand-written ```mermaid fences are
 *    left alone (fences are never rewritten here);
 *  - remaining doc-only JSX wrappers unwrapped.
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

const TICKS = "```";

function expandLangCode(id: string): string {
  const sample = samples[id];
  if (!sample) return "";
  return languageList
    .map((l) => {
      const snip = sample[l.id];
      if (!snip) return "";
      return `${TICKS}${FENCE[l.id] ?? l.id}\n${snip.code.trim()}\n${TICKS}`;
    })
    .filter(Boolean)
    .join("\n\n");
}

/**
 * `<InstallTabs />` is a switcher over one command per SDK. Stripping it would
 * lose the commands entirely — and an LLM reading `/md/installation` is very
 * likely there *for* the commands — so expand it into all three, labelled and
 * generated from `data/languages.ts` so it can never drift from the UI.
 */
function expandInstallTabs(): string {
  return languageList
    .map((l) => `- **${l.label}** (${l.registry}): \`${l.install}\``)
    .join("\n");
}

/** `id="py, js"` -> "**Python** / **JavaScript**" (unknown ids dropped). */
function langOnlyLabel(id: string): string {
  const labels = id
    .split(/[\s,|]+/)
    .map((v) => languageList.find((l) => l.id === v)?.label)
    .filter(Boolean);
  return labels.length ? `**${labels.join("** / **")}**` : "";
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
    // <Mermaid chart={`…`} /> -> a ```mermaid fence (hand-written fences are
    // already text and are never touched here)
    .replace(
      /<Mermaid\b[^>]*?chart=\{`([\s\S]*?)`\}[^>]*?\/>/g,
      (_m, chart: string) => `${TICKS}mermaid\n${chart.trim()}\n${TICKS}`
    )
    // <InstallTabs /> -> the three real install commands (see above)
    .replace(/<InstallTabs\b[^>]*\/>/g, () => expandInstallTabs())
    // <LangSelect /> is a UI control — drop it
    .replace(/<LangSelect\s*\/>/g, "")
    // <LangOnly id="py"> … </LangOnly> -> keep EVERY branch, labelled. The
    // page shows one language; the mirror is for readers who want all three.
    .replace(
      /<LangOnly\s+id="([^"]+)"\s*>/g,
      (_m, id: string) => `\n${langOnlyLabel(id)}\n`
    )
    .replace(/<\/LangOnly>/g, "\n")
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
