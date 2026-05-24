import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

vi.mock('../services/api', () => ({
  trafficApi: {
    getByCountry: vi.fn().mockResolvedValue([
      { country: 'United States', code: 'US', totalCount: 45200 },
      { country: 'Canada', code: 'CA', totalCount: 31800 },
    ]),
    getByVehicleType: vi.fn().mockResolvedValue([
      { vehicleType: 'car', totalCount: 128400 },
      { vehicleType: 'truck', totalCount: 43200 },
    ]),
    getAll: vi.fn().mockResolvedValue([]),
    getCountries: vi.fn().mockResolvedValue([
      { id: 1, name: 'United States', code: 'US' },
    ]),
  },
}));

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<Dashboard />);
    expect(screen.getByText('Loading traffic data...')).toBeInTheDocument();
  });

  it('renders chart sections after data loads', async () => {
    render(<Dashboard />);

    const heading = await screen.findByText('Traffic by Country');
    expect(heading).toBeInTheDocument();
    expect(screen.getByText('Vehicle Distribution')).toBeInTheDocument();
  });

  it('renders the data manager section', async () => {
    render(<Dashboard />);

    const heading = await screen.findByText('Manage Records');
    expect(heading).toBeInTheDocument();
  });

  it('shows empty state message when no records', async () => {
    render(<Dashboard />);

    const msg = await screen.findByText(/No records yet/);
    expect(msg).toBeInTheDocument();
  });
});
