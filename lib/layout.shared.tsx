import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { site } from "@/data/site";
import { languageList } from "@/data/languages";

/** Shared options for the Fumadocs docs layout. The global SiteHeader (root
 * layout) provides the top navbar + logo, so the sidebar just carries the
 * package registry links. */
export function baseOptions(): BaseLayoutProps {
  return {
    githubUrl: site.links.github,
    links: languageList.map((l) => ({
      text: l.pkg,
      url: l.registryUrl,
      external: true,
    })),
  };
}
