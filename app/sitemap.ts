import type { MetadataRoute } from "next";

import { source } from "@/lib/source";
import { site } from "@/data/site";

const base = site.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const marketing: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/benchmarks`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/playground`, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Deliberately NOT listed: the /md/* routes. They are a raw-markdown mirror
  // of /docs for LLM consumption — llms.txt already promotes them, and putting
  // them in the sitemap would offer search engines a duplicate of every docs
  // page.

  const docs: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    url: `${base}${page.url}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...marketing, ...docs];
}
