export const EntryType = {
  RADICAL: "RADICAL",
  KANJI: "KANJI",
  VOCAB: "VOCAB",
} as const;

export type EntryType = typeof EntryType[keyof typeof EntryType];