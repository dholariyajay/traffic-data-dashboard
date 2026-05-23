import { useState } from 'react';
import { trafficApi } from '../services/api';
import type { TrafficRecord, Country } from '../types/traffic';

interface Props {
  records: TrafficRecord[];
  countries: Country[];
  onDataChange: () => void;
}

const VEHICLE_TYPES = ['car', 'truck', 'motorcycle', 'bus', 'bicycle'];

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
      if (editingId) {
        await trafficApi.update(editingId, {
          countryId,
          vehicleType,
          count: parseInt(count),
        });
      } else {
        await trafficApi.create({
          countryId,
          vehicleType,
          count: parseInt(count),
        });
      }
      resetForm();
      onDataChange();
    } catch (err) {
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-medium text-slate-900 mb-4">Manage Records</h2>

      {formError && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {formError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 mb-6">
        <select
          value={countryId}
          onChange={(e) => setCountryId(Number(e.target.value))}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value={0}>Select country...</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">Vehicle type...</option>
          {VEHICLE_TYPES.map((vt) => (
            <option key={vt} value={vt}>{vt.charAt(0).toUpperCase() + vt.slice(1)}</option>
          ))}
        </select>

        <input
          type="number"
          min="0"
          placeholder="Count"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        <button
          type="submit"
          disabled={submitting || !countryId || !vehicleType || !count}
          className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {editingId ? 'Update' : 'Add Record'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="text-slate-500 px-3 py-2 text-sm hover:text-slate-700"
          >
            Cancel
          </button>
        )}
      </form>

      {records.length === 0 ? (
        <p className="text-slate-400 text-sm py-4 text-center">
          No records yet. Add some data using the form above.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 font-medium text-slate-600">Country</th>
                <th className="text-left py-2 px-3 font-medium text-slate-600">Vehicle</th>
                <th className="text-right py-2 px-3 font-medium text-slate-600">Count</th>
                <th className="text-right py-2 px-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 px-3">{record.country?.name || '—'}</td>
                  <td className="py-2 px-3 capitalize">{record.vehicleType}</td>
                  <td className="py-2 px-3 text-right font-mono">{record.count.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-cyan-600 hover:text-cyan-800 mr-3 text-xs font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
