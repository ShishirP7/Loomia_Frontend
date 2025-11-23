import Link from "next/link";

const logos = [
  "Salesforce",
  "Harvard",
  "NBC",
  "Amazon",
  "IBM",
  "Grant Thornton",
  "Walgreens",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f5f2ff]">
      {/* HERO */}
      <main className="mx-auto max-w-6xl px-4 pt-16 pb-24">
        <section className="text-center">
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            Convert Audio &amp; Video to Text
          </h1>
          <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
            Loomia lets you upload audio and video files or paste YouTube
            links, quickly turning them into text with AI. It also creates
            summaries, key questions, and lets you export the text in different
            formats.
          </p>

          {/* Feature badges */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3 text-sm">
            <div className="flex items-center justify-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm border border-violet-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500 text-white text-lg">
                🎧
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900">
                  Supports 11 Formats
                </p>
                <p className="text-xs text-slate-500">wma, mp3, mp4, wav &amp; more</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm border border-violet-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500 text-white text-lg">
                🌐
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900">
                  Supports 98 Languages
                </p>
                <p className="text-xs text-slate-500">English, Hindi, Telugu…</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm border border-violet-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500 text-white text-lg">
                📤
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900">
                  Export in 6 Formats
                </p>
                <p className="text-xs text-slate-500">txt, pdf, docx, srt, csv, vtt</p>
              </div>
            </div>
          </div>

          {/* Upload card */}
          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-3xl rounded-3xl bg-white shadow-[0_18px_40px_rgba(71,49,192,0.18)] border border-violet-100 px-4 py-6 sm:px-8 sm:py-8">
              {/* Tabs */}
              <div className="flex gap-2 rounded-full bg-violet-50 p-1 text-xs font-medium text-slate-500 max-w-xs mx-auto">
                <button className="flex-1 rounded-full bg-white px-4 py-2 text-violet-600 shadow-sm">
                  Upload File
                </button>
                <button className="flex-1 rounded-full px-4 py-2 hover:text-slate-700">
                  Paste Link
                </button>
              </div>

              {/* Upload area */}
              <div className="mt-8 rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/60 px-6 py-10 text-center text-sm text-slate-600">
                <p className="font-medium text-slate-800">
                  Drag files here to upload
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Upload audio/video files from your device to transcribe
                </p>

                <div className="mt-6">
                  <Link
                    href="/convert"
                    className="inline-flex items-center justify-center rounded-full bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-violet-400"
                  >
                    Upload a file
                  </Link>
                </div>

                <p className="mt-4 text-[11px] leading-relaxed text-slate-500 max-w-md mx-auto">
                  Audio: aac, amr, awb, flac, m4a, mka, mp2, mp3, oga, ogg, opus,
                  wav, weba, webm, wma
                  <br />
                  Video: 3gp, flv, mov, mp4, mpeg, ts, webm, wmv
                </p>
              </div>

              {/* Demo link */}
              <p className="mt-4 text-xs text-slate-500 text-left">
                Transcribed Demo:{" "}
                <a
                  href="#"
                  className="text-violet-600 underline underline-offset-2 hover:text-violet-500"
                >
                  Steve Jobs&apos; 2005 Stanford Commencement Address
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Trusted by logos */}
        <section className="mt-16 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Trusted by teams worldwide
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-slate-500 sm:grid-cols-4 md:grid-cols-7">
            {logos.map((logo) => (
              <div
                key={logo}
                className="flex items-center justify-center rounded-xl border border-violet-100 bg-white/80 px-2 py-3"
              >
                {logo}
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-20">
          <h2 className="text-2xl font-semibold text-slate-900 text-center">
            How to Convert Audio &amp; Video to Text?
          </h2>

          <div className="mt-10 grid gap-8 text-sm text-slate-600 md:grid-cols-3">
            <div className="rounded-2xl bg-white/80 p-6 shadow-sm border border-violet-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 text-white text-lg">
                ⬆️
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                Upload or Paste
              </h3>
              <p className="mt-2 text-xs leading-relaxed">
                Upload audio and video files from your local device or simply
                paste a YouTube link.
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-6 shadow-sm border border-violet-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 text-white text-lg">
                ✨
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                Transcribe to Text
              </h3>
              <p className="mt-2 text-xs leading-relaxed">
                Click &quot;Transcribe&quot; and wait a moment. AI converts your
                speech to clean, readable text.
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-6 shadow-sm border border-violet-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 text-white text-lg">
                📄
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                Export or Share
              </h3>
              <p className="mt-2 text-xs leading-relaxed">
                Export transcribed text in multiple formats or share a link to
                view it directly.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
