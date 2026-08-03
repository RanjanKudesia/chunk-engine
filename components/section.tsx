import * as React from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

interface SectionProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Small monospace label above the title. */
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Center the header block (default) or left-align it. */
  align?: "center" | "left";
  /** Heading tag for the title. Use "h1" on a page's first/primary section. */
  titleAs?: "h1" | "h2";
  containerClassName?: string;
}

/**
 * Reusable landing section shell: consistent vertical rhythm, max width, and
 * an optional eyebrow / title / description header used across the page.
 */
export function Section({
  eyebrow,
  title,
  description,
  align = "center",
  titleAs: TitleTag = "h2",
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  const hasHeader = eyebrow || title || description;
  return (
    <section
      className={cn("py-20 sm:py-28", className)}
      {...props}
    >
      <div className={cn("mx-auto max-w-6xl px-4 sm:px-6", containerClassName)}>
        {hasHeader ? (
          <Reveal
            className={cn(
              "max-w-2xl",
              align === "center" && "mx-auto text-center"
            )}
          >
            {eyebrow ? (
              <p className="font-mono text-xs font-medium uppercase tracking-widest text-brand">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <TitleTag className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {title}
              </TitleTag>
            ) : null}
            {description ? (
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                {description}
              </p>
            ) : null}
          </Reveal>
        ) : null}
        {children ? (
          <Reveal
            delay={hasHeader ? 0.1 : 0}
            className={cn(hasHeader && "mt-12 sm:mt-16")}
          >
            {children}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
