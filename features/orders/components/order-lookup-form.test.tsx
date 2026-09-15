import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrderLookupForm } from './order-lookup-form';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('OrderLookupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input with accessible label and submit button', () => {
    render(<OrderLookupForm />);

    expect(screen.getByLabelText(/order tracking reference/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /track/i })).toBeInTheDocument();
  });

  it('shows validation error when submitted empty', async () => {
    const user = userEvent.setup();
    render(<OrderLookupForm />);

    await user.click(screen.getByRole('button', { name: /track/i }));

    expect(screen.getByText(/please enter your order reference/i)).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('navigates to tracking page and strips leading hashtag', async () => {
    const user = userEvent.setup();
    render(<OrderLookupForm />);

    const input = screen.getByLabelText(/order tracking reference/i);
    await user.type(input, '#REF-4821');
    await user.click(screen.getByRole('button', { name: /track/i }));

    expect(mockPush).toHaveBeenCalledWith('/track/REF-4821');
  });
});
