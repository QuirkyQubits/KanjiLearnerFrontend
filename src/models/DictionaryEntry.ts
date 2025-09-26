import { EntryType } from "./EntryType";

export interface Constituent {
  id: number;
  literal: string;
  meaning: string;
  entry_type: EntryType;
}

export interface DictionaryEntryData {
  id: number;
  literal: string;
  meaning: string;
  kunyomi_readings: string[];
  onyomi_readings: string[];
  reading: string;
  entry_type: EntryType;
  level: number;
  priority: number;
  constituents: Constituent[];
  meaning_mnemonic: string;
  reading_mnemonic: string;
  parts_of_speech: string[];
  explanation: string;
  audio: string | null;
  pitch_graphs: string[][];
  visually_similar: Constituent[];
  used_in: Constituent[];
}

export class DictionaryEntry {
  id: number;
  literal: string;
  meaning: string;
  kunyomi_readings: string[];
  onyomi_readings: string[];
  reading: string;
  entry_type: EntryType;
  level: number;
  priority: number;
  constituents: Constituent[];
  meaning_mnemonic: string;
  reading_mnemonic: string;
  parts_of_speech: string[];
  explanation: string;
  audio: string | null;
  pitch_graphs: string[][];
  visually_similar: Constituent[];
  used_in: Constituent[];

  constructor(data: DictionaryEntryData) {
    this.id = data.id;
    this.literal = data.literal;
    this.meaning = data.meaning;
    this.kunyomi_readings = data.kunyomi_readings;
    this.onyomi_readings = data.onyomi_readings;
    this.reading = data.reading;
    this.entry_type = data.entry_type;
    this.level = data.level;
    this.priority = data.priority;
    this.constituents = data.constituents;
    this.meaning_mnemonic = data.meaning_mnemonic;
    this.reading_mnemonic = data.reading_mnemonic;
    this.parts_of_speech = data.parts_of_speech;
    this.explanation = data.explanation;
    this.audio = data.audio;
    this.pitch_graphs = data.pitch_graphs || [];
    this.visually_similar = data.visually_similar || [];
    this.used_in = data.used_in || [];
  }

  isRadical(): boolean {
    return this.entry_type === EntryType.RADICAL;
  }

  isKanji(): boolean {
    return this.entry_type === EntryType.KANJI;
  }

  isVocab(): boolean {
    return this.entry_type === EntryType.VOCAB;
  }

  hasAudio(): boolean {
    return !!this.audio;
  }
}