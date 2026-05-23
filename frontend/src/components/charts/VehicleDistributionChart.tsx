import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { VehicleDistribution, ChartType } from '../../types/traffic';
import { chartColors, vehicleLabels } from '../../constants/theme';
import ChartTooltip from './ChartTooltip';
import EmptyState from '../ui/EmptyState';

interface Props {
  data: VehicleDistribution[];
  chartType: ChartType;
}

const axisStyle = { fontSize: 11, fill: '#64748B' };
const gridStroke = '#E2E8F0';

function formatData(data: VehicleDistribution[]) {
  return data.map((d) => ({
    ...d,
    label: vehicleLabels[d.vehicleType] || d.vehicleType,
  }));
}

export default function VehicleDistributionChart({ data, chartType }: Props) {
  const formatted = formatData(data);

  if (formatted.length === 0) {
    return (
      <EmptyState
        title="No vehicle breakdown yet"
        description="Records you add will show up here by vehicle type."
      />
    );
  }

  if (chartType === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={formatted}
            dataKey="totalCount"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={2}
            label={({ label, percent }) =>
              percent > 0.06 ? `${label} ${(percent * 100).toFixed(0)}%` : ''
            }
          >
            {formatted.map((_, idx) => (
              <Cell key={idx} fill={chartColors[idx % chartColors.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === 'line') {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={formatted} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={gridStroke} vertical={false} />
          <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="monotone"
            dataKey="totalCount"
            name="Count"
            stroke="#6366F1"
            strokeWidth={2.5}
            dot={{ fill: '#6366F1', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#4F46E5' }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={formatted} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="4 4" stroke={gridStroke} vertical={false} />
        <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgb(99 102 241 / 0.08)' }} />
        <Bar dataKey="totalCount" name="Count" radius={[6, 6, 0, 0]} maxBarSize={56}>
          {formatted.map((_, idx) => (
            <Cell key={idx} fill={chartColors[idx % chartColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
