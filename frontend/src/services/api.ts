import axios from 'axios';
import type { CountryTraffic, VehicleDistribution, TrafficRecord, Country } from '../types/traffic';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({ baseURL: API_BASE });

export const trafficApi = {
  getByCountry: () =>
    client.get<{ data: CountryTraffic[] }>('/traffic/by-country').then((r) => r.data.data),

  getByVehicleType: () =>
    client.get<{ data: VehicleDistribution[] }>('/traffic/by-vehicle-type').then((r) => r.data.data),

  getAll: () =>
    client.get<{ data: TrafficRecord[] }>('/traffic').then((r) => r.data.data),

  create: (data: { countryId: number; vehicleType: string; count: number }) =>
    client.post('/traffic', data).then((r) => r.data.data),

  update: (id: number, data: { countryId?: number; vehicleType?: string; count?: number }) =>
    client.put(`/traffic/${id}`, data).then((r) => r.data.data),

  delete: (id: number) =>
    client.delete(`/traffic/${id}`),

  getCountries: () =>
    client.get<{ data: Country[] }>('/countries').then((r) => r.data.data),
};
