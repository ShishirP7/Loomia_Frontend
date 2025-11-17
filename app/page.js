import Link from "next/link";

const logos = [
  "Salesforce",
  "Harvard",
  "NBC",
  "Amazon",
  "IBM",
  "Grant Thornton",
  "Walgreens"
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-16 pb-24">
      <section className="text-center">
        <h1 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl">
          Convert Video to Text:
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-purple-400 bg-clip-text text-transparent">
            Free, Instant AI Transcription
          </span>
        </h1>
        <p className="mt-4 text-base text-slate-300 max-w-2xl mx-auto">
          Turn your videos into searchable text in seconds. This is a static
          demo that shows the flow from upload to transcript and quiz creation.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/convert"
            className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400"
          >
            Convert Video to Text Now
          </Link>
        </div>

        <div className="mt-14 rounded-3xl glass px-6 py-16 shadow-2xl border border-white/5">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-8">
            <div className="flex gap-8 items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl">
                🎥
              </div>
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500 text-white shadow-xl">
                ⏺️
              </div>
            </div>
            <div className="rounded-full bg-black/70 px-4 py-2 text-xs text-slate-200 border border-white/10">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />
              Transcribing…
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Hundreds of teams trust OtterClone (in our dreams)
        </p>
        <div className="mt-6 grid grid-cols-2 gap-6 text-xs text-slate-300 sm:grid-cols-4 md:grid-cols-7">
          {logos.map((logo) => (
            <div
              key={logo}
              className="flex items-center justify-center rounded-lg border border-slate-800/70 px-2 py-3 bg-slate-900/40"
            >
              {logo}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-3xl border border-slate-800 bg-slate-900/40 px-6 py-10 text-center">
        <h2 className="text-2xl font-semibold text-slate-50">Video to Text</h2>
        <p className="mt-3 text-sm text-slate-300 max-w-2xl mx-auto">
          Manual transcription is slow and error-prone. This demo skips all of
          that by pretending the video is already transcribed. Click the button
          above to see a sample transcript and generate a quiz out of it.
        </p>
        <div className="mt-6">
          <Link
            href="/convert"
            className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400"
          >
            Convert Video to Text Now
          </Link>
        </div>
      </section>
    </div>
  );
}
