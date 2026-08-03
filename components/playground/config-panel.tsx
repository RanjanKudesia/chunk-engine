"use client";

import * as React from "react";
import { Upload, RotateCcw } from "lucide-react";

import { methods, modesFor, paramMeta, paramUsage, type Method } from "@/data/playground";
import { cn } from "@/lib/utils";
import type { PlayFile, Params } from "@/components/playground/types";

interface ConfigPanelProps {
  ext: string;
  file: PlayFile | null;
  fileError: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadSample: () => void;
  method: Method;
  setMethod: (m: Method) => void;
  mode: string;
  setMode: (m: string) => void;
  params: Params;
  setParams: React.Dispatch<React.SetStateAction<Params>>;
  listImages: boolean;
  setListImages: (v: boolean) => void;
}

export function ConfigPanel({
  ext,
  file,
  fileError,
  onUpload,
  onLoadSample,
  method,
  setMethod,
  mode,
  setMode,
  params,
  setParams,
  listImages,
  setListImages,
}: Readonly<ConfigPanelProps>) {
  const paramsDisabled = method === "markdown";

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-4">
      {/* File row */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm transition-colors hover:text-foreground">
          <Upload className="size-4" />
          Upload .{ext}
          <input
            type="file"
            accept={`.${ext}`}
            className="hidden"
            onChange={onUpload}
          />
        </label>
        <button
          type="button"
          onClick={onLoadSample}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="size-3.5" />
          Sample
        </button>
        {file ? (
          <span className="font-mono text-xs text-muted-foreground">
            {file.name}{" "}
            <span className="text-muted-foreground/60">
              ({(file.bytes.length / 1024).toFixed(0)} KB)
            </span>
          </span>
        ) : null}
        {fileError ? <span className="text-xs text-red-500">{fileError}</span> : null}
      </div>

      {/* Method */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="w-16 font-mono text-xs text-muted-foreground">method</span>
        <div className="inline-flex rounded-lg border border-border bg-surface-2 p-0.5">
          {methods.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              title={m.hint}
              className={cn(
                "rounded-md px-2.5 py-1 font-mono text-xs transition-colors",
                method === m.id
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <label className="ml-auto inline-flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={listImages}
            onChange={(e) => setListImages(e.target.checked)}
            className="accent-brand"
          />
          listImages
        </label>
      </div>

      {/* Mode */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="w-16 font-mono text-xs text-muted-foreground">mode</span>
        <div className="flex flex-wrap gap-1.5">
          {modesFor(ext).map((m) => (
            <button
              key={m}
              type="button"
              disabled={paramsDisabled}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-md px-2 py-1 font-mono text-xs transition-colors",
                paramsDisabled
                  ? "cursor-not-allowed text-muted-foreground/40"
                  : mode === m
                    ? "bg-brand/10 text-brand ring-1 ring-inset ring-brand/25"
                    : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Params */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="w-16 font-mono text-xs text-muted-foreground">params</span>
        {paramMeta.map((p) => {
          const activeForMode = paramUsage[mode]?.includes(p.key);
          return (
            <label
              key={p.key}
              title={
                activeForMode ? `Used by ${mode} mode` : "Not used by the selected mode"
              }
              className={cn(
                "inline-flex items-center gap-1.5 font-mono text-xs",
                paramsDisabled || !activeForMode
                  ? "text-muted-foreground/50"
                  : "text-foreground"
              )}
            >
              {p.label}
              <input
                type="number"
                min={p.min}
                disabled={paramsDisabled}
                value={params[p.key]}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    [p.key]: Math.max(p.min, Number(e.target.value) || p.min),
                  }))
                }
                className="w-16 rounded-md border border-border bg-surface-2 px-2 py-1 text-foreground disabled:opacity-40"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
