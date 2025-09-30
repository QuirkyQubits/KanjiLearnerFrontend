import { type JSX } from "react";
import { Navigate } from "react-router-dom";

export function RequireAuth({ children, isLoggedIn }: { children: JSX.Element, isLoggedIn: boolean }) {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}