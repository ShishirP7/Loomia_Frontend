"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FALLBACK_TRANSCRIPT = `Upload a video and click "Start Transcription" 
to see the generated transcript here.`;

export default function ConvertPage() {
  const router = useRouter();

  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("Idle");

  // ✅ FIXED: accept event parameter (was using `event` without args)
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
      // MUST MATCH multer.single("video") ON THE BACKEND
      formData.append("video", selectedFile);

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to transcribe video");
      }

      const data = await res.json();

      setTranscript(data.fullText || "");
      setSummary(data.summary || "");
      setStatus("Transcription completed ✅");
    } catch (err) {
      console.error("Frontend upload error:", err);
      setError(err.message || "Something went wrong while transcribing.");
      setStatus("Error during transcription ❌");
    } finally {
      setIsUploading(false);
    }
  };

const goToQuiz = () => {
  if (!transcript) {
    setError("Please run transcription first before generating a quiz.");
    return;
  }

  if (typeof window !== "undefined") {
    sessionStorage.setItem("transcript", transcript);
  }

  router.push("/quiz");
};

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 pb-24">
      <h1 className="text-3xl font-semibold text-slate-50">
        Convert Video to Text
      </h1>
      <p className="mt-2 text-sm text-slate-300">
        Upload a video, send it to the backend on port 5000, and preview the
        transcript generated from it.
      </p>

      {/* Status indicator */}
      <p className="mt-1 text-xs text-slate-400">
        Status: <span className="font-mono">{status}</span>
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
        {/* LEFT: Upload */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold text-slate-50">
            1. Upload your video
          </h2>
          <p className="mt-2 text-xs text-slate-300">
            Accepted formats would normally include MP4, MOV, MKV, etc.
          </p>

          <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-600 bg-slate-950/70 px-4 py-10 text-center text-sm text-slate-300 hover:border-indigo-400 hover:bg-slate-900/70">
            <input type="file" className="hidden" onChange={handleFileChange} />
            <span className="text-2xl">⬆️</span>
            <span className="font-medium">Click to choose a video</span>
            <span className="text-xs text-slate-400">
              This time the file is actually sent to the backend on port 5000.
            </span>
            {selectedFileName && (
              <span className="mt-2 text-xs text-emerald-300">
                Selected: {selectedFileName}
              </span>
            )}
          </label>

          <button
            type="button"
            onClick={handleStartTranscription}
            disabled={isUploading || !selectedFile}
            className="mt-6 w-full rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading
              ? "Transcribing..."
              : selectedFile
              ? "Start Transcription"
              : "Choose a file to start"}
          </button>

          {error && (
            <p className="mt-3 text-xs text-red-400">
              {error}
            </p>
          )}

          {summary && (
            <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/70 p-3 text-xs text-slate-200">
              <h3 className="font-semibold mb-1 text-slate-100">AI Summary</h3>
              <p>{summary}</p>
            </div>
          )}
        </section>

        {/* RIGHT: Transcript */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-50">
            2. Transcript preview
          </h2>
          <p className="mt-2 text-xs text-slate-300">
            Below is the transcribed text returned from your backend.
          </p>

          <div className="mt-4 flex-1 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80">
            <div className="max-h-64 overflow-y-auto px-4 py-3 text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
              {transcript || FALLBACK_TRANSCRIPT}
            </div>
          </div>

          <button
            onClick={goToQuiz}
            className="mt-6 self-end rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400"
          >
            Generate Quiz from this Transcript
          </button>
        </section>
      </div>
    </div>
  );
}
