import { useState } from "react";
import { LoginForm } from "./LoginForm";
import Dashboard from "./Dashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black p-4">
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <LoginForm onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}