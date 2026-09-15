import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StaffShell } from '@/components/layouts/staff-shell';

describe('StaffShell', () => {
  it('renders required navigation links, landmarks, and touch targets', () => {
    render(
      <StaffShell>
        <div>Staff Content</div>
      </StaffShell>,
    );

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('id', 'main-content');

    const assignedLink = screen.getAllByRole('link', { name: /assigned/i })[0];
    expect(assignedLink).toHaveAttribute('href', '/staff');
    expect(assignedLink.className).toContain('min-h-[44px]');

    const deliveriesLink = screen.getAllByRole('link', { name: /^deliveries/i })[0];
    expect(deliveriesLink).toHaveAttribute('href', '/staff/deliveries');

    const completedLink = screen.getAllByRole('link', { name: /completed/i })[0];
    expect(completedLink).toHaveAttribute('href', '/staff/deliveries?view=completed');

    expect(screen.getByText('Staff Content')).toBeInTheDocument();
  });
});
