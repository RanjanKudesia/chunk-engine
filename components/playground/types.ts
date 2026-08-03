import type { PlaygroundChunk, PlaygroundImage } from "@/lib/playground/engine";

export type { PlaygroundChunk, PlaygroundImage };

export interface PlayFile {
  name: string;
  bytes: Uint8Array;
}

export interface Params {
  windowSize: number;
  overlap: number;
  sentencesPerChunk: number;
  paragraphsPerPage: number;
}

export const DEFAULT_PARAMS: Params = {
  windowSize: 3,
  overlap: 1,
  sentencesPerChunk: 3,
  paragraphsPerPage: 15,
};

export interface RunResult {
  chunks?: PlaygroundChunk[];
  markdown?: string;
  images?: PlaygroundImage[];
  elapsedMs: number;
}

export type LeftView = "document" | "markdown";
