"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";
import "@js-preview/excel/lib/index.css";

import { playgroundExts, modesFor, type Method } from "@/data/playground";
import * as engine from "@/lib/playground/engine";
import { useDocumentMarkdown } from "@/lib/playground/use-document-markdown";
import { useRenderedDocument } from "@/lib/playground/use-rendered-document";
import { useChunkRun } from "@/lib/playground/use-chunk-run";
import { useChunkHighlight } from "@/lib/playground/use-chunk-highlight";
import {
  DEFAULT_PARAMS,
  type LeftView,
  type Params,
  type PlayFile,
} from "@/components/playground/types";
import { ExtensionTabs } from "@/components/playground/extension-tabs";
import { ConfigPanel } from "@/components/playground/config-panel";
import { DocumentPane } from "@/components/playground/document-pane";
import { OutputPane } from "@/components/playground/output-pane";

export function PlaygroundClient() {
  const [ext, setExt] = React.useState("docx");
  const [file, setFile] = React.useState<PlayFile | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);

  const [method, setMethod] = React.useState<Method>("chunks");
  const [mode, setMode] = React.useState("default");
  const [params, setParams] = React.useState<Params>(DEFAULT_PARAMS);
  const [listImages, setListImages] = React.useState(false);
  const [leftView, setLeftView] = React.useState<LeftView>("document");

  // Shared DOM refs (owned here, passed to the hooks + panes that need them).
  const leftScrollRef = React.useRef<HTMLDivElement>(null);
  const docxRef = React.useRef<HTMLDivElement>(null);
  const pptxHostRef = React.useRef<HTMLDivElement>(null);
  const xlsxHostRef = React.useRef<HTMLDivElement>(null);
  const markdownRef = React.useRef<HTMLDivElement>(null);

  // Preload the WASM engine once.
  React.useEffect(() => {
    engine.preload();
  }, []);

  const loadSample = React.useCallback(() => {
    const e = playgroundExts.find((x) => x.ext === ext);
    if (!e?.sample || !e.sampleName) return;
    const name = e.sampleName;
    setFileError(null);
    setFile(null); // clear immediately so nothing stale renders during the fetch
    (async () => {
      try {
        const res = await fetch(e.sample!);
        const buf = await res.arrayBuffer();
        setFile({ name, bytes: new Uint8Array(buf) });
      } catch {
        setFileError("Could not load the sample file.");
      }
    })();
  }, [ext]);

  // Load the selected extension's sample whenever the extension changes.
  React.useEffect(() => {
    loadSample();
  }, [loadSample]);

  const onSelectExt = React.useCallback((next: string) => {
    setExt(next);
    setMode(modesFor(next)[0]); // keep the selected mode valid for the new family
  }, []);

  const onUpload = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      setFileError(null);
      if (!f.name.toLowerCase().endsWith(`.${ext}`)) {
        setFileError(`Please choose a .${ext} file (or switch the tab).`);
        return;
      }
      const buf = await f.arrayBuffer();
      setFile({ name: f.name, bytes: new Uint8Array(buf) });
    },
    [ext]
  );

  const docHtml = useDocumentMarkdown(file);
  const rendered = useRenderedDocument({
    ext,
    file,
    leftScrollRef,
    docxRef,
    pptxHostRef,
    xlsxHostRef,
  });
  const { result, running, runError, chunks, shown } = useChunkRun({
    file,
    method,
    mode,
    params,
    listImages,
  });
  const { activeIdx, setHovered, selectChunk } = useChunkHighlight({
    markdownRef,
    docHtml,
    chunks,
    leftView,
    setLeftView,
  });

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 text-brand" />
        Runs entirely in your browser via WebAssembly — your file never leaves this
        page.
      </div>

      <ExtensionTabs ext={ext} onSelect={onSelectExt} />

      <ConfigPanel
        ext={ext}
        file={file}
        fileError={fileError}
        onUpload={onUpload}
        onLoadSample={loadSample}
        method={method}
        setMethod={setMethod}
        mode={mode}
        setMode={setMode}
        params={params}
        setParams={setParams}
        listImages={listImages}
        setListImages={setListImages}
      />

      {/* Split view — fixed height so each pane scrolls independently */}
      <div className="grid gap-4 lg:h-[74vh] lg:grid-cols-2">
        <DocumentPane
          ext={ext}
          file={file}
          leftView={leftView}
          setLeftView={setLeftView}
          docHtml={docHtml}
          rendered={rendered}
          leftScrollRef={leftScrollRef}
          docxRef={docxRef}
          pptxHostRef={pptxHostRef}
          xlsxHostRef={xlsxHostRef}
          markdownRef={markdownRef}
        />
        <OutputPane
          method={method}
          result={result}
          running={running}
          runError={runError}
          chunks={chunks}
          shown={shown}
          activeIdx={activeIdx}
          onHover={setHovered}
          onSelect={selectChunk}
        />
      </div>
    </div>
  );
}
