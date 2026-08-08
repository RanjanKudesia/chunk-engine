"use client";

import { languages } from "@/data/languages";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";

/**
 * The global SDK switcher, in the flow of a docs page.
 *
 * Same state as the header control and `<LangCode>` (see
 * `components/language-context.tsx`), so a page can open with an explicit
 * "here is the knob" instead of relying on the reader spotting it in the
 * header. Put it near the top of any page whose code *and* prose are
 * language-scoped.
 */
export function LangSelect({ className }: { className?: string }) {
  const { lang } = useLanguage();
  const active = languages[lang];

  return (
    <div
      className={cn(
        "not-prose my-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-border bg-surface px-4 py-3",
        className
      )}
    >
      <span className="text-sm text-muted-foreground">
        Showing examples for{" "}
        <strong className="font-medium text-foreground">{active.label}</strong>
      </span>
      <LanguageSwitcher />
      <span className="text-xs text-muted-foreground">
        — your choice follows you across the docs.
      </span>
    </div>
  );
}
