import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrderWizard } from './order-wizard';
import { useOrderWizardStore } from '../store';

vi.mock('../actions', () => ({
  submitOrderAction: vi.fn().mockResolvedValue({
    success: true,
    orderId: 'ord_test_123',
    trackingNumber: 'REF-7890XYZ',
  }),
}));

describe('OrderWizard Component', () => {
  beforeEach(() => {
    useOrderWizardStore.getState().reset();
    vi.clearAllMocks();
  });

  it('renders Step 1 with container options and advances to Step 2', async () => {
    const user = userEvent.setup();
    render(<OrderWizard />);

    expect(
      screen.getByRole('heading', { name: /select containers/i, level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/5-gallon slim dispenser/i)).toBeInTheDocument();
    expect(screen.getByText(/5-gallon round dispenser/i)).toBeInTheDocument();

    // Advance to step 2
    const continueBtn = screen.getByRole('button', {
      name: /continue to delivery/i,
    });
    await user.click(continueBtn);

    expect(
      screen.getByRole('heading', { name: /delivery details/i, level: 1 }),
    ).toBeInTheDocument();
  });

  it('validates required fields on delivery step before proceeding to review', async () => {
    const user = userEvent.setup();
    render(<OrderWizard />);

    // Advance to step 2
    await user.click(
      screen.getByRole('button', { name: /continue to delivery/i }),
    );

    // Try to continue without filling fields
    const reviewBtn = screen.getByRole('button', {
      name: /continue to review/i,
    });
    await user.click(reviewBtn);

    // Should show validation errors
    await waitFor(() => {
      expect(
        screen.getByText(/full name must be at least 2 characters/i),
      ).toBeInTheDocument();
    });
  });

  it('allows completing the order flow to view tracking confirmation', async () => {
    const user = userEvent.setup();
    render(<OrderWizard />);

    // Step 1 -> Step 2
    await user.click(
      screen.getByRole('button', { name: /continue to delivery/i }),
    );

    // Fill delivery form
    await user.type(screen.getByLabelText(/full name/i), 'Juan Dela Cruz');
    await user.type(screen.getByLabelText(/mobile number/i), '09171234567');
    await user.type(
      screen.getByLabelText(/street address/i),
      '123 Acacia Street, Brgy. San Antonio',
    );

    // Step 2 -> Step 3
    await user.click(
      screen.getByRole('button', { name: /continue to review/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /review & payment/i, level: 1 }),
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Juan Dela Cruz')).toBeInTheDocument();
    expect(screen.getByText('Cash on Delivery')).toBeInTheDocument();

    // Confirm Order
    const confirmBtn = screen.getByRole('button', { name: /confirm order/i });
    await user.click(confirmBtn);

    // Confirmation Screen
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /order placed successfully!/i,
          level: 1,
        }),
      ).toBeInTheDocument();
      expect(screen.getByText('REF-7890XYZ')).toBeInTheDocument();
    });
  });
});
