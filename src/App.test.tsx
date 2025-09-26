import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { server } from "./mocks/server";
import { http, HttpResponse } from "msw";

describe("App with MSW", () => {
  it("shows reviews on the dashboard when API returns data", async () => {
    // Override default handlers just for this test

    const API = "http://localhost:8000/kanjilearner/api";

    server.use(
        http.get(`${API}/whoami`, () =>
            HttpResponse.json({ username: "testuser" })
        ),
        http.get(`${API}/csrf/`, () =>
            HttpResponse.json({ ok: true })
        ),
        http.get(`${API}/reviews`, () =>
            HttpResponse.json([
            {
                entry: { id: 1, literal: "森", meaning: "forest", entry_type: "KANJI" },
                srs_stage: "APPRENTICE_1",
                unlocked_at: null,
                next_review_at: null,
                in_plan: true,
            },
            ])
        ),
        http.get(`${API}/lessons`, () =>
            HttpResponse.json([])
        ),
        http.get(`${API}/mistakes`, () =>
            HttpResponse.json([])
        ),
        http.get(`${API}/review_forecast`, () =>
            HttpResponse.json({})
        )
    );


    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>
    );

    // Wait for review button to appear
    await waitFor(() =>
      expect(
        screen.getByText(/Reviews \(1\): Start reviews/)
      ).toBeInTheDocument()
    );
  });
});
