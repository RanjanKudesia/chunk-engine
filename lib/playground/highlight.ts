/**
 * Maps chunks onto the ORIGINAL continuous rendered Markdown, so hovering a
 * chunk can highlight the block(s) it covers — without altering the markdown.
 * Matching is by normalized text (chunk content vs. the rendered block text).
 */

function normalize(s: string): string {
  return s.replace(/\s+/g, " ").trim().toLowerCase();
}

/** For each chunk, the [startBlock, endBlock] index range in `container`'s
 * top-level block children. */
export function computeChunkRanges(
  container: HTMLElement,
  chunkTexts: string[]
): [number, number][] {
  const blocks = Array.from(container.children) as HTMLElement[];
  if (blocks.length === 0) return chunkTexts.map(() => [0, -1]);

  let acc = "";
  const offs: { j: number; start: number; end: number }[] = [];
  blocks.forEach((b, j) => {
    const t = normalize(b.textContent ?? "");
    const start = acc.length;
    acc += t + " ";
    offs.push({ j, start, end: start + t.length });
  });

  const blockAt = (pos: number) => {
    for (const o of offs) if (pos >= o.start && pos < o.end) return o.j;
    return offs[offs.length - 1].j;
  };

  const starts: number[] = [];
  let cursor = 0;
  for (const ct of chunkTexts) {
    const norm = normalize(ct);
    const anchor = norm.slice(0, Math.min(60, norm.length));
    let p = anchor ? acc.indexOf(anchor, cursor) : -1;
    if (p < 0 && anchor) p = acc.indexOf(anchor); // retry from the top
    if (p < 0) {
      starts.push(starts.length ? starts[starts.length - 1] : 0);
    } else {
      starts.push(blockAt(p));
      cursor = p + Math.max(1, Math.floor(anchor.length / 2));
    }
  }

  return starts.map((s, i) => {
    const next = i + 1 < starts.length ? starts[i + 1] : blocks.length;
    return [s, Math.max(s, next - 1)] as [number, number];
  });
}

export function clearHighlight(container: HTMLElement): void {
  for (const b of Array.from(container.children) as HTMLElement[]) {
    b.style.background = "";
    b.style.boxShadow = "";
    b.style.borderRadius = "";
    b.style.paddingLeft = "";
    b.style.marginLeft = "";
  }
}

export function applyHighlight(
  container: HTMLElement,
  range: [number, number],
  color: string
): HTMLElement | null {
  clearHighlight(container);
  const blocks = Array.from(container.children) as HTMLElement[];
  let first: HTMLElement | null = null;
  for (let j = range[0]; j <= range[1] && j < blocks.length; j++) {
    const b = blocks[j];
    if (!first) first = b;
    b.style.background = `color-mix(in srgb, ${color} 12%, transparent)`;
    b.style.boxShadow = `inset 3px 0 0 ${color}`;
    b.style.borderRadius = "4px";
    // Extend the tint slightly left without shifting the text.
    b.style.paddingLeft = "8px";
    b.style.marginLeft = "-8px";
  }
  return first;
}
