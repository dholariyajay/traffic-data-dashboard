import type { ChartType } from '../../types/traffic';

interface ChartToggleProps {
  active: ChartType;
  onChange: (type: ChartType) => void;
}

const options: { value: ChartType; label: string }[] = [
  { value: 'bar', label: 'Bar' },
  { value: 'line', label: 'Line' },
  { value: 'pie', label: 'Pie' },
];

export default function ChartToggle({ active, onChange }: ChartToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Chart type"
      className="inline-flex gap-1 rounded-xl bg-slate-100 p-1 ring-1 ring-slate-200/80"
    >
      {options.map((opt) => {
        const isActive = active === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all sm:text-sm ${
              isActive
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
