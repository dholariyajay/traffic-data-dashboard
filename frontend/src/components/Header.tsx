interface HeaderProps {
  recordCount?: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function Header({ recordCount, onRefresh, isRefreshing }: HeaderProps) {
  return (
    <header className="border-b border-white/10 bg-[#0A1628] text-white shadow-lg shadow-slate-900/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <p className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00C4CC]/15 ring-1 ring-[#00C4CC]/30"
            aria-hidden="true"
          >
            <svg className="h-5 w-5 text-[#00C4CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-tight">Derq Traffic Dashboard</span>
            <span className="block text-xs font-medium text-slate-400">Country &amp; vehicle analytics</span>
          </span>
        </p>

        <div className="flex items-center gap-2 sm:gap-3">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Refresh dashboard data"
            >
              <svg
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="hidden sm:inline">{isRefreshing ? 'Refreshing…' : 'Refresh'}</span>
            </button>
          )}

          {recordCount !== undefined && (
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm sm:flex">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-slate-300">
                <span className="font-medium text-white">{recordCount}</span> records loaded
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
