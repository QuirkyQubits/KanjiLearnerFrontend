import { EntryType } from "./EntryType";

export const entryTypeColors: Record<EntryType, string> = {
  [EntryType.RADICAL]: "bg-sky-500",
  [EntryType.KANJI]: "bg-pink-600",
  [EntryType.VOCAB]: "bg-purple-600",
};

// Special case: reading highlight
export const readingColor = "bg-yellow-400 text-black";