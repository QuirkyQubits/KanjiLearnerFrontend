import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { EntryCard } from "./EntryCard";
import NavBar from "./NavBar";
import { UserDictionaryEntry } from "../models/UserDictionaryEntry";
import { SRSStage } from "../models/SRSStage";


function isLearningStage(stage: SRSStage | null): boolean {
  return stage !== null && ([
    SRSStage.APPRENTICE_1,
    SRSStage.APPRENTICE_2,
    SRSStage.APPRENTICE_3,
    SRSStage.APPRENTICE_4,
    SRSStage.GURU_1,
    SRSStage.GURU_2,
    SRSStage.MASTER,
    SRSStage.ENLIGHTENED,
    SRSStage.BURNED,
  ] as SRSStage[]).includes(stage);
}


export default function EntryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<UserDictionaryEntry>({
    queryKey: ["entry", id],
    queryFn: async () => {
      const res = await api.get(`/dictionary/${id}`);
      return new UserDictionaryEntry(res.data);
    },
    enabled: !!id,
  });

  const planMutation = useMutation({
    mutationFn: async () => {
      await api.post("/plan_add/", { entry_id: id });
    },
    onSuccess: () => {
      // Refresh this entry so in_plan / srs_stage updates
      queryClient.invalidateQueries({ queryKey: ["entry", id] });

      // Invalidate learn queue list
      queryClient.invalidateQueries({ queryKey: ["learn-queue"] });

      // Invalidate dashboard lesson list
      queryClient.invalidateQueries({ queryKey: ["lessons"] });

      alert("Added to your learning queue!");
    },
  });


  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Error loading entry</p>;
  if (!data) return <p>No entry found</p>;

  return (
    <div>
      <NavBar />
      <EntryCard ude={data} flipped={true} showSrsStageOpen={true} />

      <div className="p-4 add-to-learn-queue">
        {/* Show button only if not planned and still locked */}
        {!data.in_plan && data.srs_stage === SRSStage.LOCKED && (
          <>
            <button
              onClick={() => planMutation.mutate()}
              disabled={planMutation.isPending || data.in_plan}
              className="rounded-border background-color-light button-hover-color p-3"
            >
              {planMutation.isPending ? "Adding…" : "Add to Lessons / Learn Queue"}
            </button>

            {/* Inline error message */}
            {planMutation.isError && (
              <p className="mt-2 text-red-600">
                ❌ Failed to add. Try again later.
              </p>
            )}
          </>
        )}

        {data.in_plan && <p>⭐ In Learn Queue</p>}
        {data.srs_stage === SRSStage.LESSON && <p>📘 Already in lessons</p>}
        {data.srs_stage && isLearningStage(data.srs_stage) && <p>✅ Learning / Already learned</p>}
      </div>
    </div>
  );
}