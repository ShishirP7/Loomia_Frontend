"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:5000";

// Simple Fisher–Yates shuffle
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  

  // 🔒 Protect route: require login & load quiz from sessionStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const storedQuiz = sessionStorage.getItem("quiz");

    if (!storedQuiz) {
      setError(
        "No quiz found. Please go back to the transcript page and generate it first."
      );
      return;
    }

    try {
      const parsed = JSON.parse(storedQuiz);
      const withIds = parsed.map((q, idx) => ({
        id: idx + 1,
        ...q,
      }));
      setQuestions(shuffleArray(withIds)); // randomize once
    } catch (err) {
      console.error("Failed to parse stored quiz:", err);
      setError("Quiz data is corrupted. Please re-generate the quiz.");
    }
  }, [router]);

  const handleSelect = (questionId, optionIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
  };

  const handleRetry = () => {
    if (!questions.length) return;
    setSubmitted(false);
    setAnswers({});
    setError(null);
    setSaveMessage("");
    setQuestions((prev) => shuffleArray(prev)); // new order
  };

  const handleSaveQuiz = async () => {
    try {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // 🔴 ASK USER FOR TITLE BEFORE SAVING
      const input = window.prompt("Enter a title for this quiz:");
      if (!input || !input.trim()) {
        setSaveMessage("Saving cancelled: title is required.");
        return;
      }
      const title = input.trim();

      setSaving(true);
      setSaveMessage("");

      const summary =
        sessionStorage.getItem("summary") || "Transcript summary not available.";
      const transcript =
        sessionStorage.getItem("transcript") || "";

      const res = await fetch(`${API_BASE}/data/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          summary,
          transcript,   // ✅ now saved
          quiz: questions,
        }),
      });


      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to save quiz");
      }

      setSaveMessage("✅ Quiz saved to your profile!");
    } catch (err) {
      console.error("Save quiz error:", err);
      setSaveMessage(err.message || "Failed to save quiz.");
    } finally {
      setSaving(false);
    }
  };

  const score =
    submitted && questions.length > 0
      ? questions.reduce(
        (sum, q) => (answers[q.id] === q.correct ? sum + 1 : sum),
        0
      )
      : null;

      const handleDownloadQuiz = () => {
  if (!questions.length) return;

  let content = `QUIZ EXPORT\nTitle: ${sessionStorage.getItem("title") || "My Quiz"}\n\n`;

  questions.forEach((q, idx) => {
    content += `Q${idx + 1}. ${q.question}\n`;
    q.options.forEach((opt, i) => {
      const letter = String.fromCharCode(65 + i); // A B C D
      content += `   ${letter}. ${opt}\n`;
    });
    content += `Correct Answer: ${String.fromCharCode(65 + q.correct)}\n\n`;
    content += "--------------------------------------------\n\n";
  });

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quiz_export.txt";
  a.click();

  URL.revokeObjectURL(url);
};


  return (
    <div className="min-h-screen bg-[#f5f2ff]">
      <div className="mx-auto max-w-4xl px-4 pt-12 pb-24">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Quiz from Transcript
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Answer the questions below based on the transcript generated on
              the previous page.
            </p>
          </div>
          <Link
            href="/convert"
            className="rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:border-violet-400 shadow-sm"
          >
            ← Back to transcript
          </Link>
        </div>

        {error && (
          <p className="mt-6 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        {!error && questions.length === 0 && (
          <p className="mt-6 text-sm text-slate-600">Loading quiz...</p>
        )}

        {!error && questions.length > 0 && (
          <>
            <div className="mt-8 space-y-6">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="rounded-2xl border border-violet-100 bg-white/90 p-5 shadow-sm"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    Q{idx + 1}. {q.question}
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {q.options.map((opt, i) => {
                      const isSelected = answers[q.id] === i;
                      const isCorrect = submitted && q.correct === i;
                      const isWrong =
                        submitted && isSelected && q.correct !== i;

                      let base =
                        "rounded-xl border px-3 py-2 text-left text-sm transition";
                      if (isCorrect) {
                        base +=
                          " border-emerald-400 bg-emerald-50 text-emerald-900";
                      } else if (isWrong) {
                        base += " border-rose-400 bg-rose-50 text-rose-900";
                      } else if (isSelected) {
                        base +=
                          " border-violet-400 bg-violet-50 text-violet-900";
                      } else {
                        base +=
                          " border-violet-100 bg-violet-50/60 text-slate-800 hover:border-violet-400";
                      }

                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelect(q.id, i)}
                          className={base}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSubmit}
                  className="rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400 shadow-md"
                >
                  {submitted ? "Submitted" : "Submit Quiz"}
                </button>

                <button
                  type="button"
                  onClick={handleRetry}
                  className="rounded-full border border-violet-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 hover:border-violet-400 shadow-sm"
                >
                  Retry Quiz
                </button>

                <button
                  type="button"
                  onClick={handleSaveQuiz}
                  disabled={saving}
                  className="rounded-full bg-violet-500 px-6 py-2 text-sm font-semibold text-white hover:bg-violet-400 disabled:opacity-60 shadow-md"
                >
                  {saving ? "Saving..." : "Save Quiz to Profile"}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadQuiz}
                  className="rounded-full border border-blue-300 bg-blue-50 px-6 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 shadow-sm"
                >
                  Download Quiz
                </button>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-2">
                {submitted && (
                  <div className="rounded-full border border-violet-200 bg-white px-4 py-2 text-sm text-slate-800 shadow-sm">
                    Score:{" "}
                    <span className="font-semibold text-emerald-600">
                      {score} / {questions.length}
                    </span>
                  </div>
                )}

                {saveMessage && (
                  <p className="text-xs text-slate-600 bg-violet-50 border border-violet-100 rounded-full px-3 py-1">
                    {saveMessage}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
