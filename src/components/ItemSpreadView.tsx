import { entryTypeColors } from "../models/EntryTypeColors";
import { EntryType } from "../models/EntryType";

interface ItemSpread {
  apprentice: { radicals: number; kanji: number; vocab: number };
  guru: { radicals: number; kanji: number; vocab: number };
  master: { radicals: number; kanji: number; vocab: number };
  enlightened: { radicals: number; kanji: number; vocab: number };
  burned: { radicals: number; kanji: number; vocab: number };
}

interface ItemSpreadViewProps {
  itemSpread: ItemSpread;
}

const STAGE_LABELS: Record<keyof ItemSpread, string> = {
  apprentice: "Apprentice",
  guru: "Guru",
  master: "Master",
  enlightened: "Enlightened",
  burned: "Burned",
};

export default function ItemSpreadView({ itemSpread }: ItemSpreadViewProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg shadow-md w-full">
      {/* Header row with legend */}
      <div className="flex justify-between items-center p-3 rounded-lg bg-background-dark shadow-sm">
        <span className="font-bold text-base sm:text-lg">Item Spread</span>

        {/* Legend */}
        <div className="itemspread-legend flex items-center gap-2 text-sm font-medium">
          <span className={`${entryTypeColors[EntryType.RADICAL]} text-text px-2 py-1 rounded`}>
            幺
          </span>
          <span>Radicals</span>

          <span className={`${entryTypeColors[EntryType.KANJI]} text-text px-2 py-1 rounded`}>
            字
          </span>
          <span>Kanji</span>

          <span className={`${entryTypeColors[EntryType.VOCAB]} text-text px-2 py-1 rounded`}>
            語
          </span>
          <span>Vocabulary</span>
        </div>
      </div>

      {/* SRS Stage Rows */}
      {Object.entries(itemSpread).map(([stageKey, counts]) => {
        const stage = stageKey as keyof ItemSpread;
        return (
          <div
            key={stage}
            className="flex justify-between items-center p-3 rounded-lg bg-background-light shadow-sm"
          >
            {/* Stage name */}
            <span className="font-semibold text-sm sm:text-base">
              {STAGE_LABELS[stage]}
            </span>

            {/* Inner flexbox for radicals / kanji / vocab counts */}
            <div className="flex gap-2">
              <div
                className={`${entryTypeColors[EntryType.RADICAL]} text-text px-3 py-1 rounded text-sm font-bold`}
                title="Radicals"
              >
                {counts.radicals}
              </div>
              <div
                className={`${entryTypeColors[EntryType.KANJI]} text-text px-3 py-1 rounded text-sm font-bold`}
                title="Kanji"
              >
                {counts.kanji}
              </div>
              <div
                className={`${entryTypeColors[EntryType.VOCAB]} text-text px-3 py-1 rounded text-sm font-bold`}
                title="Vocabulary"
              >
                {counts.vocab}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}