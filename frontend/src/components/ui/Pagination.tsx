import { getDisplayRange, getPaginationRange } from '../../utils/pagination';

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
const SHOW_EDGE_JUMP = 8;

interface Props {
  page: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

function NavIcon({ path }: { path: string }) {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  );
}

const navBtnClass =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C4CC]/30 disabled:pointer-events-none disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-300';

const pageBtnClass =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-200 px-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C4CC]/30';

export default function Pagination({
  page,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: Props) {
  if (totalItems === 0) return null;

  const { start, end } = getDisplayRange(page, pageSize, totalItems);
  const pageItems = getPaginationRange(page, totalPages);
  const showControls = totalPages > 1;
  const showEdgeJump = totalPages >= SHOW_EDGE_JUMP;

  return (
    <nav
      aria-label="Table pagination"
      className="mt-4 grid grid-cols-1 items-center gap-4 border-t border-slate-100 pt-4 md:grid-cols-3"
    >
      <p className="text-center text-sm text-slate-500 md:text-left">
        Showing{' '}
        <span className="font-medium text-slate-700">
          {start.toLocaleString()}–{end.toLocaleString()}
        </span>
        {' '}of{' '}
        <span className="font-medium text-slate-700">{totalItems.toLocaleString()}</span>
      </p>

      <div className="flex justify-center">
        {showControls ? (
          <div className="flex items-center gap-1">
            {showEdgeJump && (
              <button
                type="button"
                onClick={() => onPageChange(1)}
                disabled={page <= 1}
                className={navBtnClass}
                aria-label="Go to first page"
              >
                <NavIcon path="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className={`${navBtnClass} gap-1 px-2.5`}
              aria-label="Go to previous page"
            >
              <NavIcon path="M15 19l-7-7 7-7" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            <ol className="flex items-center gap-1 px-1">
              {pageItems.map((item, index) =>
                item === 'ellipsis' ? (
                  <li key={`ellipsis-${index}`} aria-hidden="true">
                    <span className="inline-flex h-9 min-w-9 items-center justify-center text-sm text-slate-400">
                      …
                    </span>
                  </li>
                ) : (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => onPageChange(item)}
                      aria-label={`Go to page ${item}`}
                      aria-current={item === page ? 'page' : undefined}
                      className={`${pageBtnClass} ${
                        item === page
                          ? 'border-[#00C4CC]/40 bg-[#00C4CC]/10 font-semibold text-[#008f96]'
                          : 'bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item}
                    </button>
                  </li>
                ),
              )}
            </ol>

            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className={`${navBtnClass} gap-1 px-2.5`}
              aria-label="Go to next page"
            >
              <span className="hidden sm:inline">Next</span>
              <NavIcon path="M9 5l7 7-7 7" />
            </button>
            {showEdgeJump && (
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                disabled={page >= totalPages}
                className={navBtnClass}
                aria-label="Go to last page"
              >
                <NavIcon path="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </button>
            )}
          </div>
        ) : null}
      </div>

      <label className="flex items-center justify-center gap-2 text-sm text-slate-500 md:justify-end">
        <span className="whitespace-nowrap">Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 shadow-sm focus:border-[#00C4CC] focus:outline-none focus:ring-2 focus:ring-[#00C4CC]/20"
          aria-label="Rows per page"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
    </nav>
  );
}
