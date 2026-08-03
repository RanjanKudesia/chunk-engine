"use client";

import * as React from "react";

import { languageList, type LangId } from "@/data/languages";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/copy-button";
import { useLanguage } from "@/components/language-context";

export interface LangItem {
  id: LangId;
  filename?: string;
  code: string;
  html: string; // Shiki-highlighted, pre-rendered on the server
}

/**
 * Renders a code window whose language follows the global switcher. All three
 * languages are pre-highlighted on the server; we show the active one. A local
 * tab row lets you switch here too (which updates the global preference).
 */
export function LangSwitchView({ items }: { items: LangItem[] }) {
  const { lang, setLang } = useLanguage();
  const byId = React.useMemo(
    () => Object.fromEntries(items.map((i) => [i.id, i])),
    [items]
  );
  const active = byId[lang] ?? items[0];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border pl-2 pr-2">
        <div role="group" aria-label="Code language" className="flex">
          {languageList
            .filter((l) => byId[l.id])
            .map((l) => (
              <button
                key={l.id}
                type="button"
                aria-pressed={active.id === l.id}
                onClick={() => setLang(l.id)}
                className={cn(
                  "border-b-2 px-3 py-2 font-mono text-xs transition-colors",
                  active.id === l.id
                    ? "border-brand text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {l.short}
              </button>
            ))}
        </div>
        <div className="flex items-center gap-2">
          {active.filename ? (
            <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
              {active.filename}
            </span>
          ) : null}
          <CopyButton value={active.code} />
        </div>
      </div>

      <div
        className="shiki-block overflow-x-auto p-4 text-[13px] leading-relaxed [&_pre]:!bg-transparent [&_pre]:!outline-none"
        // Shiki output is generated at build time from our own strings.
        dangerouslySetInnerHTML={{ __html: active.html }}
      />
    </div>
  );
}
