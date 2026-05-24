import { useMemo, useState } from 'react';
import Header from './Header';
import CountryTrafficChart from './charts/CountryTrafficChart';
import VehicleDistributionChart from './charts/VehicleDistributionChart';
import ChartCard from './ChartCard';
import DataManager from './DataManager';
import DashboardSkeleton from './ui/DashboardSkeleton';
import ToastStack from './ui/Toast';
import { StatsOverview } from './StatsOverview';
import { useTrafficData } from '../hooks/useTrafficData';
import { useToast } from '../hooks/useToast';
import { vehicleLabels } from '../constants/theme';
import type { ChartType } from '../types/traffic';

export default function Dashboard() {
  const { countryData, vehicleData, records, countries, loading, isRefreshing, error, refetch } =
    useTrafficData();
  const { toasts, push, dismiss } = useToast();
  const [countryChartType, setCountryChartType] = useState<ChartType>('bar');
  const [vehicleChartType, setVehicleChartType] = useState<ChartType>('pie');

  const stats = useMemo(() => {
    const totalVehicles = records.reduce((sum, r) => sum + r.count, 0);
    const topCountry = countryData[0]?.country;
    const topVehicleRaw = vehicleData[0]?.vehicleType;
    const topVehicle = topVehicleRaw ? vehicleLabels[topVehicleRaw] || topVehicleRaw : undefined;

    return {
      totalVehicles,
      countryCount: countryData.length,
      topCountry,
      topVehicle,
    };
  }, [records, countryData, vehicleData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white">
        <Header onRefresh={refetch} isRefreshing={isRefreshing} />
        <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
          <div className="rounded-2xl border border-red-100 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-500">Something went wrong</p>
            <p className="mt-2 text-slate-600">{error}</p>
            <button
              type="button"
              onClick={refetch}
              className="mt-6 rounded-xl bg-[#00C4CC] px-5 py-2.5 text-sm font-semibold text-[#0A1628] hover:bg-[#00A8AF]"
            >
              Try again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white">
      <Header
        recordCount={records.length}
        onRefresh={refetch}
        isRefreshing={isRefreshing}
      />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <StatsOverview
          totalVehicles={stats.totalVehicles}
          countryCount={stats.countryCount}
          topCountry={stats.topCountry}
          topVehicle={stats.topVehicle}
        />

        <section
          aria-label="Traffic charts"
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <ChartCard
            title="Traffic by Country"
            description="Total vehicle counts aggregated by country"
            chartType={countryChartType}
            onChartTypeChange={setCountryChartType}
          >
            <CountryTrafficChart
              key={`country-${countryData.length}-${records.length}`}
              data={countryData}
              chartType={countryChartType}
            />
          </ChartCard>

          <ChartCard
            title="Vehicle Distribution"
            description="Share of traffic across vehicle categories"
            chartType={vehicleChartType}
            onChartTypeChange={setVehicleChartType}
          >
            <VehicleDistributionChart
              key={`vehicle-${vehicleData.length}-${records.length}`}
              data={vehicleData}
              chartType={vehicleChartType}
            />
          </ChartCard>
        </section>

        <DataManager
          records={records}
          countries={countries}
          onDataChange={refetch}
          onNotify={push}
        />
      </main>

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
