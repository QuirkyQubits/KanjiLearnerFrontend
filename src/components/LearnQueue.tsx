import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { UserDictionaryEntry } from "../models/UserDictionaryEntry";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";
import { entryTypeColors } from "../models/EntryTypeColors";
import type { EntryType } from "../models/EntryType";

export default function LearnQueuePage() {
  const { data, isLoading, isError } = useQuery<UserDictionaryEntry[]>({
    queryKey: ["learn-queue"],
    queryFn: async () => {
      const res = await api.get("/planned");
      return res.data.map((d: any) => new UserDictionaryEntry(d));
    },
  });

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Error loading learn queue</p>;
  if (!data || data.length === 0)
    return (
      <div className="min-h-screen bg-emerald-200">
        <NavBar />
        <div className="p-4 mx-6">
          <h2 className="text-lg font-bold mb-2">📚 Learn Queue</h2>
          <p>No items in your learn queue 🎉</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen max-w-screen bg-background-light">
      <NavBar />
      <div className="p-4 mx-6">
        <h2 className="text-lg font-bold mb-2 text-text">📚 Learn Queue</h2>
        <h2 className="text-lg text-text font-bold mb-2">
          {data.length} item{data.length > 1 ? "s" : ""} in queue
        </h2>
        <ul>
          {data.map((ude: UserDictionaryEntry) => (
            <li
              key={ude.entry.id}
              className={`p-3 text-stone-100 ${
                entryTypeColors[ude.entry.entry_type as EntryType] || ""
              }`}
            >
              <Link
                to={`/dictionary/${encodeURIComponent(ude.entry.id)}`}
                className="block w-full h-full"
              >
                {ude.entry.literal} — {ude.entry.meaning}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
