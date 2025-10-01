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
    <div className="flex flex-col items-center gap-10 min-h-screen background-color-light">
      <div className="w-full">
        <h2 className="text-center mb-4 mt-2 background-color text-lg">
          Register
        </h2>
      </div>

      <div className="flex-grow">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-full max-w-xs">
            <label htmlFor="username">Username</label>
            <br />
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-border background-color w-full"
            />
          </div>

          <div className="w-full max-w-xs">
            <label htmlFor="password">Password</label>
            <br />
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-border background-color w-full"
            />
          </div>

          <div className="w-full max-w-xs">
            <label htmlFor="email">Email</label>
            <br />
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-border background-color w-full"
            />
          </div>

          <button
            type="submit"
            className="rounded-border background-color-light button-hover-color px-4 py-2"
          >
            Register
          </button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in here
            </Link>
          </p>
        </form>

        {message && <p className="mt-4 text-center">{message}</p>}
      </div>

      <div className="background-color w-full">
        <footer className="text-center p-4 text-xs">
          ©KanjiLearner 2025
        </footer>
      </div>
    </div>
  );
}
