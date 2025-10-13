import { useState } from "react";
import { api } from "../lib/axios";
import { Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/register/", {
        username,
        email,
        password,
      });
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 min-h-screen bg-background-light">
      <div className="w-full">
        <h2 className="text-center p-4 mb-4 mt-2 bg-background text-lg text-text">
          Register
        </h2>
      </div>

      <div className="flex-grow">
        <form
          onSubmit={handleSubmit}
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

          <div className="w-full max-w-xs">
            <label
              htmlFor="email"
              className="text-text"
            >
              Email
            </label>
            <br />
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded bg-background w-full text-text"
            />
          </div>

          <button
            type="submit"
            className="border rounded bg-background-light hover:bg-background px-4 py-2 text-text"
          >
            Register
          </button>

          <p className="text-sm text-center text-text">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in here
            </Link>
          </p>
        </form>

        {message && <p className="mt-4 text-center">{message}</p>}
      </div>

      <div className="bg-background w-full">
        <footer className="text-center p-4 text-xs text-text">
          ©KanjiLearner 2025
        </footer>
      </div>
    </div>
  );
}
