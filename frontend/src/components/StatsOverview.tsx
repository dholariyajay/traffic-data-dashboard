interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  accent?: string;
}

export default function StatCard({ label, value, hint, accent = '#00C4CC' }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40">
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-2xl"
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      />
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    </div>
  );
}

interface StatsOverviewProps {
  totalVehicles: number;
  countryCount: number;
  topCountry?: string;
  topVehicle?: string;
}

export function StatsOverview({
  totalVehicles,
  countryCount,
  topCountry,
  topVehicle,
}: StatsOverviewProps) {
  const cards: StatCardProps[] = [
    {
      label: 'Total vehicles',
      value: totalVehicles.toLocaleString(),
      hint: 'Across all records',
    },
    {
      label: 'Countries',
      value: String(countryCount),
      hint: 'With traffic data',
      accent: '#6366F1',
    },
    {
      label: 'Top country',
      value: topCountry ?? '—',
      hint: 'By total volume',
      accent: '#F59E0B',
    },
    {
      label: 'Top vehicle type',
      value: topVehicle ?? '—',
      hint: 'Most common category',
      accent: '#10B981',
    },
  ];

  return (
    <section aria-label="Summary statistics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </section>
  );
}
