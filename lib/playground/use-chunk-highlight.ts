import * as React from "react";

import { contentTypeColor } from "@/data/playground";
import {
  computeChunkRanges,
  applyHighlight,
  clearHighlight,
} from "@/lib/playground/highlight";
import type { PlaygroundChunk, LeftView } from "@/components/playground/types";

export interface ChunkHighlight {
  /** The chunk currently highlighted (pinned wins over hovered). */
  activeIdx: number | null;
  setHovered: (i: number | null) => void;
  /** Pin a chunk (toggle), switch to the markdown view, and scroll to it. */
  selectChunk: (i: number) => void;
}

/** Links chunk cards to the continuous markdown: hovering/clicking a chunk
 * highlights (and scrolls to) the block-range it covers. */
export function useChunkHighlight({
  markdownRef,
  docHtml,
  chunks,
  leftView,
  setLeftView,
}: {
  markdownRef: React.RefObject<HTMLDivElement | null>;
  docHtml: string;
  chunks: PlaygroundChunk[];
  leftView: LeftView;
  setLeftView: (v: LeftView) => void;
}): ChunkHighlight {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [pinned, setPinned] = React.useState<number | null>(null);
  const rangesRef = React.useRef<[number, number][]>([]);
  const activeIdx = pinned ?? hovered;

  // Reset the selection whenever the chunk set changes (new run).
  React.useEffect(() => {
    setHovered(null);
    setPinned(null);
  }, [chunks]);

  // Recompute chunk → markdown block ranges when the doc or chunks change.
  React.useEffect(() => {
    if (!markdownRef.current || !docHtml) {
      rangesRef.current = [];
      return;
    }
    rangesRef.current = computeChunkRanges(
      markdownRef.current,
      chunks.map((c) => c.content)
    );
  }, [docHtml, chunks, markdownRef]);

  // Apply / clear the highlight as the active chunk changes.
  React.useEffect(() => {
    const host = markdownRef.current;
    if (!host) return;
    if (activeIdx == null || activeIdx >= chunks.length) {
      clearHighlight(host);
      return;
    }
    const range = rangesRef.current[activeIdx];
    if (!range) return;
    applyHighlight(host, range, contentTypeColor(chunks[activeIdx].contentType));
  }, [activeIdx, docHtml, chunks, markdownRef]);

  // Scroll the pinned chunk into view once the markdown view is showing.
  React.useEffect(() => {
    if (pinned == null || leftView !== "markdown" || !markdownRef.current) return;
    const range = rangesRef.current[pinned];
    if (!range) return;
    const el = markdownRef.current.children[range[0]] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [pinned, leftView, markdownRef]);

  const selectChunk = React.useCallback(
    (i: number) => {
      setPinned((prev) => (prev === i ? null : i));
      setLeftView("markdown");
    },
    [setLeftView]
  );

  return { activeIdx, setHovered, selectChunk };
}
