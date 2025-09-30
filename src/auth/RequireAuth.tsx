import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../lib/axios";

export function RequireAuth({ children, isLoggedIn }: { children: JSX.Element, isLoggedIn: boolean }) {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}