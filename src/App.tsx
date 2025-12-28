import { useEffect, useState} from "react";
import { LoginForm } from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import { Navigate, Route, Routes } from "react-router-dom";
import Runner from "./components/Runner";
import { api, initCsrf } from "./lib/axios";
import { useNavigate } from "react-router-dom";
import SearchResults from "./components/SearchResults";
import EntryDetailPage from "./components/EntryDetail";
import LearnQueuePage from "./components/LearnQueue";
import { RequireAuth } from "./auth/RequireAuth";
import Register from "./components/Register";
import VerifyEmail from "./components/VerifyEmail";
import { useLessons, useReviews } from "./hooks/useAppData";
import { useQueryClient } from "@tanstack/react-query";
import WaniKaniForecastPage from "./components/WaniKaniForecastPage";
import LiveMirrorPage from "./components/LiveMirrorPage";


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // Initialize CSRF once per app load
    initCsrf();
  }, []);

  // for debugging
  useEffect(() => {
    // Force light mode for testing:
    document.documentElement.classList.remove('dark');

    // Or force dark mode for testing:
    // document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Ask backend if session cookie is still valid
        const whoamiRes = await api.get("/whoami"); // or /reviews
        if (!cancelled && whoamiRes.data?.username) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.log("No active session:", err);
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);


  function LessonsRunnerPage() {
    const { data: lessons, isLoading } = useLessons();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    if (isLoading) {
      return <div>Loading lessons…</div>;
    }

    return (
      <Runner
        mode="lesson"
        entries={lessons ?? []}
        onComplete={async () => {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["lessons"] }),
            queryClient.invalidateQueries({ queryKey: ["reviews"] }),
            queryClient.invalidateQueries({ queryKey: ["mistakes"] }),
            queryClient.invalidateQueries({ queryKey: ["review-forecast"] }),
            queryClient.invalidateQueries({ queryKey: ["item-spread"] }),
          ]);
          navigate("/dashboard");
        }}
      />
    );
  }

  function ReviewsRunnerPage() {
    const { data: reviews, isLoading } = useReviews();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    if (isLoading) {
      return <div>Loading reviews…</div>;
    }

    return (
      <Runner
        mode="review"
        entries={reviews ?? []}
        onComplete={async () => {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["reviews"] }),
            queryClient.invalidateQueries({ queryKey: ["mistakes"] }),
            queryClient.invalidateQueries({ queryKey: ["review-forecast"] }),
            queryClient.invalidateQueries({ queryKey: ["item-spread"] }),
          ]);
          navigate("/dashboard");
        }}
      />
    );
  }


  function SearchResultsPage() {
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
          <RequireAuth isLoggedIn={isLoggedIn}>
              <Dashboard />
          </RequireAuth>
        }
      />

      {/* Lessons (protected) */}
      <Route
        path="/lessons"
        element={
          <RequireAuth isLoggedIn={isLoggedIn}>
            <LessonsRunnerPage />
          </RequireAuth>
        }
      />

      {/* Reviews (protected) */}
      <Route
        path="/reviews"
        element={
          <RequireAuth isLoggedIn={isLoggedIn}>
            <ReviewsRunnerPage />
          </RequireAuth>
        }
      />

      {/* Search results (protected) */}
      <Route
        path="/search"
        element={
          <RequireAuth isLoggedIn={isLoggedIn}>
            <SearchResultsPage />
          </RequireAuth>
        }
      />

      {/* Search results (protected) */}
      <Route
        path="/dictionary/:id"
        element={
          <RequireAuth isLoggedIn={isLoggedIn}>
            <EntryDetailPage />
          </RequireAuth>
        }
      />

      {/* Search results (protected) */}
      <Route
        path="/learn-queue"
        element={
          <RequireAuth isLoggedIn={isLoggedIn}>
            <LearnQueuePage />
          </RequireAuth>
        }
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/verify-email/:uid/:token"
        element={<VerifyEmail />}
      />

      <Route
        path="/wk-forecast"
        element={<WaniKaniForecastPage />}
      />

      <Route
        path="/scratch"
        element={
          <RequireAuth isLoggedIn={isLoggedIn}>
            <LiveMirrorPage />
          </RequireAuth>
        }
      />
    </Routes>
  );
}