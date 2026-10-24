import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App.jsx';

describe('Performance Optimization Dashboard', () => {
  it('renders key metrics and initiatives', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /performance overview/i })).toBeInTheDocument();
    expect(screen.getByText('Reduce checkout API latency')).toBeInTheDocument();
    expect(screen.getByText('Optimization initiatives')).toBeInTheDocument();
  });

  it('shows an empty state when search has no matches and can clear filters', () => {
    render(<App />);
    fireEvent.change(screen.getByRole('textbox', { name: /search initiatives/i }), { target: { value: 'no-such-initiative' } });
    expect(screen.getByText('No data found')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /clear filters/i }));
    expect(screen.getByText('Reduce checkout API latency')).toBeInTheDocument();
  });

  it('filters initiatives by status', () => {
    render(<App />);
    fireEvent.change(screen.getByRole('combobox', { name: /filter by status/i }), { target: { value: 'Blocked' } });
    expect(screen.getByText('Review database query plans')).toBeInTheDocument();
    expect(screen.queryByText('Reduce checkout API latency')).not.toBeInTheDocument();
  });

  it('validates a short title and creates a valid initiative', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /new initiative/i }));
    fireEvent.click(screen.getByRole('button', { name: /create initiative/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/at least 4 characters/i);
    fireEvent.change(screen.getByLabelText(/initiative title/i), { target: { value: 'Improve caching' } });
    fireEvent.click(screen.getByRole('button', { name: /create initiative/i }));
    expect(screen.getByText('Improve caching')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/created successfully/i);
  });

  it('updates initiative status', () => {
    render(<App />);
    const status = screen.getByRole('combobox', { name: 'Status for OPT-1042' });
    fireEvent.change(status, { target: { value: 'Completed' } });
    expect(within(status).getByRole('option', { name: 'Completed' }).selected).toBe(true);
    expect(screen.getByRole('status')).toHaveTextContent(/updated to Completed/i);
  });
});
