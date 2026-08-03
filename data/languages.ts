/**
 * The three chunk-engine SDKs. All wrap the same Rust engine (rs-chunks) and
 * produce byte-identical chunks; only the install command and API dialect
 * differ. Derived from each package's README / manifest.
 */
import type { CodeLang } from "@/lib/highlighter";

export type LangId = "py" | "js" | "rs";

export interface Language {
  id: LangId;
  label: string; // full name
  short: string; // compact tab label
  pkg: string; // published package name
  install: string; // install command
  registry: string; // registry display name
  registryUrl: string;
  github: string;
  shiki: CodeLang; // highlighter language
  binding: string; // one-line "how it works"
}

export const languages: Record<LangId, Language> = {
  py: {
    id: "py",
    label: "Python",
    short: "Python",
    pkg: "py-chunks",
    install: "pip install py-chunks",
    registry: "PyPI",
    registryUrl: "https://pypi.org/project/py-chunks/",
    github: "https://github.com/RanjanKudesia/py-chunks",
    shiki: "python",
    binding: "Native extension via PyO3.",
  },
  js: {
    id: "js",
    label: "JavaScript",
    short: "JavaScript",
    pkg: "js-chunks",
    install: "npm install js-chunks",
    registry: "npm",
    registryUrl: "https://www.npmjs.com/package/js-chunks",
    github: "https://github.com/RanjanKudesia/js-chunks",
    shiki: "typescript",
    binding: "WASM core — Node, Bun, Deno, and browsers.",
  },
  rs: {
    id: "rs",
    label: "Rust",
    short: "Rust",
    pkg: "rs-chunks",
    install: "cargo add rs-chunks",
    registry: "crates.io",
    registryUrl: "https://crates.io/crates/rs-chunks",
    github: "https://github.com/RanjanKudesia/rs-chunks",
    shiki: "rust",
    binding: "The reference engine — pure Rust.",
  },
};

export const languageList: Language[] = [
  languages.py,
  languages.js,
  languages.rs,
];

export const DEFAULT_LANG: LangId = "py";
