import { ImageResponse } from "next/og";

import { OgCard, OG_SIZE } from "@/lib/og";

/**
 * Dynamic per-page Open Graph image, driven by query params
 * (`?eyebrow=&title=&subtitle=`). Used for docs pages, which can't colocate an
 * `opengraph-image` file inside the optional catch-all route — `generateMetadata`
 * points at this endpoint instead. Cached hard since the output is a pure
 * function of the query string.
 */
export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "chunk-engine";
  const eyebrow = searchParams.get("eyebrow") ?? undefined;
  const subtitle = searchParams.get("subtitle") ?? undefined;

  return new ImageResponse(
    <OgCard eyebrow={eyebrow} title={title} subtitle={subtitle} />,
    {
      ...OG_SIZE,
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    }
  );
}
