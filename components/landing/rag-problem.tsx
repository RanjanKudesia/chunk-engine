import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The RAG problem strip — illustrative before/after showing why chunk
 * boundaries matter. Naive fixed-size splitting severs sentences and tables;
 * structure-aware chunking keeps semantic units intact.
 */

function ChunkLine({
  children,
  tone,
  torn,
}: {
  children: React.ReactNode;
  tone: "bad" | "good";
  torn?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-md border-l-2 px-3 py-2 font-mono text-xs",
        tone === "bad"
          ? "border-red-500/60 bg-red-500/5 text-foreground/80"
          : "border-emerald-500/60 bg-emerald-500/5 text-foreground/80",
        torn && "border-dashed"
      )}
    >
      {children}
    </div>
  );
}

export function RagProblem() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Naive */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <X className="size-3.5" />
          </span>
          <h3 className="text-sm font-semibold">Naive fixed-size splitting</h3>
        </div>
        <div className="space-y-2">
          <ChunkLine tone="bad">
            …the Q3 revenue figure was $6.8M, representing a 21% incr
          </ChunkLine>
          <ChunkLine tone="bad" torn>
            ease over the prior year. Meanwhile operating margin held ▓
          </ChunkLine>
          <ChunkLine tone="bad" torn>
            | Region | Revenue | ← table split across two chunks
          </ChunkLine>
          <ChunkLine tone="bad">| EMEA | $4.2M | +12% | AMER | $6.8M…</ChunkLine>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Sentences cut mid-word, tables severed, headings orphaned — the
          embedding model never sees a coherent unit, so retrieval misses.
        </p>
      </div>

      {/* chunk-engine */}
      <div className="rounded-2xl border border-brand/30 bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <Check className="size-3.5" />
          </span>
          <h3 className="text-sm font-semibold">
            chunk-engine — structure-aware
          </h3>
        </div>
        <div className="space-y-2">
          <ChunkLine tone="good">
            heading · &quot;Q3 Financial Summary&quot;
          </ChunkLine>
          <ChunkLine tone="good">
            semantic · Revenue grew 18% QoQ, driven by enterprise expansion…
          </ChunkLine>
          <ChunkLine tone="good">
            table · | Region | Revenue | YoY | (kept whole)
          </ChunkLine>
          <ChunkLine tone="good">
            bullet_list · North America +21%, EMEA +12%, APAC accelerating
          </ChunkLine>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Each chunk is a complete semantic unit with a typed{" "}
          <code className="text-brand">content_type</code> — headings, tables,
          and lists stay intact, so retrieval lands on the answer.
        </p>
      </div>
    </div>
  );
}
