"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);

  const readUserFromStorage = () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUser(parsed);
      } catch (e) {
        console.error("Failed to parse user:", e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    readUserFromStorage();

    const handler = () => readUserFromStorage();
    window.addEventListener("loomia-auth-changed", handler);

    return () => {
      window.removeEventListener("loomia-auth-changed", handler);
    };
  }, []);

  const handleLogout = () => {
    // 🔥 Remove all auth and cached data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("transcript");
    localStorage.removeItem("summary");
    localStorage.removeItem("quiz");

    sessionStorage.removeItem("transcript");
    sessionStorage.removeItem("summary");
    sessionStorage.removeItem("quiz");

    // 🔥 Clear cookies (if used)
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });

    window.dispatchEvent(new Event("loomia-auth-changed"));
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-30 border-b border-violet-100 bg-[#f5f2ff]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500">
            <span className="text-sm font-bold text-white">AI</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Loomia
          </span>
        </Link>

        {/* IF NOT LOGGED IN */}
        {!user && (
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/login"
              className="text-slate-700 hover:text-violet-600 transition"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-violet-500 px-4 py-2 font-medium text-white hover:bg-violet-400 transition"
            >
              Start for free
            </Link>
          </div>
        )}

        {/* IF LOGGED IN */}
        {user && (
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/saved"
              className="text-slate-700 hover:text-violet-600 transition font-medium"
            >
              Saved items
            </Link>
            <span className="text-slate-800">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="text-slate-700 hover:text-red-500 transition font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
