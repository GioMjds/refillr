import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SignInForm } from '@/features/auth/components/sign-in-form';

vi.mock('@/features/auth/actions', () => ({
  signInAction: vi.fn().mockResolvedValue({ status: 'idle', message: '' }),
}));

describe('SignInForm', () => {
  it('shows accessible validation errors without submitting when inputs are invalid', async () => {
    const user = userEvent.setup();
    render(<SignInForm nextPath="/admin/orders" />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/enter a valid email address/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/password must contain at least 8 characters/i),
      ).toBeInTheDocument();
    });
  });
});
