// Runner.tsx

import type { DictionaryEntry } from "./models/DictionaryEntry";

type Mode = "lesson" | "review";

interface RunnerProps {
    mode: Mode;
    entries: DictionaryEntry[];
}

export default function Runner(props: RunnerProps) {
  return (
    <div>
      <div>Runner</div>
      <div>{props.mode}</div>
      <div>{props.entries.length} entries loaded</div>
    </div>
  );
}