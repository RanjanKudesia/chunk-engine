/**
 * Playground configuration. Starts with DOCX (a real sample preloaded); more
 * extensions get flipped to `enabled` as they're wired up.
 */

export interface PlaygroundExt {
  ext: string; // without dot
  label: string;
  enabled: boolean;
  /** Public path to a default sample file, fetched on select. */
  sample?: string;
  sampleName?: string; // filename passed to the engine (drives dispatch)
}

export const playgroundExts: PlaygroundExt[] = [
  {
    ext: "docx",
    label: "DOCX",
    enabled: true,
    sample: "/playground/all_round.docx",
    sampleName: "all_round.docx",
  },
  {
    ext: "pdf",
    label: "PDF",
    enabled: true,
    sample: "/playground/word2vec.pdf",
    sampleName: "word2vec.pdf",
  },
  {
    ext: "pptx",
    label: "PPTX",
    enabled: true,
    sample: "/playground/mixed_content.pptx",
    sampleName: "mixed_content.pptx",
  },
  {
    ext: "xlsx",
    label: "XLSX",
    enabled: true,
    sample: "/playground/sample.xlsx",
    sampleName: "sample.xlsx",
  },
  {
    ext: "html",
    label: "HTML",
    enabled: true,
    sample: "/playground/structured_docs.html",
    sampleName: "structured_docs.html",
  },
  {
    ext: "md",
    label: "Markdown",
    enabled: true,
    sample: "/playground/sample.md",
    sampleName: "sample.md",
  },
  {
    ext: "txt",
    label: "TXT",
    enabled: true,
    sample: "/playground/structured_report.txt",
    sampleName: "structured_report.txt",
  },
  {
    ext: "csv",
    label: "CSV",
    enabled: true,
    sample: "/playground/iris.csv",
    sampleName: "iris.csv",
  },
  {
    ext: "json",
    label: "JSON",
    enabled: true,
    sample: "/playground/orders.json",
    sampleName: "orders.json",
  },
  {
    ext: "eml",
    label: "EML",
    enabled: true,
    sample: "/playground/message.eml",
    sampleName: "message.eml",
  },
  {
    ext: "msg",
    label: "MSG",
    enabled: true,
    sample: "/playground/message.msg",
    sampleName: "message.msg",
  },
  {
    ext: "epub",
    label: "EPUB",
    enabled: true,
    sample: "/playground/book.epub",
    sampleName: "book.epub",
  },
];

export type Method = "chunks" | "stream" | "markdown";

export const methods: { id: Method; label: string; fn: string; hint: string }[] = [
  { id: "chunks", label: "getChunks", fn: "getChunks", hint: "Batch — the full array of typed chunks." },
  { id: "stream", label: "streamChunks", fn: "streamChunks", hint: "Same chunks, revealed one at a time." },
  { id: "markdown", label: "getMarkdown", fn: "getMarkdown", hint: "The document converted to a Markdown string." },
];

/** Document chunking modes (DOCX and the other prose formats). */
export const docModes = [
  "default",
  "structural",
  "section",
  "semantic",
  "sliding_window",
  "sentence",
  "page_aware",
];

/** Spreadsheet modes (XLSX / XLS / ODS …). */
export const spreadsheetModes = [
  "row",
  "table",
  "sheet",
  "sliding_window",
  "page_aware",
  "semantic",
];

/** Delimited-text modes (CSV / TSV). */
export const csvModes = ["row", "sliding_window", "page_aware"];

const SPREADSHEET_EXTS = ["xlsx", "xls", "xlsm", "xlsb", "ods", "xltx", "xltm"];

/** The chunking modes valid for a given extension's family. */
export function modesFor(ext: string): string[] {
  if (ext === "csv" || ext === "tsv") return csvModes;
  if (SPREADSHEET_EXTS.includes(ext)) return spreadsheetModes;
  return docModes;
}

/** Which parameter each mode actually consumes — drives the "active" hint in the UI. */
export const paramUsage: Record<string, string[]> = {
  default: [],
  structural: [],
  section: [],
  semantic: [],
  sliding_window: ["windowSize", "overlap"],
  sentence: ["sentencesPerChunk"],
  page_aware: ["paragraphsPerPage"],
  row: [],
  table: [],
  sheet: [],
};

export const paramMeta: {
  key: "windowSize" | "overlap" | "sentencesPerChunk" | "paragraphsPerPage";
  label: string;
  default: number;
  min: number;
}[] = [
  { key: "windowSize", label: "window_size", default: 3, min: 1 },
  { key: "overlap", label: "overlap", default: 1, min: 0 },
  { key: "sentencesPerChunk", label: "sentences_per_chunk", default: 3, min: 1 },
  { key: "paragraphsPerPage", label: "paragraphs_per_page", default: 15, min: 1 },
];

/** content_type → color. Reuses the ChunkVisualizer hues; extended for all
 * DOCX-emitted types, with a neutral fallback. */
const CT_COLORS: Record<string, string> = {
  heading: "#e8511e",
  plain_paragraph: "#6366f1",
  long_single_paragraph: "#818cf8",
  short_disconnected_paragraph: "#a5b4fc",
  mixed_content: "#8b5cf6",
  bullet_list: "#10b981",
  table: "#f59e0b",
  code_block: "#a855f7",
  section: "#06b6d4",
  semantic: "#f43f5e",
  sliding_window: "#14b8a6",
  sentence: "#eab308",
  page_aware: "#3b82f6",
  footnote_caption: "#a78bfa",
  header_footer: "#94a3b8",
  image: "#ec4899",
  row_group: "#0ea5e9",
  row_window: "#22d3ee",
  row_document: "#0ea5e9",
  table_region: "#f59e0b",
  sheet: "#10b981",
  sheet_region: "#34d399",
  semantic_group: "#f43f5e",
};

export function contentTypeColor(type: string): string {
  return CT_COLORS[type] ?? "#a1a1aa";
}
