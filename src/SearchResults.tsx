import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "./lib/axios";
import { entryTypeColors } from "./models/constants";
import type { EntryType } from "./models/EntryType";
import NavBar from "./NavBar";
import { UserDictionaryEntry } from "./models/UserDictionaryEntry";

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search", q],
    queryFn: async () => {
      const res = await api.get("/search", { params: { q } });
      return res.data.map((d: any) => new UserDictionaryEntry(d));
    },
    enabled: !!q, // only fetch if q is non-empty
  });

  if (!q) return <p>Enter a search term.</p>;
  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Error loading results.</p>;
  if (!data) return null;

  return (
    <div className="min-h-screen max-w-screen bg-emerald-200">
      <NavBar />
      <div className="p-4 mx-6">
        <h2 className="text-lg font-bold mb-2">Search</h2>
        <h2 className="text-lg font-bold mb-2">{data.length} results found for {q}</h2>
        <ul className="">
          {data.map((ude: UserDictionaryEntry) => (
            <li
              key={ude.entry.id}
              className={`p-3 text-stone-100 ${entryTypeColors[ude.entry.entry_type as EntryType] || ""}`}
            >
              <Link
                to={`/dictionary/${encodeURIComponent(ude.entry.id)}`}
                className="block w-full h-full"
              >
                {ude.entry.literal} — {ude.entry.meaning}
                {ude.srs_stage === "LESSON" && <span> 📘 In Lessons</span>}
                {ude.in_plan && <span> ⭐ Planned</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}