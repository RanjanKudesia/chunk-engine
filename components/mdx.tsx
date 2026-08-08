import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

import { LangCode } from "@/components/lang-code";
import { LangOnly } from "@/components/lang-only";
import { LangSelect } from "@/components/lang-select";
import { InstallTabs } from "@/components/install-tabs";
import { Mermaid } from "@/components/mermaid";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    // Language-aware code samples in docs (synced to the global switcher).
    LangCode,
    // Language-aware *prose*: renders only for the active SDK.
    LangOnly,
    // In-page copy of the global SDK switcher.
    LangSelect,
    InstallTabs,
    // Diagrams: <Mermaid chart={`graph LR; A --> B`} />
    Mermaid,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
