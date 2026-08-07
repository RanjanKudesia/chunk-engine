"use client";

import * as React from "react";
import { Plus, Minus } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PlayFile, LeftView } from "@/components/playground/types";
import type { RenderedDocument } from "@/lib/playground/use-rendered-document";
import {
  RenderedView,
  renderedClassFor,
} from "@/components/playground/rendered-view";

type DivRef = React.RefObject<HTMLDivElement | null>;

interface DocumentPaneProps {
  ext: string;
  file: PlayFile | null;
  leftView: LeftView;
  setLeftView: (v: LeftView) => void;
  docHtml: string;
  rendered: RenderedDocument;
  leftScrollRef: DivRef;
  docxRef: DivRef;
  pptxHostRef: DivRef;
  xlsxHostRef: DivRef;
  markdownRef: DivRef;
}

function ViewToggle({
  leftView,
  setLeftView,
}: {
  leftView: LeftView;
  setLeftView: (v: LeftView) => void;
}) {
  return (
    <div className="inline-flex rounded-md border border-border bg-surface-2 p-0.5">
      {(["document", "markdown"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => setLeftView(v)}
          className={cn(
            "rounded px-2 py-0.5 font-mono text-[11px] transition-colors",
            leftView === v
              ? "bg-surface text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {v === "document" ? "rendered" : "markdown"}
        </button>
      ))}
    </div>
  );
}

function ZoomControl({
  zoom,
  zoomBy,
}: {
  zoom: number;
  zoomBy: (d: number) => void;
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-md border border-border bg-surface-2 px-0.5 py-0.5">
      <button
        type="button"
        aria-label="Zoom out"
        onClick={() => zoomBy(-0.1)}
        className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="w-9 text-center font-mono text-[11px] tabular-nums text-muted-foreground">
        {Math.round(zoom * 100)}%
      </span>
      <button
        type="button"
        aria-label="Zoom in"
        onClick={() => zoomBy(0.1)}
        className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

export function DocumentPane({
  ext,
  file,
  leftView,
  setLeftView,
  docHtml,
  rendered,
  leftScrollRef,
  docxRef,
  pptxHostRef,
  xlsxHostRef,
  markdownRef,
}: Readonly<DocumentPaneProps>) {
  const {
    pdfUrl,
    docxLoading,
    docxError,
    pptxLoading,
    pptxError,
    xlsxLoading,
    xlsxError,
    zoom,
    zoomBy,
  } = rendered;

  // Text formats render directly (no async library): .md as formatted Markdown
  // (reusing docHtml), .txt as monospace text, .html in a sandboxed iframe.
  const decodedSource = React.useMemo(
    () =>
      file && (ext === "txt" || ext === "html" || ext === "json" || ext === "eml")
        ? new TextDecoder().decode(file.bytes)
        : "",
    [file, ext]
  );

  const renderedClass = renderedClassFor(ext);

  return (
    <div className="flex h-[70vh] flex-col overflow-hidden rounded-xl border border-border bg-surface lg:h-full">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Document
        </span>
        <div className="flex items-center gap-2">
          {leftView === "document" && ext === "docx" ? (
            <ZoomControl zoom={zoom} zoomBy={zoomBy} />
          ) : null}
          <ViewToggle leftView={leftView} setLeftView={setLeftView} />
        </div>
      </div>

      <div ref={leftScrollRef} className="relative min-h-0 flex-1 overflow-auto">
        {/* Rendered view: docx-preview / pptx-preview / PDF iframe / md / txt */}
        <div className={cn(leftView !== "document" && "hidden", renderedClass)}>
          <RenderedView
            ext={ext}
            file={file}
            docHtml={docHtml}
            source={decodedSource}
            pdfUrl={pdfUrl}
            docxRef={docxRef}
            pptxHostRef={pptxHostRef}
            xlsxHostRef={xlsxHostRef}
            zoom={zoom}
            docxLoading={docxLoading}
            docxError={docxError}
            pptxLoading={pptxLoading}
            pptxError={pptxError}
            xlsxLoading={xlsxLoading}
            xlsxError={xlsxError}
          />
        </div>

        {/* Markdown view — continuous document; chunks highlight onto it */}
        <div className={cn("p-5", leftView !== "markdown" && "hidden")}>
          {docHtml ? (
            <div
              ref={markdownRef}
              className="playground-doc"
              dangerouslySetInnerHTML={{ __html: docHtml }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">Loading…</p>
          )}
        </div>
      </div>
    </div>
  );
}
