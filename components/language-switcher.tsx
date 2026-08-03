"use client";

import { languageList } from "@/data/languages";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-context";

/** Segmented control that sets the global SDK language (py / js / rs). */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="SDK language"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-border bg-surface p-0.5",
        className
      )}
    >
      {languageList.map((l) => (
        <button
          key={l.id}
          type="button"
          aria-pressed={lang === l.id}
          onClick={() => setLang(l.id)}
          className={cn(
            "rounded-md px-2.5 py-1 font-mono text-xs transition-colors",
            lang === l.id
              ? "bg-surface-2 text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
