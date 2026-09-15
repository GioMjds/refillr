import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RefillrMark } from '@/components/brand/refillr-mark';

describe('RefillrMark', () => {
  it('renders visible wordmark and link to home', () => {
    render(<RefillrMark />);
    const link = screen.getByRole('link', { name: /refillr home/i });
    expect(link).toHaveAttribute('href', '/');
    expect(screen.getByText('Refillr')).toBeInTheDocument();
  });

  it('hides decorative icon on compact mode while retaining accessible name', () => {
    render(<RefillrMark compact />);
    const link = screen.getByRole('link', { name: /refillr home/i });
    expect(link).toBeInTheDocument();
    const icon = link.querySelector('svg');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
