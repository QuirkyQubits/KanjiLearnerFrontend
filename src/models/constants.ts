// constants.ts
import { EntryType } from "./EntryType";

export const entryTypeColors: Record<EntryType, string> = {
  [EntryType.RADICAL]: "bg-sky-500",
  [EntryType.KANJI]: "bg-pink-600",
  [EntryType.VOCAB]: "bg-purple-600",
};