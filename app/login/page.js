"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DEMO_USER = {
  email: "demo@demo.com",
  password: "password123"
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      form.email === DEMO_USER.email &&
      form.password === DEMO_USER.password
    ) {
      setError("");
      router.push("/convert");
    } else {
      setError("Invalid credentials. Use demo@demo.com / password123.");
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 pt-16 pb-24">
      <h1 className="text-3xl font-semibold text-slate-50">Log in</h1>
      <p className="mt-2 text-sm text-slate-300">
        Static auth only. No real accounts.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
            placeholder="demo@demo.com"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
            placeholder="password123"
            required
          />
        </div>

        {error && (
          <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          Log in
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-400">
        No account yet?{" "}
        <Link href="/signup" className="text-indigo-400 hover:text-indigo-300">
          Sign up
        </Link>
      </p>
    </div>
  );
}
