"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:5000";

export default function SavedPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // protect route + fetch saved data
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/data/mydata`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Failed to fetch saved items");
        }

        const data = await res.json();
        setItems(data || []);
        if (data && data.length > 0) {
          setSelected(data[0]); // auto-select first
          syncToStorage(data[0]);
        }
      } catch (err) {
        console.error("Saved items error:", err);
        setError(err.message || "Failed to load saved items.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const syncToStorage = (item) => {
    if (typeof window === "undefined" || !item) return;

    const transcript = item.transcript || "";
    const summary = item.summary || "";
    const quiz = Array.isArray(item.quiz) ? item.quiz : [];

    // sessionStorage
    sessionStorage.setItem("transcript", transcript);
    sessionStorage.setItem("summary", summary);
    if (quiz.length) {
      sessionStorage.setItem("quiz", JSON.stringify(quiz));
    } else {
      sessionStorage.removeItem("quiz");
    }

    // localStorage
    localStorage.setItem("transcript", transcript);
    localStorage.setItem("summary", summary);
    if (quiz.length) {
      localStorage.setItem("quiz", JSON.stringify(quiz));
    } else {
      localStorage.removeItem("quiz");
    }
  };

  const handleSelectItem = (item) => {
    setSelected(item);
    syncToStorage(item);
  };

  const handleViewQuiz = () => {
    if (!selected || !selected.quiz || selected.quiz.length === 0) return;
    router.push("/quiz");
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f2ff]">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-24">
        <h1 className="text-3xl font-semibold text-slate-900">
          Saved items
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          View your saved summaries, transcripts, and quizzes.
        </p>

        {error && (
          <p className="mt-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        {loading && !error && (
          <p className="mt-6 text-sm text-slate-600">Loading your saved items...</p>
        )}

        {!loading && !error && items.length === 0 && (
          <p className="mt-6 text-sm text-slate-600">
            You don&apos;t have any saved items yet. Try saving a quiz from the quiz page.
          </p>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
            {/* LEFT: list */}
            <section className="rounded-3xl border border-violet-100 bg-white/90 p-4 shadow-sm max-h-[28rem] overflow-y-auto">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                Your saved quizzes
              </h2>
              <div className="space-y-2">
                {items.map((item) => {
                  const isActive = selected && selected._id === item._id;
                  return (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => handleSelectItem(item)}
                      className={[
                        "w-full text-left rounded-2xl border px-3 py-3 text-xs transition",
                        isActive
                          ? "border-violet-400 bg-violet-50 text-violet-900"
                          : "border-violet-100 bg-violet-50/60 text-slate-800 hover:border-violet-400",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold truncate">
                          {item.title || "Untitled quiz"}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      {item.summary && (
                        <p className="mt-1 line-clamp-2 text-[11px] text-slate-600">
                          {item.summary}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* RIGHT: detail viewer (Convert-like) */}
            <section className="rounded-3xl border border-violet-100 bg-white/90 p-6 shadow-[0_14px_35px_rgba(71,49,192,0.12)] flex flex-col">
              {selected ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {selected.title || "Saved quiz"}
                      </h2>
                      <p className="mt-1 text-xs text-slate-600">
                        Summary and transcript as they were when you saved this quiz.
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Saved on {formatDate(selected.createdAt)}
                    </span>
                  </div>

                  {/* Summary */}
                  {selected.summary && (
                    <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/70 p-3 text-xs text-slate-800">
                      <h3 className="font-semibold mb-1 text-slate-900">
                        AI Summary
                      </h3>
                      <p>{selected.summary}</p>
                    </div>
                  )}

                  {/* Transcript viewer (like ConvertPage) */}
                  <div className="mt-4 flex-1 overflow-hidden rounded-2xl border border-violet-100 bg-violet-50/70">
                    <div className="flex items-center justify-between border-b border-violet-100 px-4 py-2 text-[11px] text-slate-600 bg-violet-50">
                      <span className="font-semibold text-slate-800">
                        Transcript
                      </span>
                      <span className="text-[10px]">Scroll to read full text</span>
                    </div>
                    <div className="max-h-72 md:max-h-96 overflow-y-auto px-4 py-3 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
                      {selected.transcript ||
                        "No transcript was saved for this item."}
                    </div>
                  </div>

                  <button
                    onClick={handleViewQuiz}
                    disabled={!selected.quiz || !selected.quiz.length}
                    className="mt-6 self-end rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {selected.quiz && selected.quiz.length
                      ? "View your quiz"
                      : "No quiz saved for this item"}
                  </button>
                </>
              ) : (
                <p className="text-sm text-slate-600">
                  Select a saved item from the list to view its summary,
                  transcript, and quiz.
                </p>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
