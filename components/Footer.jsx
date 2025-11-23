export default function Footer() {
  return (
    <footer className="mt-16 border-t border-violet-100 bg-[#f5f2ff] py-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Loomia. All rights reserved.</p>
      </div>
    </footer>
  );
}
