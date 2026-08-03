import Link from "next/link";

import { site } from "@/data/site";
import { languageList } from "@/data/languages";
import { Logo } from "@/components/logo";
import { GitHubIcon } from "@/components/icons";

const footerNav = [
  {
    heading: "Product",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Benchmarks", href: "/benchmarks" },
      { label: "Supported formats", href: "/docs/supported-formats" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Quick start", href: "/docs/quick-start" },
      { label: "API reference", href: "/docs/api-reference" },
      { label: "Chunking modes", href: "/docs/chunking-modes" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground">
              {site.description}
            </p>
            <a
              href={site.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="mt-4 inline-flex text-muted-foreground transition-colors hover:text-foreground"
            >
              <GitHubIcon className="size-5" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-16">
            {footerNav.map((col) => (
              <div key={col.heading}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  {col.heading}
                </h3>
                <ul className="mt-3 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Packages — the three SDKs */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Packages
              </h3>
              <ul className="mt-3 space-y-2">
                {languageList.map((l) => (
                  <li key={l.id}>
                    <a
                      href={l.registryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span className="font-mono">{l.pkg}</span>
                      <span className="ml-1.5 text-xs text-muted-foreground/70">
                        {l.registry}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            One <span className="font-mono text-brand">Rust</span> engine · three
            languages · MIT licensed
          </p>
          <p className="font-mono">© {new Date().getFullYear()} chunk-engine</p>
        </div>
      </div>
    </footer>
  );
}
