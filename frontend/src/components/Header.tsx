export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-cyan-500 rounded-full" />
          <h1 className="text-xl font-semibold text-slate-900">Derq Traffic Dashboard</h1>
        </div>
      </div>
    </header>
  );
}
