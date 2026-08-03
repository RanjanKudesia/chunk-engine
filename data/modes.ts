/**
 * Chunking modes — descriptions derived from the source README
 * ("Pick your mode" table). Document formats support 7 modes; spreadsheet
 * formats support a different set (row/table/sheet + shared modes).
 */
export interface ChunkMode {
  id: string;
  label: string;
  summary: string;
  /** When to reach for it (from the source guidance). */
  bestFor: string;
}

export const documentModes: ChunkMode[] = [
  {
    id: "default",
    label: "default",
    summary: "Element-level chunks — one per paragraph or heading.",
    bestFor: "Fine-grained, element-level control.",
  },
  {
    id: "structural",
    label: "structural",
    summary: "Index every paragraph and heading individually.",
    bestFor: "Fine-grained retrieval over document structure.",
  },
  {
    id: "section",
    label: "section",
    summary: "Keep all content under a heading together in one chunk.",
    bestFor: "Section-level search / document indexes.",
  },
  {
    id: "semantic",
    label: "semantic",
    summary: "Group semantically coherent passages together.",
    bestFor: "Feeding an LLM or embedding model.",
  },
  {
    id: "sliding_window",
    label: "sliding_window",
    summary: "Overlapping windows with configurable size and overlap.",
    bestFor: "Dense retrieval / sliding-context inference.",
  },
  {
    id: "sentence",
    label: "sentence",
    summary: "Enforce a fixed number of sentences per chunk.",
    bestFor: "Tight token budgets.",
  },
  {
    id: "page_aware",
    label: "page_aware",
    summary: "Preserve the document's original page layout.",
    bestFor: "Page-referenced citations.",
  },
];

export const spreadsheetModes: ChunkMode[] = [
  {
    id: "row",
    label: "row",
    summary: "Chunk a spreadsheet N rows at a time.",
    bestFor: "XLSX / XLS / CSV row batching.",
  },
  {
    id: "table",
    label: "table",
    summary: "Chunk by detected table region or named table.",
    bestFor: "XLSX / XLS structured tables.",
  },
  {
    id: "sheet",
    label: "sheet",
    summary: "One chunk per sheet.",
    bestFor: "Sheet-level segmentation.",
  },
];
