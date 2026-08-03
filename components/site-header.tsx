"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="chunk-engine home"
          className="shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <LanguageSwitcher className="mr-1 hidden lg:inline-flex" />
          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
            <a href={site.links.github} target="_blank" rel="noreferrer" aria-label="GitHub repository">
              <GitHubIcon className="size-4" />
            </a>
          </Button>
          <ThemeToggle />
          <Button asChild size="sm" className="ml-1 hidden lg:inline-flex">
            <Link href={site.links.docs}>Get started</Link>
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border/60 md:hidden",
          open ? "max-h-80" : "max-h-0 border-t-0"
        )}
      >
        <nav className="mx-auto flex max-w-[1600px] flex-col gap-1 px-4 py-3 sm:px-6">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.links.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <GitHubIcon className="size-4" /> GitHub
          </a>
          <div className="px-3 py-2">
            <LanguageSwitcher />
          </div>
          <Button asChild size="sm" className="mt-2">
            <Link href={site.links.docs} onClick={() => setOpen(false)}>
              Get started
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
