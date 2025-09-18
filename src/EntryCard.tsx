import type { DictionaryEntry } from "./models/DictionaryEntry";
import Details from "./Details";
import type { EntryType as EntryTypeT } from "./models/EntryType";
import { EntryType } from "./models/EntryType";

export const typeLabelMap: Record<EntryTypeT, string> = {
  RADICAL: "Radical",
  KANJI: "Kanji",
  VOCAB: "Vocab",
};

export interface EntryCardProps {
  entry: DictionaryEntry;
  flipped: boolean;
}

export function EntryCard({ entry, flipped }: EntryCardProps) {
  // entry.entry_type = EntryType.KANJI; // for debugging

  const typeLabel = typeLabelMap[entry.entry_type];

  const headerStyles: Record<EntryType, string> = {
    [EntryType.RADICAL]: "bg-sky-500 text-stone-100",
    [EntryType.KANJI]: "bg-pink-600 text-stone-100",
    [EntryType.VOCAB]: "bg-purple-600 text-stone-100",
  };

  // console.log(entry.entry_type);

  const renderHeader = () => (
    <div className={`p-8 ${headerStyles[entry.entry_type] || ""} text-center`}>
      <span className="text-9xl text-shadow-sm">{entry.literal}</span>
    </div>
  );

  return (
    <div>
      {!flipped && (
        <div>
          {renderHeader()}

          {entry.isVocab() && entry.parts_of_speech?.length > 0 && (
            <div>{entry.parts_of_speech.join(", ")}</div>
          )}
        </div>
      )}

      {flipped && (
        <div>
          {renderHeader()}

          <div>
            <Details title="Meaning" open={true}>
              <p>{entry.meaning}</p>
            </Details>

            {(entry.kunyomi_readings.length > 0 ||
              entry.onyomi_readings.length > 0 ||
              entry.readings.length > 0) && (
              <Details title="Readings" open={true}>
                <div>
                  {entry.kunyomi_readings.length > 0 && (
                    <div>Kunyomi: {entry.kunyomi_readings.join(", ")}</div>
                  )}
                  {entry.onyomi_readings.length > 0 && (
                    <div>Onyomi: {entry.onyomi_readings.join(", ")}</div>
                  )}
                  {entry.readings.length > 0 && (
                    <div>Other: {entry.readings.join(", ")}</div>
                  )}
                </div>
              </Details>
            )}

            {entry.meaning_mnemonic && (
              <Details title="Meaning mnemonic" open={true}>
                <p>{entry.meaning_mnemonic}</p>
              </Details>
            )}
            {entry.reading_mnemonic && (
              <Details title="Reading mnemonic" open={true}>
                <p>{entry.reading_mnemonic}</p>
              </Details>
            )}

            {entry.constituents?.length > 0 && (
              <Details title="Constituents">
                <ul>
                  {entry.constituents.map((c) => (
                    <li key={c.id}>
                      {c.literal} - {c.meaning}
                    </li>
                  ))}
                </ul>
              </Details>
            )}

            {entry.explanation && (
              <Details title="Explanation">
                <p>{entry.explanation}</p>
              </Details>
            )}

            {entry.audio && (
              <Details title="Audio">
                <audio controls src={entry.audio} />
              </Details>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
