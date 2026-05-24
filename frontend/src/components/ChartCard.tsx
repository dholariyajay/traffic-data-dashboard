import type { ReactNode } from 'react';
import Card from './ui/Card';
import ChartToggle from './charts/ChartToggle';
import type { ChartType } from '../types/traffic';

interface ChartCardProps {
  title: string;
  description?: string;
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  children: ReactNode;
}

export default function ChartCard({
  title,
  description,
  chartType,
  onChartTypeChange,
  children,
}: ChartCardProps) {
  return (
    <Card className="flex flex-col">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
          )}
        </div>
        <ChartToggle active={chartType} onChange={onChartTypeChange} />
      </div>
      <div className="min-h-[320px] flex-1">{children}</div>
    </Card>
  );
}
