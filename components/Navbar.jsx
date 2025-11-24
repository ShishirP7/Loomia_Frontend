"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showPromoModal, setShowPromoModal] = useState(false);
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

    // 🔔 Show promo modal only if:
    // - not logged in
    // - not on login / signup
    // - user hasn't dismissed it before
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
    <>
      {/* 🎉 Moving promo banner above navbar */}
      <div className="w-full border-b border-violet-100 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-400">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-xs text-white">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4">
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

          <Link
            href="/pricing"
            className="hidden sm:inline-flex rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-violet-700 hover:bg-white"
          >
            View plans
          </Link>
        </div>

        {/* simple marquee keyframes */}
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

      {/* 🎁 Black Friday / Plans modal */}
      {showPromoModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-black via-slate-900 to-black p-[1px] shadow-2xl">
            <div className="relative rounded-3xl bg-[radial-gradient(circle_at_top,_#facc15_0,_transparent_45%),_radial-gradient(circle_at_bottom,_#a855f7_0,_transparent_45%),_#020617] px-8 py-8 text-center text-slate-50 overflow-hidden">
              {/* close */}
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
              <h2 className="mt-2 text-3xl font-semibold">Black Friday</h2>
              <p className="mt-1 text-sm text-slate-300">
                Upgrade Loomia and turn hours of video into study-ready quizzes.
              </p>

              <div className="mt-6 rounded-2xl bg-red-600 px-4 py-3 text-2xl font-bold">
                Save 50%
              </div>
              <p className="mt-2 text-xs text-slate-300">
                Get Plus or Premium for as low as{" "}
                <span className="font-semibold">$0.47/day</span>.
              </p>

              <button
                onClick={() => {
                  dismissPromoModal();
                  window.location.href = "/pricing";
                }}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-400 shadow-lg"
              >
                🚀 Upgrade Now
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
    </>
  );
}
