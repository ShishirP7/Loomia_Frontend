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
    // Run once on mount
    readUserFromStorage();

    // Listen for custom auth-change events
    const handler = () => readUserFromStorage();
    window.addEventListener("loomia-auth-changed", handler);

    return () => {
      window.removeEventListener("loomia-auth-changed", handler);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // you can also redirect with router.push("/") if you want
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500">
            <span className="text-sm font-bold text-white">AI</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Loomia
          </span>
        </Link>

        {!user && (
          <div className="flex items-center gap-4 text-sm">
            <Link href="/login" className="text-slate-200 hover:text-white">
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-indigo-500 px-4 py-2 font-medium text-white hover:bg-indigo-400"
            >
              Start for free
            </Link>
          </div>
        )}

        {user && (
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-200">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="text-slate-200 hover:text-white"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
