/**
 * Supported formats — extension list derived from the library source
 * (`rs-chunks/src/dispatch.rs` + README "Supported Formats").
 *
 * Every extension listed here dispatches in `rs-chunks/src/dispatch.rs`, chunks
 * a real fixture, and ships in all three SDKs — there is no partial tier. The
 * list is therefore flat: an extension is here or it is not supported.
 *
 * There used to be a per-format `status` field (`stable` / `new` / `soon`).
 * It never meant "support level" — it recorded whether the *published wheel's*
 * per-format documentation covered that extension in detail, an under-claim
 * kept while the docs caught up. As of 0.6.2 all 36 formats are documented and
 * the docs' supported-formats page has dropped its Availability column, so the
 * field distinguished nothing and every chip rendered the same badge. It was
 * removed rather than set to a constant, so it cannot drift back into looking
 * like a support-level claim. If a genuine availability split ever returns
 * (a format behind a feature flag, say), add a field that says exactly that.
 *
 * Audited 2026-08-08.
 */
export interface FormatFamily {
  family: string;
  blurb: string;
  formats: { ext: string }[];
}

export const formatFamilies: FormatFamily[] = [
  {
    family: "Word",
    blurb: "OOXML + legacy binary Word",
    formats: [
      { ext: ".docx" },
      { ext: ".doc" },
      { ext: ".docm" },
      { ext: ".dotx" },
      { ext: ".dotm" },
    ],
  },
  {
    family: "PowerPoint",
    blurb: "OOXML + legacy binary PowerPoint",
    formats: [
      { ext: ".pptx" },
      { ext: ".ppt" },
      { ext: ".potx" },
      { ext: ".potm" },
      { ext: ".ppsx" },
      { ext: ".ppsm" },
    ],
  },
  {
    family: "Spreadsheets",
    blurb: "Excel + OpenDocument sheets",
    formats: [
      { ext: ".xlsx" },
      { ext: ".xls" },
      { ext: ".xlsm" },
      { ext: ".xlsb" },
      { ext: ".xltx" },
      { ext: ".xltm" },
      { ext: ".ods" },
    ],
  },
  {
    family: "PDF",
    blurb: "Text + page-scoped images",
    formats: [{ ext: ".pdf" }],
  },
  {
    family: "Web & Markup",
    blurb: "Markup and rich text",
    formats: [
      { ext: ".html" },
      { ext: ".htm" },
      { ext: ".md" },
      { ext: ".rtf" },
    ],
  },
  {
    family: "OpenDocument",
    blurb: "LibreOffice / OpenOffice documents",
    formats: [{ ext: ".odt" }, { ext: ".odp" }],
  },
  {
    family: "Plain & Data",
    blurb: "Text and structured data",
    formats: [
      { ext: ".txt" },
      { ext: ".csv" },
      { ext: ".tsv" },
      { ext: ".json" },
      { ext: ".jsonl" },
      { ext: ".ndjson" },
    ],
  },
  {
    family: "Email",
    blurb: "Outlook + MIME email",
    formats: [{ ext: ".msg" }, { ext: ".eml" }, { ext: ".mbox" }],
  },
  {
    family: "eBooks & Notebooks",
    blurb: "EPUB and Jupyter",
    formats: [{ ext: ".epub" }, { ext: ".ipynb" }],
  },
];

/** Total distinct extensions — matches the "36 formats" headline. */
export const formatCount = formatFamilies.reduce(
  (n, f) => n + f.formats.length,
  0
);
