import { SRSStage } from "./SRSStage";
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
  readings: string[];
  entry_type: EntryType;
  level: number;
  priority: number;
  constituents: Constituent[];
  srs_stage: SRSStage;
  next_review_at: string | null;
  unlocked: boolean;
  meaning_mnemonic: string;
  reading_mnemonic: string;
  parts_of_speech: string[];
  explanation: string;
  audio: string | null;
}

export class DictionaryEntry {
  id: number;
  literal: string;
  meaning: string;
  kunyomi_readings: string[];
  onyomi_readings: string[];
  readings: string[];
  entry_type: EntryType;
  level: number;
  priority: number;
  constituents: Constituent[];
  srs_stage: SRSStage;
  next_review_at: Date | null;
  unlocked: boolean;
  meaning_mnemonic: string;
  reading_mnemonic: string;
  parts_of_speech: string[];
  explanation: string;
  audio: string | null;

  constructor(data: DictionaryEntryData) {
    this.id = data.id;
    this.literal = data.literal;
    this.meaning = data.meaning;
    this.kunyomi_readings = data.kunyomi_readings;
    this.onyomi_readings = data.onyomi_readings;
    this.readings = data.readings;
    this.entry_type = data.entry_type;
    this.level = data.level;
    this.priority = data.priority;
    this.constituents = data.constituents;
    this.srs_stage = data.srs_stage;
    this.next_review_at = data.next_review_at ? new Date(data.next_review_at) : null;
    this.unlocked = data.unlocked;
    this.meaning_mnemonic = data.meaning_mnemonic;
    this.reading_mnemonic = data.reading_mnemonic;
    this.parts_of_speech = data.parts_of_speech;
    this.explanation = data.explanation;
    this.audio = data.audio;
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

  isLesson(): boolean {
    return this.srs_stage === SRSStage.LESSON;
  }
}