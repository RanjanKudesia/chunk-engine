import * as React from "react";

import type { PlayFile } from "@/components/playground/types";

export interface RenderedDocument {
  pdfUrl: string | null;
  docxLoading: boolean;
  docxError: string | null;
  pptxLoading: boolean;
  pptxError: string | null;
  xlsxLoading: boolean;
  xlsxError: string | null;
  zoom: number;
  zoomBy: (delta: number) => void;
}

type DivRef = React.RefObject<HTMLDivElement | null>;

/**
 * Renders the REAL document into the left "rendered" pane, format-aware:
 *   .docx → docx-preview · .pptx → pptx-preview · .pdf → a blob URL (native viewer).
 * Each renderer only runs when the loaded file's extension matches `ext`, so a
 * stale file is never fed to the wrong renderer during a tab switch.
 */
export function useRenderedDocument({
  ext,
  file,
  leftScrollRef,
  docxRef,
  pptxHostRef,
  xlsxHostRef,
}: {
  ext: string;
  file: PlayFile | null;
  leftScrollRef: DivRef;
  docxRef: DivRef;
  pptxHostRef: DivRef;
  xlsxHostRef: DivRef;
}): RenderedDocument {
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);
  const [docxLoading, setDocxLoading] = React.useState(false);
  const [docxError, setDocxError] = React.useState<string | null>(null);
  const [pptxLoading, setPptxLoading] = React.useState(false);
  const [pptxError, setPptxError] = React.useState<string | null>(null);
  const [xlsxLoading, setXlsxLoading] = React.useState(false);
  const [xlsxError, setXlsxError] = React.useState<string | null>(null);
  const [zoom, setZoom] = React.useState(0.5);

  const zoomBy = React.useCallback(
    (delta: number) =>
      setZoom((z) => Math.max(0.3, Math.min(2, Number((z + delta).toFixed(2))))),
    []
  );

  // PDF: build a blob URL for the browser-native viewer.
  React.useEffect(() => {
    if (ext !== "pdf" || !file || !file.name.toLowerCase().endsWith(".pdf")) {
      setPdfUrl(null);
      return;
    }
    const copy = new Uint8Array(file.bytes);
    const url = URL.createObjectURL(
      new Blob([copy.buffer as ArrayBuffer], { type: "application/pdf" })
    );
    setPdfUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [ext, file]);

  // DOCX: docx-preview.
  React.useEffect(() => {
    if (
      ext !== "docx" ||
      !file ||
      !file.name.toLowerCase().endsWith(".docx") ||
      !docxRef.current
    )
      return;
    let cancelled = false;
    setDocxError(null);
    setDocxLoading(true);
    const host = docxRef.current;
    (async () => {
      try {
        const { renderAsync } = await import("docx-preview");
        const blob = new Blob([new Uint8Array(file.bytes).buffer as ArrayBuffer]);
        if (cancelled) return;
        host.innerHTML = "";
        await renderAsync(blob, host, undefined, {
          className: "docx",
          inWrapper: true,
          breakPages: true,
          ignoreLastRenderedPageBreak: true,
          experimental: true,
        });
      } catch {
        if (!cancelled) setDocxError("Could not render this .docx in the browser.");
      } finally {
        if (!cancelled) setDocxLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ext, file, docxRef]);

  // PPTX: pptx-preview (list mode, sized to the pane width).
  React.useEffect(() => {
    if (
      ext !== "pptx" ||
      !file ||
      !file.name.toLowerCase().endsWith(".pptx") ||
      !pptxHostRef.current
    )
      return;
    let cancelled = false;
    let previewer: {
      preview: (ab: ArrayBuffer) => Promise<unknown>;
      destroy?: () => void;
    } | null = null;
    const host = pptxHostRef.current;
    setPptxError(null);
    setPptxLoading(true);
    (async () => {
      try {
        const { init } = await import("pptx-preview");
        const width = Math.max(
          320,
          (leftScrollRef.current?.clientWidth ?? 640) - 24
        );
        host.innerHTML = "";
        previewer = init(host, { width, mode: "list" });
        const ab = new Uint8Array(file.bytes).buffer as ArrayBuffer;
        if (cancelled) return;
        await previewer.preview(ab);
      } catch {
        if (!cancelled) setPptxError("Could not render this .pptx in the browser.");
      } finally {
        if (!cancelled) setPptxLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      try {
        previewer?.destroy?.();
      } catch {
        /* ignore */
      }
    };
  }, [ext, file, pptxHostRef, leftScrollRef]);

  // XLSX: @js-preview/excel (x-spreadsheet grid with real sheet tabs).
  React.useEffect(() => {
    if (
      ext !== "xlsx" ||
      !file ||
      !file.name.toLowerCase().endsWith(".xlsx") ||
      !xlsxHostRef.current
    )
      return;
    let cancelled = false;
    let previewer: { destroy?: () => void } | null = null;
    const host = xlsxHostRef.current;
    setXlsxError(null);
    setXlsxLoading(true);
    (async () => {
      try {
        const mod = await import("@js-preview/excel");
        const lib = (mod.default ?? mod) as unknown as {
          init: (el: HTMLElement) => {
            preview: (ab: ArrayBuffer) => Promise<unknown>;
            destroy?: () => void;
          };
        };
        const ab = new Uint8Array(file.bytes).buffer as ArrayBuffer;
        host.innerHTML = "";
        const p = lib.init(host);
        previewer = p;
        if (cancelled) return;
        await p.preview(ab);
      } catch {
        if (!cancelled) setXlsxError("Could not render this .xlsx in the browser.");
      } finally {
        if (!cancelled) setXlsxLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      try {
        previewer?.destroy?.();
      } catch {
        /* ignore */
      }
    };
  }, [ext, file, xlsxHostRef]);

  return {
    pdfUrl,
    docxLoading,
    docxError,
    pptxLoading,
    pptxError,
    xlsxLoading,
    xlsxError,
    zoom,
    zoomBy,
  };
}
