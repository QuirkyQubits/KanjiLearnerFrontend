import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../lib/axios";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    api.get("/whoami")
      .then(() => {
        setAuthenticated(true);
      })
      .catch(() => {
        setAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (!authenticated) return <Navigate to="/login" replace />;

  return children;
}