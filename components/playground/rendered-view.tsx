"use client";

import * as React from "react";

import type { PlayFile } from "@/components/playground/types";

type DivRef = React.RefObject<HTMLDivElement | null>;

const HINT = "p-5 text-sm text-muted-foreground";

/** Wrapper class for the rendered pane, per format. */
export function renderedClassFor(ext: string): string {
  switch (ext) {
    case "pdf":
    case "html":
    case "xlsx":
      return "h-full";
    case "pptx":
      return "pptx-host p-3";
    case "md":
    case "csv":
    case "msg":
    case "epub":
      return "playground-doc p-5";
    case "txt":
    case "json":
    case "eml":
      return "p-5";
    default:
      return "docx-host";
  }
}

/** The format-specific rendered document (early returns keep it flat). */
export function RenderedView({
  ext,
  file,
  docHtml,
  source,
  pdfUrl,
  docxRef,
  pptxHostRef,
  xlsxHostRef,
  zoom,
  docxLoading,
  docxError,
  pptxLoading,
  pptxError,
  xlsxLoading,
  xlsxError,
}: Readonly<{
  ext: string;
  file: PlayFile | null;
  docHtml: string;
  source: string;
  pdfUrl: string | null;
  docxRef: DivRef;
  pptxHostRef: DivRef;
  xlsxHostRef: DivRef;
  zoom: number;
  docxLoading: boolean;
  docxError: string | null;
  pptxLoading: boolean;
  pptxError: string | null;
  xlsxLoading: boolean;
  xlsxError: string | null;
}>) {
  if (!file) return <p className={HINT}>Loading…</p>;

  if (ext === "pdf")
    return pdfUrl ? (
      <iframe src={pdfUrl} title="PDF document" className="h-full w-full border-0" />
    ) : (
      <p className={HINT}>Loading PDF…</p>
    );

  if (ext === "html")
    return (
      <iframe
        srcDoc={source}
        sandbox=""
        title="HTML document"
        className="h-full w-full border-0 bg-white"
      />
    );

  if (ext === "pptx")
    return (
      <>
        {pptxError ? <p className="p-5 text-sm text-red-500">{pptxError}</p> : null}
        {pptxLoading ? <p className={HINT}>Rendering slides…</p> : null}
        <div ref={pptxHostRef} />
      </>
    );

  if (ext === "xlsx")
    return (
      <>
        {xlsxError ? <p className="p-5 text-sm text-red-500">{xlsxError}</p> : null}
        {xlsxLoading ? <p className={HINT}>Rendering spreadsheet…</p> : null}
        <div ref={xlsxHostRef} className="h-full w-full" />
      </>
    );

  // .md / .csv, and the binary .msg / .epub (no lightweight viewer), render
  // their engine Markdown (formatted doc / table).
  if (ext === "md" || ext === "csv" || ext === "msg" || ext === "epub")
    return <div dangerouslySetInnerHTML={{ __html: docHtml }} />;

  // Text formats show their real source verbatim.
  if (ext === "txt" || ext === "json" || ext === "eml")
    return (
      <pre className="whitespace-pre-wrap wrap-break-word font-mono text-xs leading-relaxed text-foreground/90">
        {source}
      </pre>
    );

  // docx
  return (
    <>
      {docxError ? <p className="p-5 text-sm text-red-500">{docxError}</p> : null}
      {docxLoading ? <p className={HINT}>Rendering document…</p> : null}
      <div ref={docxRef} style={{ zoom }} />
    </>
  );
}
