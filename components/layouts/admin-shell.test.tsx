import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminShell } from '@/components/layouts/admin-shell';

describe('AdminShell', () => {
  it('renders required navigation links, mobile trigger, and landmarks', () => {
    render(
      <AdminShell>
        <div>Admin Content</div>
      </AdminShell>,
    );

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('id', 'main-content');

    expect(
      screen.getByRole('button', {
        name: /open menu|navigation menu|toggle navigation/i,
      }),
    ).toBeInTheDocument();

    const overviewLinks = screen.getAllByRole('link', {
      name: /overview|dashboard/i,
    });
    expect(overviewLinks.some((l) => l.getAttribute('href') === '/admin')).toBe(
      true,
    );

    const ordersLinks = screen.getAllByRole('link', { name: /orders/i });
    expect(
      ordersLinks.some((l) => l.getAttribute('href') === '/admin/orders'),
    ).toBe(true);

    const customersLinks = screen.getAllByRole('link', { name: /customers/i });
    expect(
      customersLinks.some((l) => l.getAttribute('href') === '/admin/customers'),
    ).toBe(true);

    const deliveriesLinks = screen.getAllByRole('link', {
      name: /deliveries/i,
    });
    expect(
      deliveriesLinks.some((l) => l.getAttribute('href') === '/admin/deliveries'),
    ).toBe(true);

    const reportsLinks = screen.getAllByRole('link', { name: /reports/i });
    expect(
      reportsLinks.some((l) => l.getAttribute('href') === '/admin/reports'),
    ).toBe(true);

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });
});
