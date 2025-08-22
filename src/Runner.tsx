import { useEffect, useReducer } from "react";
import Deque from "denque";
import { api } from "./lib/axios";
import type { DictionaryEntry } from "./models/DictionaryEntry";
import { EntryCard } from "./EntryCard";

export type RunnerMode = "lesson" | "review";

export interface RunnerProps {
  mode: RunnerMode;
  entries: DictionaryEntry[];
  onComplete?: () => void;
}

async function promoteEntry(entryId: number) {
  await api.post("/result/success/", { entry_id: entryId });
}
async function demoteEntry(entryId: number) {
  await api.post("/result/failure/", { entry_id: entryId });
}

interface State {
  queue: Deque<number>;
  flipped: boolean;
  total: number;
}
type Action =
  | { type: "FLIP" }
  | { type: "GRADE_RIGHT" }
  | { type: "GRADE_WRONG"; mode: RunnerMode }
  | { type: "RESET"; size: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FLIP":
      return { ...state, flipped: !state.flipped };
    case "GRADE_RIGHT": {
      const newQueue = new Deque(state.queue.toArray());

      newQueue.shift();

      return { ...state, queue: newQueue, flipped: false };
    }
    case "GRADE_WRONG": {
      const newQueue = new Deque(state.queue.toArray());

      const idx = newQueue.shift();

      if (action.mode === "lesson" && idx !== undefined) {
        newQueue.push(idx);
      }

      return { ...state, queue: newQueue, flipped: false };
    }
    case "RESET": {
      const newQueue = new Deque<number>();

      for (let i = 0; i < action.size; i++) {
        newQueue.push(i);
      }

      return { queue: newQueue, flipped: false, total: action.size };
    }
    default:
      return state;
  }
}

export default function Runner({ mode, entries, onComplete }: RunnerProps) {
  const initialSize = entries.length;
  const [state, dispatch] = useReducer(reducer, {
    queue: new Deque<number>(Array.from({ length: initialSize }, (_, i) => i)),
    flipped: false,
    total: initialSize,
  });

  useEffect(() => {
    dispatch({ type: "RESET", size: entries.length });
  }, [entries]);

  const idx = state.queue.peekFront();
  const currentEntry: DictionaryEntry | null =
    idx === undefined || idx < 0 || idx >= entries.length
      ? null
      : entries[idx];

  const remaining = state.queue.length;
  const completed = state.total - remaining;
  const progress = state.total === 0 ? 0 : Math.round((completed / state.total) * 100);

  useEffect(() => {
    if (remaining === 0) {
      onComplete?.();
    }
  }, [remaining, onComplete]);

  async function handleRight() {
    if (!currentEntry || !state.flipped) {
      return;
    }

    promoteEntry(currentEntry.id).catch((err) => {
      console.error("Failed to promote entry:", err);
    });

    dispatch({ type: "GRADE_RIGHT" });
  }

  async function handleWrong() {
    if (!currentEntry || !state.flipped) {
      return;
    }

    if (mode === "review") {
      demoteEntry(currentEntry.id).catch((err) => {
        console.error("Failed to demote entry:", err);
      });
    }

    dispatch({ type: "GRADE_WRONG", mode });
  }

  if (entries.length === 0) {
    return (
      <div>
        <h3>{mode === "lesson" ? "Lessons" : "Reviews"}</h3>
        <div>No cards to run right now.</div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h3>{mode === "lesson" ? "Lesson Runner" : "Review Runner"}</h3>
        <div>
          Progress: {completed}/{state.total} ({progress}%)
        </div>
      </div>

      {currentEntry && <EntryCard entry={currentEntry} flipped={state.flipped} />}

      <div>
        <button onClick={() => dispatch({ type: "FLIP" })}>
          {state.flipped ? "Hide" : "Flip"}
        </button>
        <button onClick={handleWrong} disabled={!state.flipped}>
          Wrong
        </button>
        <button onClick={handleRight} disabled={!state.flipped}>
          Right
        </button>
      </div>

      <div>Flip to reveal. Then choose Right or Wrong. No undo.</div>
    </div>
  );
}
