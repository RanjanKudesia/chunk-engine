import * as React from "react";

import * as engine from "@/lib/playground/engine";
import { renderMarkdown } from "@/lib/playground/markdown";
import type { PlayFile } from "@/components/playground/types";

/** The left "markdown" view: the engine's Markdown for the file, rendered to
 * sanitized HTML. Empty until a file is loaded. */
export function useDocumentMarkdown(file: PlayFile | null): string {
  const [docHtml, setDocHtml] = React.useState("");

  React.useEffect(() => {
    if (!file) {
      setDocHtml("");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const md = await engine.markdown(file.bytes, file.name);
        if (!cancelled) setDocHtml(renderMarkdown(md));
      } catch {
        if (!cancelled) setDocHtml("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  return docHtml;
}
