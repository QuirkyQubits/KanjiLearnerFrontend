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

  const handleLogin = async () => {
    try {
      await api.post("/login/", { username, password });

      setError("");
      onLogin?.();  // sets isLoggedIn=true in App
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 min-h-screen bg-background-light">
      <div className="w-full">
        <h2 className="text-center mb-4 mt-2 bg-background text-lg text-text">Login</h2>
      </div>

      <div className="flex-grow">
        <label
          htmlFor="username"
          className="mb-10 text-text"
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
          className="border rounded bg-background mb-6"
        />
        <br/>

        <label
          htmlFor="password"
          className="mb-10 text-text"
        >
          Password
        </label>
        <br/>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border rounded bg-background mb-10"
        />
        <br/>

        <button 
          onClick={handleLogin}
          className="border rounded bg-background-light mb-4 hover:bg-background text-text px-4 py-2"
        >
          Log In
        </button>
        {error && <p>{error}</p>}

        <div className="border-b-1 border-b-gray-400"></div>

        <p className="text-sm text-center text-text">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>

      <div className="bg-background w-full">
        <footer className="text-center p-4 text-xs text-text">
          ©KanjiLearner 2025
        </footer>
      </div>
    </div>
  );
}
