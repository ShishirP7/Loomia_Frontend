"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const pathname = usePathname();

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
    if (typeof window === "undefined") return;

    readUserFromStorage();

    const handler = () => readUserFromStorage();
    window.addEventListener("loomia-auth-changed", handler);

    const token = localStorage.getItem("token");
    const seen = localStorage.getItem("loomia_plan_modal_seen");

    if (!token && !seen && pathname !== "/login" && pathname !== "/signup") {
      setShowPromoModal(true);
    }

    return () => {
      window.removeEventListener("loomia-auth-changed", handler);
    };
  }, [pathname]);

  const dismissPromoModal = () => {
    setShowPromoModal(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("loomia_plan_modal_seen", "true");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("transcript");
    localStorage.removeItem("summary");
    localStorage.removeItem("quiz");

    sessionStorage.removeItem("transcript");
    sessionStorage.removeItem("summary");
    sessionStorage.removeItem("quiz");

    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });

    window.dispatchEvent(new Event("loomia-auth-changed"));
    window.location.href = "/";
  };

  const isLoggedIn = !!user;

  return (
    <>
      {/* 🎉 Moving promo banner above navbar */}
      <div className="w-full border-b border-violet-100 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-400">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-xs text-white">
          <div className="flex flex-1 items-center gap-3 overflow-hidden">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/30 text-sm">
              🎉
            </span>

            {/* scrolling container */}
            <div className="flex-1 overflow-hidden">
              <p className="whitespace-nowrap animate-[marquee_15s_linear_infinite] text-white font-medium">
                Black Friday Preview: Save 50% on Plus & Premium plans — Upgrade
                your transcription, summaries, and quizzes in one click.
              </p>
            </div>
          </div>

          {/* View plans button – visible on all sizes */}
          <button
            onClick={() => setShowPlansModal(true)}
            className="inline-flex rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-violet-700 hover:bg-white"
          >
            View plans
          </button>
        </div>

        {/* marquee keyframes */}
        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}</style>
      </div>

      {/* 🌈 Navbar */}
      <header className="sticky top-0 z-30 border-b border-violet-100 bg-[#f5f2ff]/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div>
              <img src="/logo.png" width={100} height={100} alt="Logo" />
            </div>
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
            <div className="flex items-center gap-3 sm:gap-4 text-sm">
              <button
                onClick={() => setShowPlansModal(true)}
                className="rounded-full border border-violet-200 bg-white px-3 py-1 text-[11px] font-medium text-violet-700 hover:border-violet-400"
              >
                View plans
              </button>
              <Link
                href="/saved"
                className="text-slate-700 hover:text-violet-600 transition font-medium"
              >
                Saved items
              </Link>
              <span className="hidden xs:inline text-slate-800">
                Hi, {user.name}
              </span>
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

      {/* 🎁 Black Friday / Plans promo modal (auto) */}
      {showPromoModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-3">
          <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-black via-slate-900 to-black p-[1px] shadow-2xl">
            <div className="relative rounded-3xl bg-[radial-gradient(circle_at_top,_#facc15_0,_transparent_45%),_radial-gradient(circle_at_bottom,_#a855f7_0,_transparent_45%),_#020617] px-6 py-7 sm:px-8 sm:py-8 text-center text-slate-50 overflow-hidden">
              <button
                onClick={dismissPromoModal}
                className="absolute right-4 top-4 text-slate-300 hover:text-white text-sm"
                aria-label="Close"
              >
                ✕
              </button>

              <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
                Limited Time Discount
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold">
                Black Friday
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Upgrade Loomia and turn hours of video into study-ready quizzes.
              </p>

              <div className="mt-5 rounded-2xl bg-red-600 px-4 py-3 text-2xl font-bold">
                Save 50%
              </div>
              <p className="mt-2 text-xs text-slate-300">
                Get Plus or Premium for as low as{" "}
                <span className="font-semibold">$0.47/day</span>.
              </p>

              <button
                onClick={() => {
                  dismissPromoModal();
                  setShowPlansModal(true);
                }}
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-400 shadow-lg"
              >
                🚀 View available plans
              </button>

              <button
                onClick={dismissPromoModal}
                className="mt-3 text-[11px] text-slate-400 hover:text-slate-200"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📦 Plans modal (Basic / Plus / Premium) */}
      {showPlansModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-3">
          <div className="w-full max-w-4xl rounded-3xl bg-[#f5f2ff] p-4 sm:p-6 shadow-2xl border border-violet-200 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Choose your Loomia plan
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-600">
                  All plans include AI transcription, summaries, and quiz
                  generation.
                </p>
              </div>
              <button
                onClick={() => setShowPlansModal(false)}
                className="self-end text-slate-500 hover:text-slate-800 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-3">
              {/* Basic */}
              <div className="rounded-2xl border border-violet-100 bg-white p-4 text-sm flex flex-col">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Basic
                  </p>
                  {isLoggedIn && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                      Current plan
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xl font-bold text-slate-900">Free</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Perfect to try Loomia.
                </p>
                <ul className="mt-3 space-y-1 text-[11px] text-slate-700 flex-1">
                  <li>• Short videos (up to 5 min)</li>
                  <li>• Basic transcript & summary</li>
                  <li>• Up to 3 saved items</li>
                  <li>• Limited quiz questions</li>
                </ul>
                <button
                  disabled={isLoggedIn}
                  onClick={() => {
                    if (!isLoggedIn) {
                      setShowPlansModal(false);
                      window.location.href = "/signup";
                    }
                  }}
                  className="mt-4 w-full rounded-full border border-violet-200 bg-white px-3 py-2 text-xs font-semibold text-violet-700 hover:border-violet-400 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoggedIn ? "You’re on this plan" : "Start for free"}
                </button>
              </div>

              {/* Plus */}
              <div className="rounded-2xl border border-violet-400 bg-violet-600/90 p-4 text-sm text-white flex flex-col shadow-lg">
                <p className="text-xs font-semibold uppercase text-amber-200">
                  Plus · Most Popular
                </p>
                <p className="mt-1 text-xl font-bold">$9.99 / month</p>
                <p className="mt-1 text-[11px] text-violet-100">
                  For regular learners & creators.
                </p>
                <ul className="mt-3 space-y-1 text-[11px] text-violet-50 flex-1">
                  <li>• Longer videos (up to ~30 min)</li>
                  <li>• Higher accuracy transcripts</li>
                  <li>• Detailed AI summaries</li>
                  <li>• Unlimited quizzes & retries</li>
                  <li>• Save up to 50 items</li>
                </ul>
                <button
                  onClick={() =>
                    alert(
                      "Plus plan is coming soon! For now, all users are on the Basic plan."
                    )
                  }
                  className="mt-4 w-full rounded-full bg-white px-3 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-50"
                >
                  Choose Plus
                </button>
              </div>

              {/* Premium */}
              <div className="rounded-2xl border border-violet-100 bg-white p-4 text-sm flex flex-col">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Premium
                </p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  $19.99 / month
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  For teachers & power users.
                </p>
                <ul className="mt-3 space-y-1 text-[11px] text-slate-700 flex-1">
                  <li>• Everything in Plus</li>
                  <li>• Very long videos (talks/lectures)</li>
                  <li>• Export to PDF, DOCX, TXT</li>
                  <li>• Advanced quiz modes</li>
                  <li>• Priority processing</li>
                </ul>
                <button
                  onClick={() =>
                    alert(
                      "Premium plan is coming soon! For now, all users are on the Basic plan."
                    )
                  }
                  className="mt-4 w-full rounded-full border border-violet-200 bg-white px-3 py-2 text-xs font-semibold text-violet-700 hover:border-violet-400"
                >
                  Choose Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
