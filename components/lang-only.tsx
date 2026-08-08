"use client";

import * as React from "react";

import { languageList, type LangId } from "@/data/languages";
import { useLanguage } from "@/components/language-context";

const KNOWN = new Set<string>(languageList.map((l) => l.id));

/**
 * Scope *prose* to the reader's chosen SDK.
 *
 * `<LangCode>` already switches code windows; this does the same for the words
 * around them — a paragraph, a table, a whole `## section` that is only true
 * for one language. Accepts a single id (`id="py"`) or a comma/space separated
 * set (`id="py, js"`).
 *
 * Renders `null` when the reader is on another language. Nothing is lost by
 * that: docs **search** (`app/api/search`) and the raw-Markdown mirror
 * (`/md/*`, `lib/docs-markdown.ts`) both read the MDX *source*, where every
 * branch is present — the mirror flattens them all with a bold language label.
 *
 * SSR renders `DEFAULT_LANG` and `LanguageProvider` only reads localStorage in
 * an effect, so the first client render matches the server one (no hydration
 * mismatch); the switch happens on the following paint.
 */
export function LangOnly({
  id,
  children,
}: {
  id: LangId | string;
  children: React.ReactNode;
}) {
  const { lang } = useLanguage();

  const ids = React.useMemo(
    () =>
      String(id)
        .split(/[\s,|]+/)
        .filter((v) => KNOWN.has(v)),
    [id]
  );

  if (!ids.includes(lang)) return null;
  return <>{children}</>;
}
