import { marked } from "marked";
import DOMPurify from "dompurify";

/** Render the engine's Markdown output to sanitized HTML for the document view.
 * Runs client-side only (DOMPurify needs `window`). */
export function renderMarkdown(md: string): string {
  const html = marked.parse(md, { async: false }) as string;
  return DOMPurify.sanitize(html);
}
