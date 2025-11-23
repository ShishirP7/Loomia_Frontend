"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const FALLBACK_TRANSCRIPT = `Upload a video and click "Start Transcription" 
to see the generated transcript here.`;

const API_BASE = "http://localhost:5000";

export default function ConvertPage() {
  const router = useRouter();

  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("Idle");
  const [hasQuiz, setHasQuiz] = useState(false); // ✅ track if quiz exists

  // 🔒 Protect route: require login + restore saved data from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // ✅ Restore previous transcript/summary/quiz from localStorage
    const savedTranscript = localStorage.getItem("transcript");
    const savedSummary = localStorage.getItem("summary");
    const savedQuiz = localStorage.getItem("quiz");

    if (savedTranscript) {
      setTranscript(savedTranscript);
      setStatus("Loaded previous transcription");
    }
    if (savedSummary) {
      setSummary(savedSummary);
    }
    if (savedQuiz) {
      setHasQuiz(true);
    }
  }, [router]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
      setError(null);
      setStatus("File selected");
    }
  };

  const handleStartTranscription = async () => {
    if (!selectedFile) {
      setError("Please choose a video file first.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setStatus("Uploading & processing on server...");

      const formData = new FormData();
      formData.append("video", selectedFile);

      let headers = {};
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          headers = { Authorization: `Bearer ${token}` };
        }
      }

      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to transcribe video");
      }

      const data = await res.json();
      // { summary, fullText, quiz }

      const fullText = data.fullText || "";
      const summaryText = data.summary || "";
      const quizArray = Array.isArray(data.quiz) ? data.quiz : null;

      setTranscript(fullText);
      setSummary(summaryText);
      setStatus("Transcription completed ✅");
      setHasQuiz(!!quizArray && quizArray.length > 0);

      if (typeof window !== "undefined") {
        // ✅ sessionStorage (used by /quiz page)
        sessionStorage.setItem("transcript", fullText);
        sessionStorage.setItem("summary", summaryText);
        if (quizArray) {
          const quizString = JSON.stringify(quizArray);
          sessionStorage.setItem("quiz", quizString);
        }

        // ✅ localStorage (for restoring when user comes back later)
        localStorage.setItem("transcript", fullText);
        localStorage.setItem("summary", summaryText);
        if (quizArray) {
          const quizString = JSON.stringify(quizArray);
          localStorage.setItem("quiz", quizString);
        } else {
          localStorage.removeItem("quiz");
        }
      }
    } catch (err) {
      console.error("Frontend upload error:", err);
      setError(err.message || "Something went wrong while transcribing.");
      setStatus("Error during transcription ❌");
      setHasQuiz(false);
    } finally {
      setIsUploading(false);
    }
  };

  const goToQuiz = () => {
    if (!transcript) {
      setError("Please run transcription first before generating a quiz.");
      return;
    }
    router.push("/quiz");
  };

  const quizButtonLabel = hasQuiz
    ? "View your quiz"
    : "Generate Quiz from this Transcript";

  return (
    <div className="min-h-screen bg-[#f5f2ff]">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-24">
        <h1 className="text-3xl font-semibold text-slate-900">
          Convert Video to Text
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Upload a video and preview the
          transcript and summary generated from it.
        </p>

        {/* Status indicator */}
        <p className="mt-1 text-xs text-slate-500">
          Status:{" "}
          <span className="font-mono text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
            {status}
          </span>
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1.25fr)]">
          {/* LEFT: Upload */}
          <section className="rounded-3xl border border-violet-100 bg-white/90 p-6 shadow-[0_14px_35px_rgba(71,49,192,0.12)]">
            <h2 className="text-lg font-semibold text-slate-900">
              1. Upload your video
            </h2>
            <p className="mt-2 text-xs text-slate-600">
              Accepted formats would normally include MP4, MOV, MKV, etc.
            </p>

            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-violet-200 bg-violet-50/70 px-4 py-10 text-center text-sm text-slate-700 hover:border-violet-400 hover:bg-violet-50">
              <input type="file" className="hidden" onChange={handleFileChange} />
              <span className="text-3xl">⬆️</span>
              <span className="font-medium">Click to choose a video</span>
              <span className="text-xs text-slate-500">
                Your file is sent securely to the API running on port 5000.
              </span>
              {selectedFileName && (
                <span className="mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  Selected: {selectedFileName}
                </span>
              )}
            </label>

            <button
              type="button"
              onClick={handleStartTranscription}
              disabled={isUploading || !selectedFile}
              className="mt-6 w-full rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading
                ? "Transcribing..."
                : selectedFile
                ? "Start Transcription"
                : "Choose a file to start"}
            </button>

            {error && (
              <p className="mt-3 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            {summary && (
              <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/70 p-3 text-xs text-slate-800">
                <h3 className="font-semibold mb-1 text-slate-900">
                  AI Summary
                </h3>
                <p>{summary}</p>
              </div>
            )}
          </section>

          {/* RIGHT: Transcript */}
          <section className="rounded-3xl border border-violet-100 bg-white/90 p-6 shadow-[0_14px_35px_rgba(71,49,192,0.12)] flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  2. Transcript preview
                </h2>
                <p className="mt-1 text-xs text-slate-600">
                  Below is the transcribed text returned from your backend.
                </p>
              </div>
              {selectedFileName && (
                <span className="hidden md:inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-[11px] font-medium text-violet-700 border border-violet-100">
                  📁 {selectedFileName}
                </span>
              )}
            </div>

            {/* Bigger transcript panel */}
            <div className="mt-4 flex-1 overflow-hidden rounded-2xl border border-violet-100 bg-violet-50/70">
              <div className="flex items-center justify-between border-b border-violet-100 px-4 py-2 text-[11px] text-slate-600 bg-violet-50">
                <span className="font-semibold text-slate-800">
                  Transcript
                </span>
                <span className="text-[10px]">
                  Scroll to read full text
                </span>
              </div>
              <div className="max-h-80 md:max-h-96 overflow-y-auto px-4 py-3 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
                {transcript || FALLBACK_TRANSCRIPT}
              </div>
            </div>

            <button
              onClick={goToQuiz}
              className="mt-6 self-end rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400 shadow-md"
            >
              {quizButtonLabel}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
