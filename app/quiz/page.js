"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

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
      setQuestions(withIds);
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

  const score =
    submitted && questions.length > 0
      ? questions.reduce(
          (sum, q) => (answers[q.id] === q.correct ? sum + 1 : sum),
          0
        )
      : null;

  return (
    <div className="mx-auto max-w-4xl px-4 pt-12 pb-24">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-50">
            Quiz from Transcript
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Answer the questions below based on the transcript generated on the
            previous page.
          </p>
        </div>
        <Link
          href="/convert"
          className="rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-200 hover:border-indigo-400"
        >
          ← Back to transcript
        </Link>
      </div>

      {error && (
        <p className="mt-6 text-sm text-red-400">
          {error}
        </p>
      )}

      {!error && questions.length === 0 && (
        <p className="mt-6 text-sm text-slate-300">
          Loading quiz...
        </p>
      )}

      {!error && questions.length > 0 && (
        <>
          <div className="mt-8 space-y-6">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
              >
                <p className="text-sm font-semibold text-slate-50">
                  Q{idx + 1}. {q.question}
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, i) => {
                    const isSelected = answers[q.id] === i;
                    const isCorrect = submitted && q.correct === i;
                    const isWrong = submitted && isSelected && q.correct !== i;

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelect(q.id, i)}
                        className={[
                          "rounded-xl border px-3 py-2 text-left text-sm transition",
                          isSelected
                            ? "border-indigo-400 bg-indigo-500/20"
                            : "border-slate-700 bg-slate-950/70 hover:border-indigo-400",
                          isCorrect && "border-emerald-400 bg-emerald-500/20",
                          isWrong && "border-rose-400 bg-rose-500/20",
                        ].join(" ")}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={handleSubmit}
              className="rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400"
            >
              {submitted ? "Submitted" : "Submit Quiz"}
            </button>

            {submitted && (
              <div className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-200">
                Score:{" "}
                <span className="font-semibold text-emerald-300">
                  {score} / {questions.length}
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
