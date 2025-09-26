import { useCallback, useEffect, useState, type JSX } from "react";
import { LoginForm } from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import { Navigate, Route, Routes } from "react-router-dom";
import Runner from "./components/Runner";
import { api } from "./lib/axios";
import { UserDictionaryEntry } from "./models/UserDictionaryEntry";
import type { ReviewForecast } from "./models/ReviewForecast";
import { useNavigate } from "react-router-dom";
import SearchResults from "./components/SearchResults";
import EntryDetailPage from "./components/EntryDetail";
import LearnQueuePage from "./components/LearnQueue";
import { RequireAuth } from "./auth/RequireAuth";


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

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


  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Ask backend if session cookie is still valid
        const whoamiRes = await api.get("/whoami"); // or /reviews
        if (!cancelled && whoamiRes.data?.username) {
          setIsLoggedIn(true);

          // Always refresh CSRF token before doing writes
          await api.get("/csrf/");
          if (!cancelled) {
            await fetchData();
          }
        }
      } catch (err) {
        // Not logged in, leave isLoggedIn = false
        console.log("No active session:", err);
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchData]);


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

  if (checkingSession) {
    return <div>Loading…</div>;
  }

  return (
    <Routes>
      {/* Root: send to login or dashboard once we KNOW session state */}
      <Route
        path="/"
        element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />}
      />

      {/* Login always shows form; it will navigate to /dashboard on success */}
      <Route
        path="/login"
        element={<LoginForm onLogin={() => setIsLoggedIn(true)} />}
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