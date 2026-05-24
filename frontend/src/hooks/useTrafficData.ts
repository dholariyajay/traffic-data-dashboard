import { useState, useEffect, useCallback, useRef } from 'react';
import { trafficApi } from '../services/api';
import type { CountryTraffic, VehicleDistribution, TrafficRecord, Country } from '../types/traffic';

export function useTrafficData() {
  const [countryData, setCountryData] = useState<CountryTraffic[]>([]);
  const [vehicleData, setVehicleData] = useState<VehicleDistribution[]>([]);
  const [records, setRecords] = useState<TrafficRecord[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      if (hasLoaded.current) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      const [byCountry, byVehicle, allRecords, countryList] = await Promise.all([
        trafficApi.getByCountry(),
        trafficApi.getByVehicleType(),
        trafficApi.getAll(),
        trafficApi.getCountries(),
      ]);
      setCountryData(byCountry);
      setVehicleData(byVehicle);
      setRecords(allRecords);
      setCountries(countryList);
      hasLoaded.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    countryData,
    vehicleData,
    records,
    countries,
    loading,
    isRefreshing,
    error,
    refetch: fetchData,
  };
}
