"use client";

import * as React from "react";
import { Check, Copy, FileText } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Docs toolbar: copy the page as clean Markdown (code samples expanded) for
 * pasting into an LLM, or open the raw `/md/*` version.
 */
export function CopyMarkdownButton({
  markdown,
  rawHref,
}: {
  markdown: string;
  rawHref: string;
}) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked (e.g. insecure context) — the raw link still works
    }
  }

  const base =
    "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/20";

  return (
    <div className="mb-6 flex items-center justify-end gap-2 not-prose">
      <button
        type="button"
        onClick={copy}
        aria-label="Copy this page as Markdown"
        className={cn(base, copied && "text-brand border-brand/30")}
      >
        {copied ? (
          <Check className="size-3.5" />
        ) : (
          <Copy className="size-3.5" />
        )}
        {copied ? "Copied" : "Copy as Markdown"}
      </button>
      <a
        href={rawHref}
        target="_blank"
        rel="noreferrer"
        aria-label="View this page as raw Markdown"
        className={base}
      >
        <FileText className="size-3.5" />
        View raw
      </a>
    </div>
  );
}
