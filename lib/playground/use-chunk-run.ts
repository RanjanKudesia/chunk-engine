import * as React from "react";

import * as engine from "@/lib/playground/engine";
import type { Method } from "@/data/playground";
import type {
  PlayFile,
  Params,
  RunResult,
  PlaygroundChunk,
} from "@/components/playground/types";

export interface ChunkRun {
  result: RunResult | null;
  running: boolean;
  runError: string | null;
  chunks: PlaygroundChunk[];
  /** Chunks currently visible (all, or a growing slice in stream mode). */
  shown: PlaygroundChunk[];
}

/** Runs the selected method (getChunks / streamChunks / getMarkdown) whenever
 * the file or any configuration changes, timing it client-side. */
export function useChunkRun({
  file,
  method,
  mode,
  params,
  listImages,
}: {
  file: PlayFile | null;
  method: Method;
  mode: string;
  params: Params;
  listImages: boolean;
}): ChunkRun {
  const [result, setResult] = React.useState<RunResult | null>(null);
  const [running, setRunning] = React.useState(false);
  const [runError, setRunError] = React.useState<string | null>(null);
  const [reveal, setReveal] = React.useState(0);

  React.useEffect(() => {
    if (!file) {
      setResult(null);
      return;
    }
    let cancelled = false;
    let revealTimer: ReturnType<typeof setTimeout> | undefined;
    setRunning(true);
    setRunError(null);
    const opts = { mode, ...params };
    (async () => {
      try {
        const t0 = performance.now();
        let out: RunResult;
        if (method === "markdown") {
          if (listImages) {
            const r = await engine.markdownWithImages(file.bytes, file.name);
            out = { markdown: r.markdown, images: r.images, elapsedMs: performance.now() - t0 };
          } else {
            const md = await engine.markdown(file.bytes, file.name);
            out = { markdown: md, elapsedMs: performance.now() - t0 };
          }
        } else if (listImages) {
          const r = await engine.chunkWithImages(file.bytes, file.name, opts);
          out = { chunks: r.chunks, images: r.images, elapsedMs: performance.now() - t0 };
        } else {
          const chunks = await engine.chunk(file.bytes, file.name, opts);
          out = { chunks, elapsedMs: performance.now() - t0 };
        }
        if (cancelled) return;
        setResult(out);
        // Stream mode: reveal chunks progressively.
        if (method === "stream" && out.chunks) {
          setReveal(0);
          let i = 0;
          const total = out.chunks.length;
          const tick = () => {
            if (cancelled) return;
            i += 1;
            setReveal(i);
            if (i < total) revealTimer = setTimeout(tick, 90);
          };
          revealTimer = setTimeout(tick, 90);
        } else {
          setReveal(Number.MAX_SAFE_INTEGER);
        }
      } catch (err) {
        if (!cancelled) setRunError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setRunning(false);
      }
    })();
    return () => {
      cancelled = true;
      if (revealTimer) clearTimeout(revealTimer);
    };
  }, [file, method, mode, params, listImages]);

  const chunks = result?.chunks ?? [];
  const shown = method === "stream" ? chunks.slice(0, reveal) : chunks;

  return { result, running, runError, chunks, shown };
}
