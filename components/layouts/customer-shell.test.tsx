import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CustomerShell } from '@/components/layouts/customer-shell';

describe('CustomerShell', () => {
  it('renders required landmarks, links, and content', () => {
    render(
      <CustomerShell>
        <div>Content</div>
      </CustomerShell>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('id', 'main-content');

    expect(screen.getAllByRole('link', { name: /home/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /orders/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /track/i })[0]).toBeInTheDocument();

    const orderLink = screen.getByRole('link', { name: /order water/i });
    expect(orderLink).toHaveAttribute('href', '/order');

    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
