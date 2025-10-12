import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { entryTypeColors } from "../models/EntryTypeColors";
import type { EntryType } from "../models/EntryType";
import NavBar from "./NavBar";
import { UserDictionaryEntry } from "../models/UserDictionaryEntry";
import { useEffect } from "react";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("page_size") || "100", 10);

  const goToPage = (newPage: number) => {
    setSearchParams({
        q,
        page: String(newPage),
        page_size: searchParams.get("page_size") || "100", // preserve or default
      });
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search", q, page],
    queryFn: async () => {
      const res = await api.get("/search", {
        params: { q, page, page_size: pageSize },
      });
      return {
        ...res.data,
        results: res.data.results.map((d: any) => new UserDictionaryEntry(d)),
      };
    },
    enabled: !!q, // only fetch if q is non-empty
  });

  useEffect(() => {
    // If q exists but page/page_size are missing, set them
    if (q) {
      const params: Record<string, string> = { q };

      if (!searchParams.get("page")) {
        params.page = "1";
      } else {
        params.page = searchParams.get("page")!;
      }

      if (!searchParams.get("page_size")) {
        params.page_size = "100";
      } else {
        params.page_size = searchParams.get("page_size")!;
      }

      setSearchParams(params);
    }
  }, [q, searchParams, setSearchParams]);
  
  if (!q) return <p>Enter a search term.</p>;
  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Error loading results.</p>;
  if (!data) return null;

  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = startIndex + data.results.length - 1;

  // console.log("q:", q, "page:", page, "page_size:", pageSize);

  return (
    <div className="min-h-screen max-w-screen bg-background-light">
      <NavBar />
      <div className="p-4 mx-6">
        <h2 className="text-lg font-bold mb-2 text-text">Search</h2>
        <h2 className="text-lg font-bold mb-2 text-text">
          Page {page}, results {startIndex}-{endIndex} out of {data.count} for "{q}"
        </h2>
        <ul className="">
          {data.results.map((ude: UserDictionaryEntry) => (
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

        <div className="mt-4 flex gap-2">
          <button
            className="px-3 py-1 rounded bg-background hover:bg-background-dark p-3 text-text"
            disabled={!data.previous}
            onClick={() => goToPage(page - 1)}
          >
            Previous
          </button>
          <button
            className="px-3 py-1 rounded bg-background hover:bg-background-dark p-3 text-text"
            disabled={!data.next}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}