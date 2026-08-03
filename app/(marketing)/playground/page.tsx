import type { Metadata } from "next";

import { Section } from "@/components/section";
import { PlaygroundClient } from "@/components/playground/playground-client";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Chunk a document live in your browser with js-chunks — pick a mode and parameters, and watch the typed chunks and metadata update in real time. Nothing is uploaded.",
};

export default function PlaygroundPage() {
  return (
    <Section
      eyebrow="Playground"
      title="Chunk a document, live"
      titleAs="h1"
      description="Drop in a document — DOCX, PDF, PPTX, XLSX, HTML, Markdown, TXT, or CSV — or use a sample, choose a method, mode, and parameters, and watch js-chunks turn it into typed chunks — running entirely in your browser."
      align="left"
      containerClassName="max-w-6xl"
    >
      <PlaygroundClient />
    </Section>
  );
}
