"use client";

import * as React from "react";

import { DEFAULT_LANG, type LangId } from "@/data/languages";

const STORAGE_KEY = "chunk-engine-lang";

interface LanguageState {
  lang: LangId;
  setLang: (l: LangId) => void;
}

const LanguageContext = React.createContext<LanguageState | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<LangId>(DEFAULT_LANG);

  // Hydrate from localStorage after mount (SSR renders the default).
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as LangId | null;
      if (saved === "py" || saved === "js" || saved === "rs") {
        setLangState(saved);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = React.useCallback((l: LangId) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = React.useMemo(() => ({ lang, setLang }), [lang, setLang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageState {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) {
    // Fallback so components render outside a provider (e.g. isolated tests).
    return { lang: DEFAULT_LANG, setLang: () => {} };
  }
  return ctx;
}
