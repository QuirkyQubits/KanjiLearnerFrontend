import { useCallback, useEffect, useState, type JSX } from "react";
import { LoginForm } from "./LoginForm";
import Dashboard from "./Dashboard";
import { Navigate, Route, Routes } from "react-router-dom";
import Runner from "./Runner";
import { api } from "./lib/axios";
import { UserDictionaryEntry } from "./models/UserDictionaryEntry";
import type { ReviewForecast } from "./models/ReviewForecast";
import { useNavigate } from "react-router-dom";
import SearchResults from "./SearchResults";
import EntryDetailPage from "./EntryDetail";
import LearnQueuePage from "./LearnQueue";


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [lessons, setLessons] = useState<UserDictionaryEntry[]>([]);
  const [reviews, setReviews] = useState<UserDictionaryEntry[]>([]);
  const [mistakes, setMistakes] = useState<UserDictionaryEntry[]>([]);
  const [forecast, setForecast] = useState<ReviewForecast>({});

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [lessonsRes, reviewsRes, mistakesRes, forecastRes] = await Promise.all([
        api.get("/lessons"),
        api.get("/reviews"),
        api.get("/mistakes"),
        api.get("/review_forecast", { params: { tz: timezone } }),
      ]);
      setLessons(lessonsRes.data.map((d: any) => new UserDictionaryEntry(d)));
      setReviews(reviewsRes.data.map((d: any) => new UserDictionaryEntry(d)));
      setMistakes(mistakesRes.data.map((d: any) => new UserDictionaryEntry(d)));
      setForecast(forecastRes.data);
    } catch (err) {
      setError("Failed to load app data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [timezone]);


  // Fetch only after login
  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;

    (async () => {
      try {
        await api.get("/csrf/");              // set csrftoken cookie
        if (cancelled) return;
        await fetchData();                    // your existing GETs
      } catch (e) {
        console.error("Init failed:", e);
      }
    })();

    return () => { cancelled = true; };
  }, [isLoggedIn, fetchData]);

  function LessonsRunnerPage({ entries }: { entries: UserDictionaryEntry[] }) {
    const navigate = useNavigate();
    return (
      <Runner
        mode="lesson"
        entries={entries}
        onComplete={async () => {
          await fetchData();         // refresh counts & lists
          navigate("/dashboard");    // then go back
        }}
      />
    );
  }

  function ReviewsRunnerPage({ entries }: { entries: UserDictionaryEntry[] }) {
    const navigate = useNavigate();
    return (
      <Runner
        mode="review"
        entries={entries}
        onComplete={async () => {
          await fetchData();         // refresh counts & lists
          navigate("/dashboard");    // then go back
        }}
      />
    );
  }


  function SearchResultsPage() {
    const navigate = useNavigate();
    return (
      <SearchResults
      />
    );
  }


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
              <LessonsRunnerPage entries={lessons} />
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
              <ReviewsRunnerPage entries={reviews} />
            )}
          </RequireAuth>
        }
      />

      {/* Search results (protected) */}
      <Route
        path="/search"
        element={
          <RequireAuth>
            <SearchResultsPage />
          </RequireAuth>
        }
      />

      {/* Search results (protected) */}
      <Route
        path="/dictionary/:id"
        element={
          <RequireAuth>
            <EntryDetailPage />
          </RequireAuth>
        }
      />

      {/* Search results (protected) */}
      <Route
        path="/learn-queue"
        element={
          <RequireAuth>
            <LearnQueuePage />
          </RequireAuth>
        }
      />
    </Routes>
  );
}