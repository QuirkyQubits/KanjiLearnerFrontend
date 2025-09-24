import { useState, useEffect } from "react";
import { api } from "./lib/axios";
import { useNavigate } from "react-router-dom";

export function LoginForm({ onLogin }: { onLogin?: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

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
      navigate("/dashboard");
    } catch (err) {
      console.error("Login or session check failed:", err);
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 min-h-screen background-color-light">
      <div className="w-full">
        <h2 className="text-center mb-4 mt-2 background-color text-lg">Login</h2>
      </div>

      <div className="flex-grow">
        <label
          htmlFor="username"
          className="mb-10"
        >
          Username
        </label>
        <br/>
        <input
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="rounded-border background-color mb-6"
        />
        <br/>

        <label htmlFor="password">
          Password
        </label>
        <br/>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="rounded-border background-color mb-10"
        />
        <br/>

        <button 
          onClick={handleLogin}
          className="rounded-border background-color-light mb-4 button-hover-color"
        >
          Log In
        </button>
        {error && <p>{error}</p>}

        <div className="border-b-1 border-b-gray-400"></div>
      </div>

      <div className="background-color w-full">
        <footer className="text-center p-4 text-xs">
          ©KanjiLearner 2025
        </footer>
      </div>
    </div>
  );
}
