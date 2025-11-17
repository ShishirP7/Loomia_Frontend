export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950/70 py-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-xs text-slate-400">
        <p>© {new Date().getFullYear()} Loomia. All rights reserved.</p>
      </div>
    </footer>
  );
}
