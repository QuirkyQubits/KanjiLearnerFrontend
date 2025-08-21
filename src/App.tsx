import { useEffect, useState, type JSX } from "react";
import { LoginForm } from "./LoginForm";
import Dashboard from "./Dashboard";
import { Navigate, Route, Routes } from "react-router-dom";
import Runner from "./Runner";
import { api } from "./lib/axios";
import type { DictionaryEntry } from "./models/DictionaryEntry";
import type { ReviewForecast } from "./models/ReviewForecast";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [lessons, setLessons] = useState<DictionaryEntry[]>([]);
  const [reviews, setReviews] = useState<DictionaryEntry[]>([]);
  const [mistakes, setMistakes] = useState<DictionaryEntry[]>([]);
  const [forecast, setForecast] = useState<ReviewForecast>({});

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch only after login
  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [lessonsRes, reviewsRes, mistakesRes, forecastRes] = await Promise.all([
          api.get("/lessons"),
          api.get("/reviews"),
          api.get("/mistakes"),
          api.get("/review_forecast", { params: { tz: timezone } }),
        ]);
        if (cancelled) return;
        setLessons(lessonsRes.data);
        setReviews(reviewsRes.data);
        setMistakes(mistakesRes.data);
        setForecast(forecastRes.data);
      } catch (err) {
        if (!cancelled) setError("Failed to load app data");
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [isLoggedIn, timezone]);

  function RequireAuth({ children }: { children: JSX.Element }) {
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    return children;
  }

  return (
    <Routes>
      {/* Root: send to login or dashboard */}
      <Route
        path="/"
        element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />}
      />

      {/* Login page */}
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginForm onLogin={() => setIsLoggedIn(true)} />
          )
        }
      />

      {/* Dashboard (protected) */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>{error}</div>
            ) : (
              <Dashboard
                lessons={lessons}
                reviews={reviews}
                mistakes={mistakes}
                forecast={forecast}
              />
            )}
          </RequireAuth>
        }
      />

      {/* Lessons (protected) */}
      <Route
        path="/lessons"
        element={
          <RequireAuth>
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>{error}</div>
            ) : (
              <Runner mode="lesson" entries={lessons} />
            )}
          </RequireAuth>
        }
      />

      {/* Reviews (protected) */}
      <Route
        path="/reviews"
        element={
          <RequireAuth>
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>{error}</div>
            ) : (
              <Runner mode="review" entries={reviews} />
            )}
          </RequireAuth>
        }
      />
    </Routes>
  );
}