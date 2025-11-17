"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("Account created! This is a demo – you can log in with demo@demo.com / password123.");
    setTimeout(() => {
      router.push("/login");
    }, 1200);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 pt-16 pb-24">
      <h1 className="text-3xl font-semibold text-slate-50">Sign up</h1>
      <p className="mt-2 text-sm text-slate-300">
        This page is static: we don&apos;t actually store new users.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300">
            Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
            placeholder="Your name"
            required
          />
        </div>
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
            placeholder="you@example.com"
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
            placeholder="********"
            required
          />
        </div>

        {message && (
          <p className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 rounded-lg px-3 py-2">
            {message}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          Create account
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
          Log in
        </Link>
      </p>
    </div>
  );
}
