export const theme = {
  navy: '#0A1628',
  navyLight: '#132337',
  cyan: '#00C4CC',
  cyanDark: '#00A8AF',
  surface: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  muted: '#64748B',
  text: '#0F172A',
};

export const chartColors = [
  '#00C4CC',
  '#6366F1',
  '#F59E0B',
  '#10B981',
  '#F43F5E',
  '#8B5CF6',
  '#0EA5E9',
  '#84CC16',
];

export const vehicleColors: Record<string, string> = {
  car: '#00C4CC',
  truck: '#6366F1',
  motorcycle: '#F59E0B',
  bus: '#10B981',
  bicycle: '#8B5CF6',
};

export const vehicleLabels: Record<string, string> = {
  car: 'Cars',
  truck: 'Trucks',
  motorcycle: 'Motorcycles',
  bus: 'Buses',
  bicycle: 'Bicycles',
};

export const vehicleTypes = ['car', 'truck', 'motorcycle', 'bus', 'bicycle'] as const;
