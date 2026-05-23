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
import type { CountryTraffic, ChartType } from '../../types/traffic';
import { chartColors } from '../../constants/theme';
import ChartTooltip from './ChartTooltip';
import EmptyState from '../ui/EmptyState';

interface Props {
  data: CountryTraffic[];
  chartType: ChartType;
}

const axisStyle = { fontSize: 11, fill: '#64748B' };
const gridStroke = '#E2E8F0';

function shortenCountry(name: string) {
  return name.length > 12 ? `${name.slice(0, 10)}…` : name;
}

export default function CountryTrafficChart({ data, chartType }: Props) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No country data yet"
        description="Add traffic records below to populate this chart."
      />
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    shortName: shortenCountry(d.country),
  }));

  if (chartType === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="totalCount"
            nameKey="country"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={2}
            label={({ country, percent }) =>
              percent > 0.06 ? `${country} ${(percent * 100).toFixed(0)}%` : ''
            }
          >
            {chartData.map((_, idx) => (
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
        <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={gridStroke} vertical={false} />
          <XAxis dataKey="shortName" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="monotone"
            dataKey="totalCount"
            name="Vehicles"
            stroke="#00C4CC"
            strokeWidth={2.5}
            dot={{ fill: '#00C4CC', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#00A8AF' }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="4 4" stroke={gridStroke} vertical={false} />
        <XAxis dataKey="shortName" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgb(0 196 204 / 0.08)' }} />
        <Bar dataKey="totalCount" name="Vehicles" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {chartData.map((_, idx) => (
            <Cell key={idx} fill={chartColors[idx % chartColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
