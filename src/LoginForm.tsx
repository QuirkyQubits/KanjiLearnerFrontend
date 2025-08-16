import { useState, useEffect } from "react";
import { api } from "./lib/axios";
import axios from "axios";

export function LoginForm({ onLogin }: { onLogin?: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 1. Get CSRF token on mount
  useEffect(() => {
    axios.get("http://localhost:8000/kanjilearner/api/csrf/", {
      withCredentials: true,
    });
  }, []);

  const handleLogin = async () => {
    try {
      // 2. Get CSRF token from cookie
      const csrfToken = getCookie("csrftoken");

      await api.post(
        "/login/",
        { username, password },
        {
          headers: {
            "X-CSRFToken": csrfToken || "",
          },
        }
      );

      setError("");
      onLogin?.();
    } catch (err) {
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 space-y-4">
      <h2 className="text-xl font-semibold">Login</h2>
      <input
        className="border p-2 w-full"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleLogin}
      >
        Log In
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

// Utility to read cookie value
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}