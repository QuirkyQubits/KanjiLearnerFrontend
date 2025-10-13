import { useState, useEffect } from "react";
import { api } from "../lib/axios";
import { Link, useNavigate } from "react-router-dom";

export function LoginForm({ onLogin }: { onLogin?: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Get CSRF cookie on mount (so Axios can mirror it)
  useEffect(() => {
    api.get("/csrf/").catch(err => console.error("CSRF init failed:", err));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/login/", { username, password });
      setError("");
      onLogin?.(); // sets isLoggedIn=true in App
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 min-h-screen bg-background-light">
      {/* Header */}
      <div className="w-full">
        <h2 className="text-center p-4 mb-4 mt-2 bg-background text-lg text-text">
          Login
        </h2>
      </div>

      {/* Form container */}
      <div className="flex-grow">
        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-full max-w-xs">
            <label htmlFor="username" className="text-text">Username</label>
            <br />
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border rounded bg-background w-full text-text"
            />
          </div>

          <div className="w-full max-w-xs">
            <label htmlFor="password" className="text-text">Password</label>
            <br />
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded bg-background w-full text-text"
            />
          </div>

          <button
            type="submit"
            className="border rounded bg-background-light hover:bg-background px-4 py-2 text-text"
          >
            Log In
          </button>

          {error && <p className="bg-error text-sm text-center">{error}</p>}

          <p className="text-sm text-center text-text">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>

      {/* Footer */}
      <div className="bg-background w-full">
        <footer className="text-center p-4 text-xs text-text">
          ©KanjiLearner 2025
        </footer>
      </div>
    </div>
  );
}
