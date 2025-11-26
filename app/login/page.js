"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = "http://api.loomia.fun";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to /convert
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/convert");
    }
  }, [router]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ email: data.user, name: data.name })
        );

        // 🔔 notify navbar that auth state changed
        window.dispatchEvent(new Event("loomia-auth-changed"));
      }

      router.push("/convert");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2ff] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white border border-violet-100 shadow-[0_18px_40px_rgba(71,49,192,0.18)] px-6 py-8 sm:px-8 sm:py-10">
        {/* Tiny badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-[10px] font-medium text-violet-700 mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Secure login to Loomia
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
          Log in
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter your email and password to access your transcripts and quizzes.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-violet-200 bg-violet-50/40 px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-violet-200 bg-violet-50/40 px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
              placeholder="********"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-violet-400 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-xs text-slate-500 text-center">
          No account yet?{" "}
          <Link
            href="/signup"
            className="font-medium text-violet-600 hover:text-violet-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
