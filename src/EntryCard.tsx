import type { DictionaryEntry } from "./models/DictionaryEntry";
import Details from "./Details";
import type { EntryType as EntryTypeT } from "./models/EntryType";
import { EntryType } from "./models/EntryType";
import { entryTypeColors } from "./models/constants";
import { Link } from "react-router-dom";
import type { UserDictionaryEntry } from "./models/UserDictionaryEntry";

export const typeLabelMap: Record<EntryTypeT, string> = {
  RADICAL: "Radical",
  KANJI: "Kanji",
  VOCAB: "Vocab",
};

export interface EntryCardProps {
  ude: UserDictionaryEntry;
  flipped: boolean;
}

export function EntryCard({ ude, flipped }: EntryCardProps) {
  // entry.entry_type = EntryType.KANJI; // for debugging

  const entry = ude.entry;  // convenience alias
  const typeLabel = typeLabelMap[entry.entry_type];

  // console.log(entry.entry_type);

  const renderHeader = () => (
    <div className={`p-8 text-stone-100 ${entryTypeColors[entry.entry_type] || ""} text-center`}>
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
              <Details title="Constituents" open={true}>
                <ul className="flex flex-wrap gap-2">
                  {entry.constituents.map((c) => (
                    <li key={c.id} className={`inline-block p-3 text-stone-100 ${entryTypeColors[c.entry_type as EntryType] || ""}`}>
                      <Link to={`/dictionary/${c.id}`} className="block">
                        {c.literal} - {c.meaning}
                      </Link>
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
