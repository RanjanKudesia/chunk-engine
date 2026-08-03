/**
 * Supported formats — extension list derived from the library source
 * (`py_chunks/chunkers/` + README "Supported Formats", v0.5.0).
 *
 * HONESTY RULE (see NEEDS-REVIEW.md): `stable` = confirmed in the published
 * PyPI wheel's description. `new` = present in the library source / latest
 * builds but NOT yet confirmed in the current `pip install` — the footnote in
 * <FormatGrid> says exactly this. Nothing here claims an unpublished format
 * works in today's wheel.
 */
export type FormatStatus = "stable" | "new" | "soon";

export interface FormatFamily {
  family: string;
  blurb: string;
  formats: { ext: string; status: FormatStatus }[];
}

export const formatFamilies: FormatFamily[] = [
  {
    family: "Word",
    blurb: "OOXML + legacy binary Word",
    formats: [
      { ext: ".docx", status: "stable" },
      { ext: ".doc", status: "stable" },
      { ext: ".docm", status: "new" },
      { ext: ".dotx", status: "new" },
      { ext: ".dotm", status: "new" },
    ],
  },
  {
    family: "PowerPoint",
    blurb: "OOXML + legacy binary PowerPoint",
    formats: [
      { ext: ".pptx", status: "stable" },
      { ext: ".ppt", status: "stable" },
      { ext: ".potx", status: "new" },
      { ext: ".potm", status: "new" },
      { ext: ".ppsx", status: "new" },
      { ext: ".ppsm", status: "new" },
    ],
  },
  {
    family: "Spreadsheets",
    blurb: "Excel + OpenDocument sheets",
    formats: [
      { ext: ".xlsx", status: "stable" },
      { ext: ".xls", status: "stable" },
      { ext: ".xlsm", status: "new" },
      { ext: ".xlsb", status: "new" },
      { ext: ".xltx", status: "new" },
      { ext: ".xltm", status: "new" },
      { ext: ".ods", status: "new" },
    ],
  },
  {
    family: "PDF",
    blurb: "Text + page-scoped images",
    formats: [{ ext: ".pdf", status: "stable" }],
  },
  {
    family: "Web & Markup",
    blurb: "Markup and rich text",
    formats: [
      { ext: ".html", status: "stable" },
      { ext: ".htm", status: "stable" },
      { ext: ".md", status: "stable" },
      { ext: ".rtf", status: "new" },
    ],
  },
  {
    family: "OpenDocument",
    blurb: "LibreOffice / OpenOffice documents",
    formats: [
      { ext: ".odt", status: "new" },
      { ext: ".odp", status: "new" },
    ],
  },
  {
    family: "Plain & Data",
    blurb: "Text and structured data",
    formats: [
      { ext: ".txt", status: "stable" },
      { ext: ".csv", status: "stable" },
      { ext: ".tsv", status: "new" },
      { ext: ".json", status: "new" },
      { ext: ".jsonl", status: "new" },
      { ext: ".ndjson", status: "new" },
    ],
  },
  {
    family: "Email",
    blurb: "Outlook + MIME email",
    formats: [
      { ext: ".msg", status: "new" },
      { ext: ".eml", status: "new" },
      { ext: ".mbox", status: "new" },
    ],
  },
  {
    family: "eBooks & Notebooks",
    blurb: "EPUB and Jupyter",
    formats: [
      { ext: ".epub", status: "new" },
      { ext: ".ipynb", status: "new" },
    ],
  },
];

/** Total distinct extensions — matches the "36 formats" headline. */
export const formatCount = formatFamilies.reduce(
  (n, f) => n + f.formats.length,
  0
);
