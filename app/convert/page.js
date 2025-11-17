"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SAMPLE_TRANSCRIPT = `Welcome to our AI transcription demo. In a real
application, your uploaded video would be processed and converted into
searchable text. For now, we are using this static transcript. You can scroll
through it, highlight interesting parts, and then generate a quiz from the
content to check your understanding. Quizzes are a powerful way to reinforce
learning, especially when you are working with long lectures, meetings, or
training videos.`;

export default function ConvertPage() {
  const router = useRouter();
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleFakeUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  const goToQuiz = () => {
    router.push("/quiz");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 pb-24">
      <h1 className="text-3xl font-semibold text-slate-50">
        Convert Video to Text
      </h1>
      <p className="mt-2 text-sm text-slate-300">
        This is a static demo. Upload is only for show; the transcript below is
        pre-generated.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold text-slate-50">
            1. Upload your video
          </h2>
          <p className="mt-2 text-xs text-slate-300">
            Accepted formats would normally include MP4, MOV, MKV, etc.
          </p>

          <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-600 bg-slate-950/70 px-4 py-10 text-center text-sm text-slate-300 hover:border-indigo-400 hover:bg-slate-900/70">
            <input
              type="file"
              className="hidden"
              onChange={handleFakeUpload}
            />
            <span className="text-2xl">⬆️</span>
            <span className="font-medium">Click to choose a video</span>
            <span className="text-xs text-slate-400">
              For this demo nothing is uploaded – we just pretend it worked.
            </span>
            {selectedFileName && (
              <span className="mt-2 text-xs text-emerald-300">
                Selected: {selectedFileName}
              </span>
            )}
          </label>

          <button
            type="button"
            className="mt-6 w-full rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Start Transcription (disabled in demo)
          </button>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-50">
            2. Transcript preview
          </h2>
          <p className="mt-2 text-xs text-slate-300">
            Below is sample transcribed text that would come from your video.
          </p>

          <div className="mt-4 flex-1 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80">
            <div className="max-h-64 overflow-y-auto px-4 py-3 text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
              {SAMPLE_TRANSCRIPT}
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
