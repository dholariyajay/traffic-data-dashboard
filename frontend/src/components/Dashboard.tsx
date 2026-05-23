import { useState } from 'react';
import Header from './Header';
import CountryTrafficChart from './charts/CountryTrafficChart';
import VehicleDistributionChart from './charts/VehicleDistributionChart';
import ChartToggle from './charts/ChartToggle';
import DataManager from './DataManager';
import { useTrafficData } from '../hooks/useTrafficData';
import type { ChartType } from '../types/traffic';

export default function Dashboard() {
  const { countryData, vehicleData, records, countries, loading, error, refetch } = useTrafficData();
  const [countryChartType, setCountryChartType] = useState<ChartType>('bar');
  const [vehicleChartType, setVehicleChartType] = useState<ChartType>('pie');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-slate-400 text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <p className="text-red-500">{error}</p>
          <button
            onClick={refetch}
            className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-cyan-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-slate-900">Traffic by Country</h2>
              <ChartToggle active={countryChartType} onChange={setCountryChartType} />
            </div>
            <CountryTrafficChart data={countryData} chartType={countryChartType} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-slate-900">Vehicle Distribution</h2>
              <ChartToggle active={vehicleChartType} onChange={setVehicleChartType} />
            </div>
            <VehicleDistributionChart data={vehicleData} chartType={vehicleChartType} />
          </div>
        </div>

        <DataManager records={records} countries={countries} onDataChange={refetch} />
      </main>
    </div>
  );
}
