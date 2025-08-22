import { useState, useEffect } from "react";
import { api } from "./lib/axios";

export function LoginForm({ onLogin }: { onLogin?: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Get CSRF cookie on mount (so Axios can mirror it)
  useEffect(() => {
    api.get("/csrf/").catch(err => console.error("CSRF init failed:", err));
  }, []);

  const handleLogin = async () => {
    try {
      // 1) Login (Axios interceptor sets X-CSRFToken for POST)
      await api.post("/login/", { username, password });

      // 2) Sanity-check that the session is active by hitting an auth-protected GET
      await api.get("/reviews"); // or /lessons, any endpoint requiring auth

      setError("");
      onLogin?.();
    } catch (err) {
      console.error("Login or session check failed:", err);
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Log In</button>
      {error && <p>{error}</p>}
    </div>
  );
}
