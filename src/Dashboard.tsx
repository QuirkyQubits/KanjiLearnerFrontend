import { useEffect, useState } from "react";
import { api } from "./lib/axios";

export default function Dashboard() {
  const [lessons, setLessons] = useState<any>(null);
  const [reviews, setReviews] = useState<any>(null);
  const [mistakes, setMistakes] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonsRes, reviewsRes, mistakesRes, forecastRes] = await Promise.all([
          api.get("/lessons"),
          api.get("/reviews"),
          api.get("/mistakes"),
          api.get("/review_forecast", { params: { tz: timezone } }),
        ]);

        setLessons(lessonsRes.data);
        setReviews(reviewsRes.data);
        setMistakes(mistakesRes.data);
        setForecast(forecastRes.data);
      } catch (err: any) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timezone]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <Section title="Lessons" data={lessons} />
      <Section title="Reviews" data={reviews} />
      <Section title="Recent Mistakes" data={mistakes} />
      <Section title="Review Forecast" data={forecast} />
    </div>
  );
}

function Section({ title, data }: { title: string; data: any }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <pre className="p-2 bg-neutral-100 rounded text-sm overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}