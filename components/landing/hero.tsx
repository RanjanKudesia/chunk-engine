import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

import { site } from "@/data/site";
import { languageList } from "@/data/languages";
import { Button } from "@/components/ui/button";
import { InstallTabs } from "@/components/install-tabs";
import { LangCode } from "@/components/lang-code";
import { GitHubIcon } from "@/components/icons";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted-foreground">
            <Zap className="size-3 text-brand" />
            One Rust engine · 3 languages · 36 formats
          </span>

          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            One chunking engine.
            <br />
            <span className="text-gradient-brand">
              Python, JavaScript, Rust.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
            A fast, high-fidelity document chunking engine for RAG. 36 formats,
            one Rust core — with byte-identical bindings for Python, JavaScript,
            and Rust.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={site.links.docs}>
                Read the docs <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={site.links.github} target="_blank" rel="noreferrer">
                <GitHubIcon className="size-4" /> GitHub
              </a>
            </Button>
          </div>

          <div className="mt-8 flex justify-center">
            <InstallTabs />
          </div>

          <p className="mt-3 font-mono text-xs text-muted-foreground">
            {languageList.map((l) => l.pkg).join(" · ")}
          </p>
        </div>

        {/* Hero code window — follows the selected language */}
        <div className="mx-auto mt-14 max-w-3xl">
          <LangCode id="hero" />
        </div>
      </div>
    </section>
  );
}
