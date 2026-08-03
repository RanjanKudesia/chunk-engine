import { SiteFooter } from "@/components/site-footer";

/** Marketing chrome — the global SiteHeader lives in the root layout; this
 * adds the main content region and footer for the non-docs pages. */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
