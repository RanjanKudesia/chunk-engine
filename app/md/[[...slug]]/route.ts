import { source } from "@/lib/source";
import { getDocMarkdown } from "@/lib/docs-markdown";

/**
 * Raw Markdown for each docs page at `/md/<slug>` — LLM- and tool-friendly,
 * and what the "Copy as Markdown" button links to as "View raw".
 */
export function generateStaticParams() {
  return source.generateParams();
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) return new Response("Not found", { status: 404 });

  const md = getDocMarkdown(slug, {
    title: page.data.title,
    description: page.data.description,
  });
  if (md == null) return new Response("Not found", { status: 404 });

  return new Response(md, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
