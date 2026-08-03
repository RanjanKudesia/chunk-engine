"use client";

import { Loader2 } from "lucide-react";

import type { Method } from "@/data/playground";
import { CopyButton } from "@/components/copy-button";
import { ChunkCard } from "@/components/playground/chunk-card";
import { ImageThumb } from "@/components/playground/image-thumb";
import type { PlaygroundChunk, RunResult } from "@/components/playground/types";

interface OutputPaneProps {
  method: Method;
  result: RunResult | null;
  running: boolean;
  runError: string | null;
  chunks: PlaygroundChunk[];
  shown: PlaygroundChunk[];
  activeIdx: number | null;
  onHover: (i: number | null) => void;
  onSelect: (i: number) => void;
}

export function OutputPane({
  method,
  result,
  running,
  runError,
  chunks,
  shown,
  activeIdx,
  onHover,
  onSelect,
}: Readonly<OutputPaneProps>) {
  return (
    <div className="flex h-[70vh] flex-col overflow-hidden rounded-xl border border-border bg-surface lg:h-full">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Output
        </span>
        <span className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          {running ? <Loader2 className="size-3 animate-spin" /> : null}
          {result ? (
            <>
              {method === "markdown"
                ? `${result.markdown?.length ?? 0} chars`
                : `${chunks.length} chunks`}
              <span className="text-brand">· {result.elapsedMs.toFixed(1)} ms</span>
            </>
          ) : null}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        {runError ? (
          <p className="text-sm text-red-500">{runError}</p>
        ) : method === "markdown" ? (
          <div className="relative">
            <CopyButton
              value={result?.markdown ?? ""}
              className="absolute right-0 top-0"
            />
            <pre className="overflow-auto whitespace-pre-wrap wrap-break-word pr-10 font-mono text-xs leading-relaxed text-foreground/90">
              {result?.markdown ?? ""}
            </pre>
          </div>
        ) : (
          <div className="space-y-2.5">
            {shown.map((c, i) => (
              <ChunkCard
                key={i}
                chunk={c}
                index={i}
                active={activeIdx === i}
                onActivate={onHover}
                onLeave={() => onHover(null)}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}

        {result?.images && result.images.length > 0 ? (
          <div className="mt-4 border-t border-border/60 pt-3">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {result.images.length} image{result.images.length === 1 ? "" : "s"}
            </p>
            <div className="flex flex-wrap gap-2">
              {result.images.map((img) => (
                <ImageThumb key={img.name} image={img} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
