import { http, HttpResponse } from "msw";

export const handlers = [
  // mock GET /reviews
  http.get("/reviews", () => {
    return HttpResponse.json([
      {
        entry: { id: 1, literal: "森", meaning: "forest", entry_type: "KANJI" },
        srs_stage: "APPRENTICE_1",
        unlocked_at: null,
        next_review_at: null,
        in_plan: true,
      },
    ]);
  }),
];
