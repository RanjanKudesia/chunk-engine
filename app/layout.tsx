import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import "./globals.css";

import { site } from "@/data/site";
import { languageList } from "@/data/languages";
import { LanguageProvider } from "@/components/language-context";
import { SiteHeader } from "@/components/site-header";

const SITE_URL = site.url;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: "Ranjan Kudesia", url: site.links.author }],
  creator: "Ranjan Kudesia",
  publisher: site.name,
  category: "technology",
  keywords: [
    "chunk-engine",
    "document chunking",
    "chunking",
    "RAG",
    "retrieval augmented generation",
    "text splitter",
    "PDF chunking",
    "DOCX chunking",
    "PPTX chunking",
    "spreadsheet chunking",
    "embeddings",
    "vector database",
    "LLM",
    "Rust",
    "Python",
    "JavaScript",
    "WebAssembly",
    "py-chunks",
    "js-chunks",
    "rs-chunks",
  ],
  // No site-wide canonical here — a root-layout `alternates.canonical` would
  // stamp every page as a duplicate of the homepage. Each page declares its own
  // (marketing pages in their metadata exports; docs in generateMetadata),
  // resolved against `metadataBase` above.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: site.name,
    locale: "en_US",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
};

/** Structured data (schema.org) — helps both classic SEO rich results and
 * answer engines (AEO: ChatGPT, Perplexity, Google AI Overviews) understand
 * what chunk-engine is. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: site.name,
      url: SITE_URL,
      description: site.description,
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      name: site.name,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Cross-platform (Python, Node.js, browser, Rust)",
      description: site.description,
      url: SITE_URL,
      softwareVersion: "0.6.0",
      programmingLanguage: languageList.map((l) => l.label),
      downloadUrl: languageList.map((l) => l.registryUrl),
      license: "https://opensource.org/licenses/MIT",
      codeRepository: site.links.github,
      sameAs: [site.links.github, ...languageList.map((l) => l.github)],
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: {
        "@type": "Person",
        name: "Ranjan Kudesia",
        url: site.links.author,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Fumadocs RootProvider owns theming (next-themes, class strategy) and
            the docs search dialog — dark is our default. */}
        <RootProvider
          theme={{ defaultTheme: "dark", enableSystem: true }}
        >
          <LanguageProvider>
            {/* Global top navbar on every page — marketing AND docs. */}
            <SiteHeader />
            {children}
          </LanguageProvider>
        </RootProvider>
      </body>
    </html>
  );
}
