import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";

import { source } from "@/lib/source";
import { getMDXComponents } from "@/components/mdx";
import { getDocMarkdown } from "@/lib/docs-markdown";
import { CopyMarkdownButton } from "@/components/copy-markdown-button";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdown = getDocMarkdown(params.slug, {
    title: page.data.title,
    description: page.data.description,
  });
  const slugPath = params.slug?.length ? `/${params.slug.join("/")}` : "";
  const rawHref = `/md${slugPath}`;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      {markdown ? (
        <CopyMarkdownButton markdown={markdown} rawHref={rawHref} />
      ) : null}
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const ogParams = new URLSearchParams({ eyebrow: "Docs", title: page.data.title });
  if (page.data.description) ogParams.set("subtitle", page.data.description);
  const ogImage = `/api/og?${ogParams.toString()}`;

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: page.url },
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description,
      images: [ogImage],
    },
  };
}
