import { highlight } from "@/lib/highlighter";
import { languageList } from "@/data/languages";
import { samples } from "@/data/samples";
import { LangSwitchView, type LangItem } from "@/components/lang-switch-view";

/**
 * Server component: looks up a keyed multi-language sample, highlights each
 * dialect with Shiki, and hands the pre-rendered HTML to the client switcher.
 * Use in landing sections and (via MDX mapping) in docs.
 *
 * Samples are `Partial` by language on purpose — some operations only exist in
 * one or two SDKs (`Blob` input is JS-only; `UploadFile` is Python-only). We
 * render the tabs a sample actually defines rather than throwing on the gap;
 * `LangSwitchView` falls back to the first tab when the reader's language is
 * not among them.
 */
export async function LangCode({ id }: { id: keyof typeof samples }) {
  const sample = samples[id];
  if (!sample) {
    throw new Error(`Unknown code sample: ${String(id)}`);
  }

  const present = languageList.filter((lang) => sample[lang.id]);
  if (present.length === 0) {
    throw new Error(`Code sample has no languages: ${String(id)}`);
  }

  const items: LangItem[] = await Promise.all(
    present.map(async (lang) => {
      const snippet = sample[lang.id]!;
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
