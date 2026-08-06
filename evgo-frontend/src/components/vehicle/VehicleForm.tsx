import { useState } from 'react';
import type { VehicleRequest, VehicleResponse } from '@/types/vehicle';

interface Props {
  initial?: VehicleResponse | null;
  onSubmit: (data: VehicleRequest) => void;
  onCancel?: () => void;
}

export default function VehicleForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<VehicleRequest>({
    vehicleModel: initial?.vehicleModel ?? '',
    batteryCapacity: initial?.batteryCapacity ?? 60,
    drivingRange: initial?.drivingRange ?? 300,
    connectorType: initial?.connectorType ?? 'CCS',
  });

  const set = (field: keyof VehicleRequest, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <div className="form-grid-2">
        <div className="form-field">
          <label htmlFor="vehicleModel">Vehicle model</label>
          <input
            id="vehicleModel"
            type="text"
            value={form.vehicleModel}
            onChange={(e) => set('vehicleModel', e.target.value)}
            required
            placeholder="e.g. Tata Nexon EV, MG ZS EV"
          />
        </div>
        <div className="form-field">
          <label htmlFor="connectorType">Connector type</label>
          <select
            id="connectorType"
            value={form.connectorType}
            onChange={(e) => set('connectorType', e.target.value)}
          >
            <option value="CCS">CCS</option>
            <option value="CHAdeMO">CHAdeMO</option>
            <option value="Type2">Type 2</option>
            <option value="GB/T">GB/T</option>
          </select>
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-field">
          <label htmlFor="batteryCapacity">Battery capacity (kWh)</label>
          <input
            id="batteryCapacity"
            type="number"
            min={10}
            max={200}
            step={0.1}
            value={form.batteryCapacity}
            onChange={(e) => set('batteryCapacity', parseFloat(e.target.value) || 0)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="drivingRange">Driving range (km)</label>
          <input
            id="drivingRange"
            type="number"
            min={50}
            max={800}
            step={1}
            value={form.drivingRange}
            onChange={(e) => set('drivingRange', parseFloat(e.target.value) || 0)}
            required
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
        <button type="submit" className="btn btn-primary">
          {initial ? 'Update vehicle' : 'Add vehicle'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
