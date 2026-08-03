"use client";

import { languageList } from "@/data/languages";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/copy-button";
import { useLanguage } from "@/components/language-context";

/** Install command that follows the global language (pip / npm / cargo). */
export function InstallTabs({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  const active = languageList.find((l) => l.id === lang) ?? languageList[0];

  return (
    <div
      className={cn(
        "inline-flex flex-col overflow-hidden rounded-lg border border-border bg-surface",
        className
      )}
    >
      <div role="group" aria-label="Install command language" className="flex border-b border-border">
        {languageList.map((l) => (
          <button
            key={l.id}
            type="button"
            aria-pressed={active.id === l.id}
            onClick={() => setLang(l.id)}
            className={cn(
              "flex-1 px-4 py-1.5 font-mono text-xs transition-colors",
              active.id === l.id
                ? "bg-surface-2 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {l.short}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 py-2 pl-4 pr-2 font-mono text-sm">
        <code className="flex items-center gap-2 whitespace-nowrap">
          <span aria-hidden className="select-none text-brand">
            $
          </span>
          <span className="text-foreground">{active.install}</span>
        </code>
        <CopyButton value={active.install} label="Copy install command" />
      </div>
    </div>
  );
}
