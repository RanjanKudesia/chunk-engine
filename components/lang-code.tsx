import { highlight } from "@/lib/highlighter";
import { languageList } from "@/data/languages";
import { samples } from "@/data/samples";
import { LangSwitchView, type LangItem } from "@/components/lang-switch-view";

/**
 * Server component: looks up a keyed multi-language sample, highlights each
 * dialect with Shiki, and hands the pre-rendered HTML to the client switcher.
 * Use in landing sections and (via MDX mapping) in docs.
 */
export async function LangCode({ id }: { id: keyof typeof samples }) {
  const sample = samples[id];
  if (!sample) {
    throw new Error(`Unknown code sample: ${String(id)}`);
  }

  const items: LangItem[] = await Promise.all(
    languageList.map(async (lang) => {
      const snippet = sample[lang.id];
      return {
        id: lang.id,
        filename: snippet.filename,
        code: snippet.code.trim(),
        html: await highlight(snippet.code.trim(), lang.shiki),
      };
    })
  );

  return <LangSwitchView items={items} />;
}
