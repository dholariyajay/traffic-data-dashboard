import { vehicleColors, vehicleLabels } from '../../constants/theme';

interface VehicleBadgeProps {
  type: string;
}

export default function VehicleBadge({ type }: VehicleBadgeProps) {
  const label = vehicleLabels[type] || type;
  const color = vehicleColors[type] || '#64748B';

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
      style={{
        backgroundColor: `${color}18`,
        color,
        border: `1px solid ${color}33`,
      }}
    >
      {label}
    </span>
  );
}
