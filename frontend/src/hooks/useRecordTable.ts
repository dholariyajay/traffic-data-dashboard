import { useEffect, useMemo, useState } from 'react';
import type { TrafficRecord } from '../types/traffic';
import { vehicleLabels } from '../constants/theme';

export type SortKey = 'country' | 'vehicle' | 'count';
export type SortDir = 'asc' | 'desc';

const DEFAULT_PAGE_SIZE = 10;

export function useRecordTable(records: TrafficRecord[]) {
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('count');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const filtered = useMemo(() => {
    let list = records;

    const query = search.trim().toLowerCase();
    if (query) {
      list = list.filter((r) => {
        const country = r.country?.name.toLowerCase() ?? '';
        const vehicle = r.vehicleType.toLowerCase();
        const label = (vehicleLabels[r.vehicleType] ?? '').toLowerCase();
        return country.includes(query) || vehicle.includes(query) || label.includes(query);
      });
    }

    if (countryFilter) {
      list = list.filter((r) => String(r.countryId) === countryFilter);
    }

    if (vehicleFilter) {
      list = list.filter((r) => r.vehicleType === vehicleFilter);
    }

    return list;
  }, [records, search, countryFilter, vehicleFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'country') {
        cmp = (a.country?.name ?? '').localeCompare(b.country?.name ?? '');
      } else if (sortKey === 'vehicle') {
        cmp = a.vehicleType.localeCompare(b.vehicleType);
      } else {
        cmp = a.count - b.count;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, countryFilter, vehicleFilter, pageSize]);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'count' ? 'desc' : 'asc');
    }
    setPage(1);
  };

  const hasFilters = Boolean(search.trim() || countryFilter || vehicleFilter);

  const clearFilters = () => {
    setSearch('');
    setCountryFilter('');
    setVehicleFilter('');
    setPage(1);
  };

  return {
    search,
    setSearch,
    countryFilter,
    setCountryFilter,
    vehicleFilter,
    setVehicleFilter,
    sortKey,
    sortDir,
    toggleSort,
    page: currentPage,
    setPage,
    totalPages,
    pageSize,
    setPageSize: handlePageSizeChange,
    filteredCount: filtered.length,
    paginated,
    filteredRecords: sorted,
    hasFilters,
    clearFilters,
  };
}
