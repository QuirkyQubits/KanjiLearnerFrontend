export const EntryType = {
  RADICAL: "RADICAL",
  KANJI: "KANJI",
  VOCAB: "VOCAB",
}

export type EntryType = typeof EntryType[keyof typeof EntryType];