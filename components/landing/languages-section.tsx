import { Check } from "lucide-react";

import { languageList } from "@/data/languages";
import { GitHubIcon } from "@/components/icons";
import { InstallTabs } from "@/components/install-tabs";

// Parity facts — the three baselines in the workspace STATUS.md, each with a
// harness that reproduces it. Chunk parity is rs<->py (rs-chunks README
// "Parity", re-verified 2026-08-08); the image and PDF rows are js<->py, where
// the single difference in each is the same known one: rendering a page needs
// a rasteriser and there is no PDFium in wasm.
const parityFacts = [
  "3,222 / 3,222 chunk comparisons byte-identical (100%)",
  "374 / 375 image-extraction fixtures identical",
  "23 / 24 PDF fixtures identical (chunks + markdown + images)",
];

export function LanguagesSection() {
  return (
    <div className="space-y-10">
      <div className="grid gap-4 md:grid-cols-3">
        {languageList.map((l) => (
          <div
            key={l.id}
            className="flex flex-col rounded-xl border border-border bg-surface p-6"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-semibold">{l.pkg}</span>
              <a
                href={l.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`${l.pkg} on GitHub`}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <GitHubIcon className="size-4" />
              </a>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{l.binding}</p>
            <div className="mt-4 rounded-lg bg-surface-2 px-3 py-2 font-mono text-xs text-foreground/90">
              <span className="select-none text-brand">$ </span>
              {l.install}
            </div>
            <a
              href={l.registryUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 font-mono text-xs text-muted-foreground transition-colors hover:text-brand"
            >
              {l.registry} ↗
            </a>
          </div>
        ))}
      </div>

      {/* Parity highlight */}
      <div className="rounded-2xl border border-brand/30 bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold">Byte-identical, verified</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              All three SDKs wrap the same Rust engine, so they emit exactly the
              same chunks. Parity is checked over every fixture × every mode, by
              harnesses you can run yourself — and the one remaining difference
              is a scanned PDF that WASM cannot rasterise.
            </p>
            <div className="mt-4">
              <InstallTabs />
            </div>
          </div>
          <ul className="space-y-2">
            {parityFacts.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 font-mono text-sm text-foreground/90"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
