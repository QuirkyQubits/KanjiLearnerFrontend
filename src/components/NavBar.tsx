import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/axios";

export default function NavBar() {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout/");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Always redirect, even if API fails
      navigate("/login");
    }
  };

  return (
    <>
      {/* Top nav bar */}
      <div className="site-header-container bg-emerald-200 min-h-10 max-h-16">
        <nav>
          <div className="flex flex-row items-center justify-between px-2">
            <div className="flex flex-row">
              <Link to="/dashboard" className="dashboard-header-link">
                🏠
              </Link>
              <button
                type="button"
                className="dashboard-header-link"
                onClick={() => setShowSearch((prev) => !prev)}
              >
                🔍
              </button>
              
              <Link to="/learn-queue" className="dashboard-header-link">
                ⭐ 
              </Link>
            </div>

            <div className="">
              <button
                onClick={handleLogout}
                className="dashboard-header-link"
              >
                Logout ↩️
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Toggle search bar */}
      {showSearch && (
        <div className="search-container flex flex-row items-center gap-2 p-4 pb-6 bg-emerald-300">
          <form onSubmit={handleSearch} className="flex flex-row gap-2 w-full max-w-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for radicals, kanji, or vocab..."
              className="border rounded px-2 py-0.5 w-full"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-emerald-500 text-white rounded p-2 hover:bg-emerald-600"
            >
              Search
            </button>
          </form>
        </div>
      )}
    </>
  );
}
