/**
 * Coverage matrix (formats × modes) — REAL, derived from the library's actual
 * mode support per format family. (The former placeholder throughput /
 * chunk-reduction / dependency-footprint series were removed: the competitive
 * benchmark has no measured equivalent for them — see BENCHMARK_HANDOFF.md — so
 * rather than invent numbers, those sections are gone. Real speed/coverage data
 * now lives in data/benchmarks.ts.)
 */

export interface CoverageRow {
  family: string;
  modes: string[];
}
const DOC_MODES = [
  "default",
  "structural",
  "section",
  "semantic",
  "sliding_window",
  "sentence",
  "page_aware",
];
const SHEET_MODES = [
  "row",
  "table",
  "sheet",
  "sliding_window",
  "page_aware",
  "semantic",
];
const CSV_MODES = ["row", "sliding_window", "page_aware"];

export const coverageMatrix: CoverageRow[] = [
  { family: "Word (.docx .doc …)", modes: DOC_MODES },
  { family: "PowerPoint (.pptx .ppt …)", modes: DOC_MODES },
  { family: "PDF (.pdf)", modes: DOC_MODES },
  { family: "Web & Markup (.html .md)", modes: DOC_MODES },
  { family: "Plain text (.txt)", modes: DOC_MODES },
  { family: "Email (.msg .eml)", modes: DOC_MODES },
  { family: "OpenDocument (.odt .odp)", modes: DOC_MODES },
  { family: "eBooks / Notebooks (.epub .ipynb)", modes: DOC_MODES },
  { family: "JSON (.json .jsonl)", modes: DOC_MODES },
  { family: "Rich text (.rtf)", modes: DOC_MODES },
  { family: "Spreadsheets (.xlsx .xls .ods …)", modes: SHEET_MODES },
  { family: "Delimited (.csv .tsv)", modes: CSV_MODES },
];

/** All mode columns for the matrix header (union, ordered). */
export const allModes = [
  "default",
  "structural",
  "section",
  "semantic",
  "sliding_window",
  "sentence",
  "page_aware",
  "row",
  "table",
  "sheet",
];
