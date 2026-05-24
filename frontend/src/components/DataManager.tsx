import { useState } from 'react';
import { trafficApi } from '../services/api';
import type { TrafficRecord, Country } from '../types/traffic';
import { vehicleTypes, vehicleLabels } from '../constants/theme';
import Card from './ui/Card';
import VehicleBadge from './ui/VehicleBadge';
import EmptyState from './ui/EmptyState';

interface Props {
  records: TrafficRecord[];
  countries: Country[];
  onDataChange: () => void;
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-[#00C4CC] focus:outline-none focus:ring-2 focus:ring-[#00C4CC]/20';

export default function DataManager({ records, countries, onDataChange }: Props) {
  const [countryId, setCountryId] = useState<number>(0);
  const [vehicleType, setVehicleType] = useState('');
  const [count, setCount] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
      } else {
        await trafficApi.create(payload);
      }
      resetForm();
      onDataChange();
    } catch {
      setFormError('Could not save that record. Check the values and try again.');
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

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this record?')) return;

    try {
      await trafficApi.delete(id);
      onDataChange();
    } catch {
      setFormError('Delete failed — the record may have already been removed.');
    }
  };

  return (
    <Card>
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Manage Records</h2>
          <p className="text-sm text-slate-500">Add, edit, or remove traffic entries</p>
        </div>
        {editingId && (
          <span className="inline-flex w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
            Editing record #{editingId}
          </span>
        )}
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
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Country
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Vehicle
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Count
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((record) => (
                  <tr key={record.id} className="transition hover:bg-slate-50/80">
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
                        onClick={() => handleDelete(record.id)}
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
      )}
    </Card>
  );
}
