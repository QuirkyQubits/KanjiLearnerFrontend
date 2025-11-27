import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { fetchWaniKaniForecast } from "../api/wanikani";
import ReviewForecastView from "./ReviewForecastView";
import type { ReviewForecast } from "../models/ReviewForecast";

export default function WaniKaniForecastPage() {
  const [forecast, setForecast] = useState<ReviewForecast>({});
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  async function loadForecast() {
    try {
      setLoading(true);
      setError("");
      const data = await fetchWaniKaniForecast(days, timezone);
      setForecast(data);
    } catch (err) {
      setError("Failed to load WaniKani forecast.");
    } finally {
      setLoading(false);
    }
  }

  // Load on first render
  useEffect(() => {
    loadForecast();
  }, [days]);

  return (
    <div className="min-h-screen bg-background-light text-text flex flex-col">
      <NavBar />

      <div className="p-8 max-w-3xl mx-auto w-full">
        <h2 className="text-2xl mb-6 font-semibold">WaniKani Forecast</h2>

        {/* Days selector */}
        <div className="flex gap-4 mb-6">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded ${
                days === d ? "bg-primary text-white" : "bg-blue-300"
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>

        {/* Loading / Error */}
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Forecast Graph */}
        <ReviewForecastView forecast={forecast} title="WaniKani Forecast" />
      </div>
    </div>
  );
}
