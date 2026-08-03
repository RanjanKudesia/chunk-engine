import {
  createHighlighterCore,
  type HighlighterCore,
} from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";

/**
 * Cached Shiki highlighter. We load only the langs/themes the site actually
 * uses to keep the bundle lean (the library's whole pitch is "zero bloat").
 * Dual-theme output emits CSS vars we flip via the `.dark` class.
 */
let highlighterPromise: Promise<HighlighterCore> | null = null;

export const CODE_THEMES = {
  light: "github-light",
  dark: "github-dark",
} as const;

export function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [
        import("shiki/themes/github-light.mjs"),
        import("shiki/themes/github-dark.mjs"),
      ],
      langs: [
        import("shiki/langs/python.mjs"),
        import("shiki/langs/bash.mjs"),
        import("shiki/langs/json.mjs"),
        import("shiki/langs/typescript.mjs"),
        import("shiki/langs/tsx.mjs"),
        import("shiki/langs/rust.mjs"),
      ],
      engine: createOnigurumaEngine(import("shiki/wasm")),
    });
  }
  return highlighterPromise;
}

export type CodeLang =
  | "python"
  | "bash"
  | "json"
  | "typescript"
  | "tsx"
  | "rust";

/** Highlight code to dual-theme HTML (light default, dark via `.dark` CSS). */
export async function highlight(code: string, lang: CodeLang): Promise<string> {
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang,
    themes: CODE_THEMES,
    defaultColor: "light",
  });
}
