import { useState } from 'react';
import { trafficApi } from '../services/api';
import type { TrafficRecord, Country } from '../types/traffic';
import { vehicleTypes, vehicleLabels } from '../constants/theme';
import { useRecordTable, type SortKey } from '../hooks/useRecordTable';
import { exportRecordsCsv } from '../utils/exportCsv';
import type { ToastTone } from './ui/Toast.types';
import Card from './ui/Card';
import VehicleBadge from './ui/VehicleBadge';
import EmptyState from './ui/EmptyState';
import ConfirmDialog from './ui/ConfirmDialog';
import Pagination from './ui/Pagination';

interface Props {
  records: TrafficRecord[];
  countries: Country[];
  onDataChange: () => void;
  onNotify: (text: string, tone?: ToastTone) => void;
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-[#00C4CC] focus:outline-none focus:ring-2 focus:ring-[#00C4CC]/20';

function SortButton({
  label,
  column,
  sortKey,
  sortDir,
  onSort,
  align = 'left',
}: {
  label: string;
  column: SortKey;
  sortKey: SortKey;
  sortDir: 'asc' | 'desc';
  onSort: (key: SortKey) => void;
  align?: 'left' | 'right';
}) {
  const active = sortKey === column;
  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide transition hover:text-slate-700 ${
        align === 'right' ? 'ml-auto' : ''
      } ${active ? 'text-[#00A8AF]' : 'text-slate-500'}`}
    >
      {label}
      <span aria-hidden="true" className="text-[10px]">
        {active ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    </button>
  );
}

export default function DataManager({ records, countries, onDataChange, onNotify }: Props) {
  const [countryId, setCountryId] = useState<number>(0);
  const [vehicleType, setVehicleType] = useState('');
  const [count, setCount] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TrafficRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const table = useRecordTable(records);

  const resetForm = () => {
    setCountryId(0);
    setVehicleType('');
    setCount('');
    setEditingId(null);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!countryId || !vehicleType || !count) return;

    setSubmitting(true);
    setFormError(null);
    try {
      const payload = {
        countryId,
        vehicleType,
        count: parseInt(count, 10),
      };

      if (editingId) {
        await trafficApi.update(editingId, payload);
        onNotify('Record updated');
      } else {
        await trafficApi.create(payload);
        onNotify('Record added');
      }
      resetForm();
      onDataChange();
    } catch {
      setFormError('Could not save that record. Check the values and try again.');
      onNotify('Save failed — check the values and try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (record: TrafficRecord) => {
    setCountryId(record.countryId);
    setVehicleType(record.vehicleType);
    setCount(String(record.count));
    setEditingId(record.id);
    setFormError(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await trafficApi.delete(deleteTarget.id);
      onNotify('Record deleted');
      if (editingId === deleteTarget.id) resetForm();
      setDeleteTarget(null);
      onDataChange();
    } catch {
      setFormError('Delete failed — the record may have already been removed.');
      onNotify('Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    const toExport = table.hasFilters ? table.filteredRecords : records;

    if (toExport.length === 0) {
      onNotify('Nothing to export with the current filters', 'error');
      return;
    }

    exportRecordsCsv(toExport);
    onNotify(`Exported ${toExport.length} record${toExport.length === 1 ? '' : 's'}`);
  };

  return (
    <>
      <Card>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Manage Records</h2>
            <p className="text-sm text-slate-500">Add, edit, or remove traffic entries</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {editingId && (
              <span className="inline-flex w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
                Editing record #{editingId}
              </span>
            )}
            {records.length > 0 && (
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
            )}
          </div>
        </div>

        {formError && (
          <p
            role="alert"
            className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            {formError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
              Country
            </span>
            <select
              value={countryId}
              onChange={(e) => setCountryId(Number(e.target.value))}
              className={inputClass}
              aria-label="Country"
            >
              <option value={0}>Select country...</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
              Vehicle type
            </span>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className={inputClass}
              aria-label="Vehicle type"
            >
              <option value="">Select type...</option>
              {vehicleTypes.map((vt) => (
                <option key={vt} value={vt}>{vehicleLabels[vt] || vt}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
              Count
            </span>
            <input
              type="number"
              min="0"
              placeholder="e.g. 1200"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className={inputClass}
              aria-label="Vehicle count"
            />
          </label>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              disabled={submitting || !countryId || !vehicleType || !count}
              className="flex-1 rounded-xl bg-[#00C4CC] px-4 py-2.5 text-sm font-semibold text-[#0A1628] shadow-sm transition hover:bg-[#00A8AF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Saving…' : editingId ? 'Update record' : 'Add record'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {records.length === 0 ? (
          <EmptyState
            title="No records yet"
            description="Add some data using the form above to populate the charts."
          />
        ) : (
          <>
            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="block lg:col-span-2">
                <span className="sr-only">Search records</span>
                <div className="relative">
                  <svg
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="search"
                    placeholder="Search country or vehicle…"
                    value={table.search}
                    onChange={(e) => table.setSearch(e.target.value)}
                    className={`${inputClass} pl-9`}
                    aria-label="Search records"
                  />
                </div>
              </label>

              <label className="block">
                <span className="sr-only">Filter by country</span>
                <select
                  value={table.countryFilter}
                  onChange={(e) => table.setCountryFilter(e.target.value)}
                  className={inputClass}
                  aria-label="Filter by country"
                >
                  <option value="">All countries</option>
                  {countries.map((c) => (
                    <option key={c.id} value={String(c.id)}>{c.name}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="sr-only">Filter by vehicle type</span>
                <select
                  value={table.vehicleFilter}
                  onChange={(e) => table.setVehicleFilter(e.target.value)}
                  className={inputClass}
                  aria-label="Filter by vehicle type"
                >
                  <option value="">All vehicles</option>
                  {vehicleTypes.map((vt) => (
                    <option key={vt} value={vt}>{vehicleLabels[vt]}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
              <p>
                Showing{' '}
                <span className="font-medium text-slate-700">{table.filteredCount}</span>
                {' '}of{' '}
                <span className="font-medium text-slate-700">{records.length}</span>
                {' '}records
              </p>
              {table.hasFilters && (
                <button
                  type="button"
                  onClick={table.clearFilters}
                  className="text-xs font-semibold text-[#00A8AF] hover:text-[#008f96]"
                >
                  Clear filters
                </button>
              )}
            </div>

            {table.filteredCount === 0 ? (
              <EmptyState
                title="No matching records"
                description="Try adjusting your search or filters."
              />
            ) : (
              <>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80">
                          <th scope="col" className="px-4 py-3 text-left">
                            <SortButton
                              label="Country"
                              column="country"
                              sortKey={table.sortKey}
                              sortDir={table.sortDir}
                              onSort={table.toggleSort}
                            />
                          </th>
                          <th scope="col" className="px-4 py-3 text-left">
                            <SortButton
                              label="Vehicle"
                              column="vehicle"
                              sortKey={table.sortKey}
                              sortDir={table.sortDir}
                              onSort={table.toggleSort}
                            />
                          </th>
                          <th scope="col" className="px-4 py-3 text-right">
                            <SortButton
                              label="Count"
                              column="count"
                              sortKey={table.sortKey}
                              sortDir={table.sortDir}
                              onSort={table.toggleSort}
                              align="right"
                            />
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {table.paginated.map((record) => (
                          <tr
                            key={record.id}
                            className={`transition hover:bg-slate-50/80 ${editingId === record.id ? 'bg-amber-50/50' : ''}`}
                          >
                            <td className="px-4 py-3 font-medium text-slate-800">
                              {record.country?.name || '—'}
                            </td>
                            <td className="px-4 py-3">
                              <VehicleBadge type={record.vehicleType} />
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-slate-700">
                              {record.count.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleEdit(record)}
                                className="mr-2 text-xs font-semibold text-[#00A8AF] hover:text-[#008f96]"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(record)}
                                className="text-xs font-semibold text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <Pagination
                  page={table.page}
                  totalPages={table.totalPages}
                  pageSize={table.pageSize}
                  totalItems={table.filteredCount}
                  onPageChange={table.setPage}
                  onPageSizeChange={table.setPageSize}
                />
              </>
            )}
          </>
        )}
      </Card>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete record?"
        message={
          deleteTarget
            ? `Remove ${vehicleLabels[deleteTarget.vehicleType] ?? deleteTarget.vehicleType} data for ${deleteTarget.country?.name ?? 'this country'} (${deleteTarget.count.toLocaleString()} vehicles)?`
            : ''
        }
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </>
  );
}

