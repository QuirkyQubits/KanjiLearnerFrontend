import Details from "./Details";
import type { EntryType as EntryTypeT } from "../models/EntryType";
import { EntryType } from "../models/EntryType";
import { entryTypeColors } from "../models/EntryTypeColors";
import { Link } from "react-router-dom";
import type { UserDictionaryEntry } from "../models/UserDictionaryEntry";
import { PitchGraph } from "./PitchGraph";
import { srsStageDisplayMap } from "../models/SRSStage";
import { HighlightedText } from "./HighlightedText";

export const typeLabelMap: Record<EntryTypeT, string> = {
  RADICAL: "Radical",
  KANJI: "Kanji",
  VOCAB: "Vocab",
};

export interface EntryCardProps {
  ude: UserDictionaryEntry;
  flipped: boolean;
  showSrsStageOpen?: boolean;
}

export function EntryCard({ ude, flipped, showSrsStageOpen = false }: EntryCardProps) {
  // entry.entry_type = EntryType.KANJI; // for debugging

  const entry = ude.entry;

  const renderHeader = () => (
    <div
      className={`p-8 text-stone-100 ${
        entryTypeColors[entry.entry_type] || ""
      } text-center`}
    >
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

          <div className="px-8 py-4">
            <Details title="Meaning" open={true}>
              <p>{entry.meaning}</p>
            </Details>

            {(entry.kunyomi_readings.length > 0 ||
              entry.onyomi_readings.length > 0 ||
              entry.reading) && (
              <Details title="Readings" open={true}>
                <div>
                  {entry.kunyomi_readings.length > 0 && (
                    <div>Kunyomi: {entry.kunyomi_readings.join(", ")}</div>
                  )}
                  {entry.onyomi_readings.length > 0 && (
                    <div>Onyomi: {entry.onyomi_readings.join(", ")}</div>
                  )}
                  {entry.reading && <div>Reading: {entry.reading}</div>}
                </div>
              </Details>
            )}

            {entry.meaning_mnemonic && (
              <Details title="Meaning mnemonic" open={true}>
                <HighlightedText text={entry.meaning_mnemonic} />
              </Details>
            )}
            {entry.reading_mnemonic && (
              <Details title="Reading mnemonic" open={true}>
                <HighlightedText text={entry.reading_mnemonic} />
              </Details>
            )}

            {entry.constituents?.length > 0 && (
              <Details title="Constituents" open={true}>
                <ul className="flex flex-wrap gap-2">
                  {entry.constituents.map((c) => (
                    <li
                      key={`constituents-${c.id}`}
                      className={`inline-block p-3 text-stone-100 ${
                        entryTypeColors[c.entry_type as EntryType] || ""
                      }`}
                    >
                      <Link to={`/dictionary/${c.id}`} className="block">
                        {c.literal} - {c.meaning}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Details>
            )}

            {entry.explanation && (
              <Details title="Explanation" open={true}>
                <HighlightedText text={entry.explanation} />
              </Details>
            )}

            {entry.audio && (
              <Details title="Audio">
                <audio controls src={entry.audio} />
              </Details>
            )}

            {entry.isVocab() && entry.pitch_graphs?.length > 0 && (
              <Details title="Pitch Accent" open={true}>
                <div className="flex flex-col gap-4">
                  {entry.pitch_graphs.map((graph, idx) => (
                    <PitchGraph key={idx} reading={entry.reading} pattern={graph} />
                  ))}
                </div>
              </Details>
            )}

            {entry.used_in?.length > 0 && (
              <>
                <Details title="Used In" open={true}>
                  <ul className="flex flex-wrap gap-2">
                    {entry.used_in.map((u) => (
                      <li
                        key={`used_in-${u.id}`}
                        className={`inline-block p-3 text-stone-100 ${
                          entryTypeColors[u.entry_type as EntryType] || ""
                        }`}
                      >
                        <Link to={`/dictionary/${u.id}`} className="block">
                          {u.literal} - {u.meaning}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Details>
              </>
            )}

            {entry.visually_similar?.length > 0 && (
              <>
                <Details title="Visually Similar" open={true}>
                  <ul className="flex flex-wrap gap-2">
                    {entry.visually_similar.map((v) => (
                      <li
                        key={`visually_similar-${v.id}`}
                        className={`inline-block p-3 text-stone-100 ${
                          entryTypeColors[v.entry_type as EntryType] || ""
                        }`}
                      >
                        <Link to={`/dictionary/${v.id}`} className="block">
                          {v.literal} - {v.meaning}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Details>
              </>
            )}

            <Details title="SRS Stage" open={showSrsStageOpen}>
              <p>{srsStageDisplayMap[ude.srs_stage]}</p>
            </Details>

            <Details title="Next Review" open={false}>
              <p>
                {ude.next_review_at
                  ? new Date(ude.next_review_at).toLocaleString()
                  : "No review scheduled"}
              </p>
            </Details>
          </div>
        </div>
      )}
    </div>
  );
}
