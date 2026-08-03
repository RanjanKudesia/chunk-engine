import { ImageResponse } from "next/og";

import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "chunk-engine benchmarks — measured, not claimed";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Benchmarks"
        title="Measured, not claimed"
        subtitle="446 real files across all 36 formats — coverage, structure integrity, and speed vs Docling and Unstructured."
      />
    ),
    { ...OG_SIZE }
  );
}
