import type { TrafficRecord } from '../types/traffic';
import { vehicleLabels } from '../constants/theme';

export function exportRecordsCsv(records: TrafficRecord[], filename = 'traffic-records.csv') {
  const header = ['Country', 'Vehicle Type', 'Count', 'Recorded At'];
  const rows = records.map((r) => [
    r.country?.name ?? '',
    vehicleLabels[r.vehicleType] ?? r.vehicleType,
    String(r.count),
    r.recordedAt ? new Date(r.recordedAt).toLocaleString() : '',
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
