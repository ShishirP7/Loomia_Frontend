import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500">
            <span className="text-sm font-bold text-white">AI</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Loomia
          </span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/login" className="text-slate-200 hover:text-white">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-indigo-500 px-4 py-2 font-medium text-white hover:bg-indigo-400"
          >
            Start for free
          </Link>
        </div>
      </nav>
    </header>
  );
}
