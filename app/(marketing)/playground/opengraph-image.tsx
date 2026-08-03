import { ImageResponse } from "next/og";

import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "chunk-engine playground — chunk a document live in your browser";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Playground"
        title="Chunk a document, live"
        subtitle="Drop in a DOCX, PDF, PPTX, XLSX, HTML, Markdown, TXT, or CSV and watch it become typed chunks — entirely in your browser."
      />
    ),
    { ...OG_SIZE }
  );
}
