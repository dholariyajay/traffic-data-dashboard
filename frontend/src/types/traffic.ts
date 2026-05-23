export interface CountryTraffic {
  country: string;
  code: string;
  totalCount: number;
}

export interface VehicleDistribution {
  vehicleType: string;
  totalCount: number;
}

export interface TrafficRecord {
  id: number;
  countryId: number;
  country: {
    id: number;
    name: string;
    code: string;
  };
  vehicleType: string;
  count: number;
  recordedAt: string;
}

export interface Country {
  id: number;
  name: string;
  code: string;
}

export type ChartType = 'bar' | 'line' | 'pie';
