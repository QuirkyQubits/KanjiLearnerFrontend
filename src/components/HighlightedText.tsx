import { entryTypeColors, readingColor } from "../models/EntryTypeColors";
import { EntryType } from "../models/EntryType";

const highlightMap: Record<string, string> = {
  radical: `${entryTypeColors[EntryType.RADICAL]} text-white px-1 rounded`,
  kanji: `${entryTypeColors[EntryType.KANJI]} text-white px-1 rounded`,
  vocab: `${entryTypeColors[EntryType.VOCAB]} text-white px-1 rounded`,
  reading: `${readingColor} px-1 rounded`,
};

export function HighlightedText({ text }: { text: string }) {
  const regex = /<\/?[^>]+>|[^<]+/g; // match <radical>, </radical>, etc.
  const tokens = text.match(regex) || [];

  let activeTag: string | null = null;

  return (
    <>
      {tokens.map((token, i) => {
        const open = token.match(/^<([^/]+)>$/);     // <radical>
        const close = token.match(/^<\/([^>]+)>$/);  // </radical>

        if (open) {
          activeTag = open[1].toLowerCase(); // normalize for safety
          return null;
        }
        if (close) {
          activeTag = null;
          return null;
        }

        if (activeTag && highlightMap[activeTag]) {
          return (
            <span key={i} className={highlightMap[activeTag]}>
              {token}
            </span>
          );
        }

        return <span key={i}>{token}</span>;
      })}
    </>
  );
}
