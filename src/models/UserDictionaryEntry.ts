// models/UserDictionaryEntry.ts
import { DictionaryEntry } from "./DictionaryEntry";
import { SRSStage } from "./SRSStage";

export interface UserDictionaryEntryData {
  entry: any; // raw dictionary entry JSON
  srs_stage: SRSStage | null;
  unlocked_at: string | null;
  next_review_at: string | null;
  in_plan: boolean;
}

export class UserDictionaryEntry {
  entry: DictionaryEntry;
  srs_stage: SRSStage | null;
  unlocked_at: Date | null;
  next_review_at: Date | null;
  in_plan: boolean;

  constructor(data: UserDictionaryEntryData) {
    this.entry = new DictionaryEntry(data.entry);
    this.srs_stage = data.srs_stage;
    this.unlocked_at = data.unlocked_at ? new Date(data.unlocked_at) : null;
    this.next_review_at = data.next_review_at ? new Date(data.next_review_at) : null;
    this.in_plan = data.in_plan;
  }

  isLesson(): boolean {
    return this.srs_stage === SRSStage.LESSON;
  }
}