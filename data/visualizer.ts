/**
 * Sample data for the ChunkVisualizer. Illustrative (a small synthetic
 * document), but the chunk groupings and `content_type` labels reflect how the
 * real modes behave — every content_type used here is a real value from the
 * Rust `ContentType` enum (src/.../common.rs): plain_paragraph, heading,
 * bullet_list, table, code_block, section, semantic, sliding_window.
 */

export interface DocBlock {
  id: number;
  /** Structural role — drives the left-column rendering. */
  kind: "heading" | "paragraph" | "table" | "bullet_list" | "code_block";
  text: string;
}

export const sampleDoc: DocBlock[] = [
  { id: 0, kind: "heading", text: "Q3 Financial Summary" },
  { id: 1, kind: "paragraph", text: "Revenue grew 18% quarter-over-quarter, driven by expansion in enterprise accounts." },
  { id: 2, kind: "paragraph", text: "Operating margin held steady at 22% despite increased R&D investment." },
  { id: 3, kind: "heading", text: "Regional Breakdown" },
  { id: 4, kind: "table", text: "| Region | Revenue | YoY |\n| EMEA | $4.2M | +12% |\n| AMER | $6.8M | +21% |" },
  { id: 5, kind: "bullet_list", text: "• North America led growth at +21%\n• EMEA steady at +12%\n• APAC accelerating into Q4" },
  { id: 6, kind: "heading", text: "Ingest Example" },
  { id: 7, kind: "code_block", text: "chunks = get_chunks(\"q3.pdf\", mode=\"semantic\")" },
];

export interface Chunk {
  /** content_type emitted for this chunk (real enum value). */
  contentType: string;
  /** Source block ids this chunk covers (overlaps allowed for windows). */
  blocks: number[];
  /** Short label shown on the chunk card. */
  label: string;
}

export interface VisualizerMode {
  id: string;
  label: string;
  note: string;
  chunks: Chunk[];
}

export const visualizerModes: VisualizerMode[] = [
  {
    id: "structural",
    label: "structural",
    note: "One chunk per element — each heading, paragraph, table, and list stands alone.",
    chunks: [
      { contentType: "heading", blocks: [0], label: "Q3 Financial Summary" },
      { contentType: "plain_paragraph", blocks: [1], label: "Revenue grew 18%…" },
      { contentType: "plain_paragraph", blocks: [2], label: "Operating margin…" },
      { contentType: "heading", blocks: [3], label: "Regional Breakdown" },
      { contentType: "table", blocks: [4], label: "Region / Revenue table" },
      { contentType: "bullet_list", blocks: [5], label: "Growth bullet list" },
      { contentType: "heading", blocks: [6], label: "Ingest Example" },
      { contentType: "code_block", blocks: [7], label: "get_chunks(…) call" },
    ],
  },
  {
    id: "section",
    label: "section",
    note: "Everything under a heading collapses into one section chunk.",
    chunks: [
      { contentType: "section", blocks: [0, 1, 2], label: "Q3 Financial Summary §" },
      { contentType: "section", blocks: [3, 4, 5], label: "Regional Breakdown §" },
      { contentType: "section", blocks: [6, 7], label: "Ingest Example §" },
    ],
  },
  {
    id: "semantic",
    label: "semantic",
    note: "Coherent passages are grouped for embeddings — boundaries follow meaning, not markup.",
    chunks: [
      { contentType: "semantic", blocks: [0, 1, 2], label: "Financial performance" },
      { contentType: "semantic", blocks: [3, 4, 5], label: "Regional results" },
      { contentType: "semantic", blocks: [6, 7], label: "How to ingest" },
    ],
  },
  {
    id: "sliding_window",
    label: "sliding_window",
    note: "Overlapping windows (size 3, overlap 1) for dense retrieval — note the shared blocks.",
    chunks: [
      { contentType: "sliding_window", blocks: [0, 1, 2], label: "Window 1" },
      { contentType: "sliding_window", blocks: [2, 3, 4], label: "Window 2" },
      { contentType: "sliding_window", blocks: [4, 5, 6], label: "Window 3" },
      { contentType: "sliding_window", blocks: [6, 7], label: "Window 4" },
    ],
  },
];

/** content_type → theme-agnostic hue token used by legend + chunk cards. */
export const contentTypeColors: Record<string, string> = {
  heading: "var(--ct-heading)",
  plain_paragraph: "var(--ct-paragraph)",
  bullet_list: "var(--ct-list)",
  table: "var(--ct-table)",
  code_block: "var(--ct-code)",
  section: "var(--ct-section)",
  semantic: "var(--ct-semantic)",
  sliding_window: "var(--ct-window)",
};
